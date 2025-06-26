import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Globalconstants } from 'src/app/Helper/globalconstants';
import { OnlineExamServiceService } from 'src/app/Services/online-exam-service.service';


export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-proposal-maker',
  templateUrl: './proposal-maker.component.html',
  styleUrls: ['./proposal-maker.component.scss']
})
export class ProposalMakerComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;
  sMsg: string = '';
  _FilteredList = [];

  _IndexList: any;
  _Records: any;
  DataUploadForm: FormGroup;

  public message: string;
  _HeaderList: any;
  _ColNameList = [];
  _CSVData: any;
  public records: any[] = [];
  papa: any;
  _TempID: any = 0;

  myFiles: string[] = [];
  _FileDetails: string[][] = [];
  first = 0;
  rows = 10;

  isChecked: boolean = false;
  proposalForm: FormGroup;
  uploadForm: FormGroup;

  constructor(public toastr: ToastrService,
    private fb: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,) { }

  ngOnInit(): void {

    this.proposalForm = this.fb.group({
      File_No: ['', [Validators.required, Validators.minLength(10)]],
      remark: [],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID')
    });

    this.uploadForm = this.fb.group({
      user_Token: localStorage.getItem('User_Token'),
      entry_by: localStorage.getItem('UserID'),
      CSVData: [""]
    });

    this.BindHeader(this._FilteredList, this._FilteredList);
    this.prepareTableData(this._FilteredList, this._FilteredList);

  }

  toggleChange() {
    console.log("this is the value", this.isChecked)
  }

  // submit(){
  //   console.log("this is the log",this.proposalForm.controls['checkBox'].value);
  //   console.log("this is the log", this.proposalForm);

  // }

  submit() {
    const apiUrl = this._global.baseAPIUrl + "BranchInward/AddEditProposalMaker";
    this._onlineExamService
      .postData(this.proposalForm.value, apiUrl)
      // .pipe(first())
      .subscribe((data) => {
        if (data == 'Record save successfully' || data == 'Record updated successfully') {
          this.ShowMessage(data);
        }
        else {
          this.ShowErrormessage(data);
        }

        this.OnReset();
      });


  }

  ShowMessage(data) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success</span> <span data-notify="message"> ' + data + ' </span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-success alert-notify"
      }
    );
  }






  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    //   console.log($event.target.value);

    let val = $event.target.value;
    let that = this
    this._FilteredList = this.records.filter(function (d) {
      //  console.log(d);
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  OnReset() {
    this.proposalForm.controls['File_No'].setValue('');
    this.proposalForm.controls['remark'].setValue('');

  }
  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    //console.log(this.DataUploadForm);

    if (this.uploadForm.valid && files.length > 0) {
      var file = files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        var csv = event.target.result; // Content of CSV file
        this.papa.parse(csv, {
          skipEmptyLines: true,
          header: true,
          complete: (results) => {
            for (let i = 0; i < results.data.length; i++) {
              let orderDetails = {
                order_id: results.data[i].Address,
                age: results.data[i].Age
              };
              this._Records.push(orderDetails);
            }
            // console.log(this.test);
            // console.log('Parsed: k', results.data);
          }
        });
      }
    } else {
      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select <br> <b>Csv File</b><br><b>Template</b><br> before uploading!</span></div>',
        "",
        {
          timeOut: 3000,
          closeButton: true,
          enableHtml: true,
          tapToDismiss: false,
          titleClass: "alert-title",
          positionClass: "toast-top-center",
          toastClass:
            "ngx-toastr alert alert-dismissible alert-danger alert-notify"
        }
      );
    }
  }

  uploadListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      // console.log(input.files[0]);
      reader.readAsText(input.files[0]);
      $(".selected-file-name").html(input.files[0].name);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this._CSVData = csvRecordsArray;
        this._IndexList = csvRecordsArray;

        // alert(headersRow);
        // alert(this._ColNameList);
        //let ColName = 
        let validFile = this.getDisplayNames(csvRecordsArray);
        if (validFile == false) {
          //  console.log('Not Valid File', csvRecordsArray);
          this.fileReset();
        } else {
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);

          this._FilteredList = this.records;

          //  console.log(this.records);
          //console.log("_FilteredList",this._FilteredList);

          this.prepareTableDataForCSV(this._FilteredList);

          (<HTMLInputElement>document.getElementById('csvReader')).value = '';
          //  console.log('Records', this._FilteredList);
        }


      };

      reader.onerror = function () {
        // console.log('error is occurred while reading file!');
      };

    } else {
      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select A Valid CSV File And Template</span></div>',
        "",
        {
          timeOut: 3000,
          closeButton: true,
          enableHtml: true,
          tapToDismiss: false,
          titleClass: "alert-title",
          positionClass: "toast-top-center",
          toastClass:
            "ngx-toastr alert alert-dismissible alert-danger alert-notify"
        }
      );
      this.fileReset();
    }
    this._FilteredList = this.records
  }

  // checkDateFormat(date) {
  // //  console.log("Date",date);

  //   if (date !="")
  //   {
  //   let dateArr = date.split('-');
  //   const dateString = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
  //   if(isNaN(dateArr[0]) || isNaN(dateArr[1]) || isNaN(dateArr[2])) {
  //     return false;
  //   }
  //   if(isNaN(new Date(dateString).getTime())) {
  //     return false;
  //   }
  //   return true;
  // }
  // else
  // {
  //   return true;
  // }
  // }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        const single = []
        for (let i = 0; i < this._ColNameList.length; i++) {
          single.push(curruntRecord[i].toString().trim())
        }
        csvArr.push(single)
      }
      console.log("this is the ", csvArr);

    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    var headers;
    // headers ="NewCBSAccountNo,ApplicationNo,CBSCUSTIC,Team,HandliedBy,ProductCode,Product,ProductDescription,JCCode,JCName,Zone,CustomerName,DBDate,FinalRemarks,DisbursedMonth";
    headers = ['FileBarcode', 'Remark'];
    // console.log("headers_1",headers);
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }

    return headers;


  }

  fileReset() {
    //this.csvReader.nativeElement.value = "";  
    this.records = [];
  }

  onSubmit() {

    this.submitted = true;

    if (this._CSVData != null && this._CSVData != undefined) {
      this.uploadForm.patchValue({
        // id: localStorage.getItem('UserID'),
        CSVData: this._CSVData,
        // User_Token: localStorage.getItem('User_Token')
      });
      const apiUrl = this._global.baseAPIUrl + 'DataUpload/AddEditProposalMakerBulk';
      this._onlineExamService.postData(this.uploadForm.value, apiUrl)
        // .pipe(first())
        .subscribe(data => {
          if (data == "Record updated successfully" || data == "Record save successfully") {
            // alert(data);
            this.showSuccessmessage(data);
          } else {
            this.ShowErrormessage(data);
          }
          this.BindHeader(this._FilteredList, this._FilteredList);

        });

      //  }     
    }
    else {
      this.ShowErrormessage("please select file");

    }
  }

  ShowErrormessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> ' + data + ' </span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-danger alert-notify"
      }
    );

  }

  onFormat(csvRecordsArr: any) {
    //   let dt;

  }

  getDisplayNames(csvRecordsArr: any) {

    //  console.log("csvRecordsArr",csvRecordsArr);

    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];

    // console.log("headers",headers);
    // console.log("headers",headers.length);
    // console.log(this._ColNameList);
    if (headers.length != 2) {
      // alert('Invalid No. of Column Expected :- ' + this._ColNameList.length);
      var msg = 'Invalid No. of Column Expected :- ' + 2;
      //this.showmessage(msg);
      this.ShowErrormessage(msg);

      return false;
    }
    // this._HeaderList ="POD No,Invoice Details,Invoice No,Invoice Date,Vendor Name,Barcode No";

    //  this._ColNameList[0] ="appl_apac";
    this._ColNameList[0] = "File_No";
    this._ColNameList[1] = "remark";


    return true;
  }

  GetHeaderNames() {
    //  this._HeaderList = "";
    this._HeaderList = "File Barcode,Remark";

  }

  downloadFile() {
    const filename = 'ProposalMakerFormat_CSV';
    let csvData = "FileBarcode,Remark";

    // let csvData = "AccountNo,AppNo,CRN,URN,DBDate,DBMonth,DBYear,ProductCode,ProductType,ProductName,COD_OFFICR_ID,CustomerName,BranchCode,BranchName,Zone,ClosedDate";    
    //console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = -1;
    // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
    // navigator.userAgent.indexOf('Chrome') == -1; 

    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);

  }

  showmessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> ' + data + ' </span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-success alert-notify"
      }
    );


  }

  showSuccessmessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title"> </span> <span data-notify="message"> ' + data + ' </span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-success alert-notify"
      }
    );


  }

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;

  prepareTableDataForCSV(tableData) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      //  { field: 'appl_apac', header: "APPL_APAC", index: 1 }, FileBarcode,Remark
      { field: 'File_No', header: 'FileBarcode', index: 2 },
      { field: 'remark', header: "Remark", index: 1 },
      // { field: 'appl', header: 'APPL', index: 2 },
      // { field: 'apac', header: "APAC", index: 1 }, 
      // { field: 'contract_no', header: 'CONTRACT_NO', index: 2 },
      // { field: 'apac_effective_date', header: "APAC_EFFECTIVE_DATE", index: 1 }, 
      // { field: 'product', header: 'PRODUCT', index: 2 },
      // { field: 'location', header: "LOCATION", index: 1 }, 
      // { field: 'sub_lcoation', header: 'SUB_LCOATION', index: 2 },
      // { field: 'tenure', header: "TENURE", index: 1 }, 
      // { field: 'maturity_date', header: 'MATURITY_DATE', index: 2 },

    ];
    console.log("this.formattedData", tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        //  'appl_apac': el[0],   
        'File_No': el[0],
        'remark': el[1],
      });

    });
    this.headerList = tableHeader;
    //}

    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;

    // console.log("this.formattedData", this.formattedData);
  }

  prepareTableData(tableData, headerList) {
    let formattedData = [];
    // alert(this.type);

    // if (this.type=="Checker" )FileBarcode,Remark
    //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },

      //   { field: 'appl_apac', header: "APPL_APAC", index: 1 }, 
      { field: 'File_No', header: 'FileBarcode', index: 2 },
      { field: 'remark', header: "Remark", index: 1 },
      // { field: 'appl', header: 'APPL', index: 2 },
      // { field: 'apac', header: "APAC", index: 1 }, 
      // { field: 'contract_no', header: 'CONTRACT_NO', index: 2 },
      // { field: 'apac_effective_date', header: "APAC_EFFECTIVE_DATE", index: 1 }, 
      // { field: 'product', header: 'PRODUCT', index: 2 },
      // { field: 'location', header: "LOCATION", index: 1 }, 
      // { field: 'sub_lcoation', header: 'SUB_LCOATION', index: 2 },
      // { field: 'tenure', header: "TENURE", index: 1 }, 
      // { field: 'maturity_date', header: 'MATURITY_DATE', index: 2 },
      // { field: 'maln_party_id', header: "MALN_PARTY_ID", index: 1 }, 
      // { field: 'party_name', header: 'PARTY_NAME', index: 2 },
      // { field: 'agr_value', header: 'AGR_VALUE', index: 2 },
      // { field: 'eml_start_date', header: 'EML_START_DATE', index: 2 },
      //  { field: 'pdc_type', header: 'PDC_TYPE', index: 3 },


      // { field: 'PropertyBarcode', header: 'PROPERTY BARCODE', index: 2 },
    ];
    console.log("this.formattedData", tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        //   'appl_apac': el[0],   FileBarcode,Remark
        'File_No': el[0],
        'remark': el[1],
        // 'appl': el[2],
        // 'apac': el[3],   
        // 'contract_no': el[4],
        // 'apac_effective_date': el[5],   
        // 'product': el[6],
        // 'location': el[7],   
        // 'sub_lcoation': el[8],
        // 'tenure': el[9],   
        // 'maturity_date': el[10],
        // 'maln_party_id': el[11],   
        // 'party_name': el[12],
        // 'agr_value': el[13],   
        // 'eml_start_date': el[14],
        // 'pdc_type': el[15],

      });

    });
    this.headerList = tableHeader;
    //}

    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;

    // console.log("this.formattedData", this.formattedData);
  }

  BindHeader(tableData, headerList) {
    let formattedData = [];
    // alert(this.type);

    // if (this.type=="Checker" )
    //{ FileBarcode,Remark
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'File_No', header: "FileBarcode", index: 1 },
      { field: 'remark', header: 'Remark', index: 2 },


    ];


    this.headerList = tableHeader;
    //}
    console.log("this.headerList", this.headerList);


    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;

  }


  searchTable($event) {
    // console.log($event.target.value);

    let val = $event.target.value;
    if (val == '') {
      this.formattedData = this.immutableFormattedData;
    } else {
      let filteredArr = [];
      const strArr = val.split(',');
      this.formattedData = this.immutableFormattedData.filter(function (d) {
        for (var key in d) {
          strArr.forEach(el => {
            if (d[key] && el !== '' && (d[key] + '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
              if (filteredArr.filter(el => el.srNo === d.srNo).length === 0) {
                filteredArr.push(d);
              }
            }
          });
        }
        console.log("this.formattedData1234 ", this.formattedData);
      });
      this.formattedData = filteredArr;


    }
  }


  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }



}
