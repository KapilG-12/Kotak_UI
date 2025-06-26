import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-scanning-inward',
  templateUrl: './scanning-inward.component.html',
  styleUrls: ['./scanning-inward.component.scss']
})
export class ScanningInwardComponent implements OnInit {
  isChecked: boolean = false;
  csvReader = '';
  filebarcode: any;
  remark: any;
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
  pymentForm: FormGroup;
  public message: string;
  _HeaderList: any;
  _ColNameList = [];
  _CSVData: any;
  csvData:any;
  public records: any[] = [];
  papa: any;
  _TempID: any = 0;

  myFiles: string[] = [];
  _FileDetails: string[][] = [];
  first = 0;
  rows = 10;

  @Output() public onUploadFinished = new EventEmitter();
  constructor(public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants) { }

  ngOnInit(): void {
    this.DataUploadForm = this.formBuilder.group({
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      //id: [0],
      CSVData: [""],
      saveredio: ['', Validators.required]
    });
    this.pymentForm = this.formBuilder.group({
      filebarcode: ['', Validators.required],
      remark: [''],
      user_Token: localStorage.getItem('User_Token'),
      saveredio: ['', Validators.required],
      CreatedBy: localStorage.getItem('UserID'),
    })
    this.BindHeader(this._FilteredList, this._FilteredList);
    this.prepareTableData(this._FilteredList, this._FilteredList);
  }
  toggleChange() {
    console.log("this is the value", this.isChecked)
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    let val = $event.target.value;
    let that = this
    this._FilteredList = this.records.filter(function (d) {
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

  reset() {
    debugger;
    this.filebarcode = '';
    this.remark = '';
    this.pymentForm.controls['saveredio'].reset('');
    this.DataUploadForm.controls['saveredio'].reset('');
  }
  save() {
    this.submitted = true;
    debugger;
    const apiUrl = this._global.baseAPIUrl + "BranchInward/ScanningInward";
    this._onlineExamService.postData(this.pymentForm.value, apiUrl)
      .subscribe((data) => {
        if (data == 'Record save successfully' || data=='Record updated successfully') {
          this.ShowMessage(data);
        }
        else {
          this.ShowErrormessage(data);
        }
        this.reset();
      });


  }

  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    if (this.DataUploadForm.valid && files.length > 0) {
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
        console.log(this._CSVData);
        this._IndexList = csvRecordsArray;
        let validFile = this.getDisplayNames(csvRecordsArray);
        if (validFile == false) {
          this.fileReset();
        } else {
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
          this._FilteredList = this.records;
          this.prepareTableDataForCSV(this._FilteredList);
          (<HTMLInputElement>document.getElementById('csvReader')).value = '';
        }
      };

      reader.onerror = function () {
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

  checkDateFormat(date) {
    if (date != "") {
      let dateArr = date.split('-');
      const dateString = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
      if (isNaN(dateArr[0]) || isNaN(dateArr[1]) || isNaN(dateArr[2])) {
        return false;
      }
      if (isNaN(new Date(dateString).getTime())) {
        return false;
      }
      return true;
    }
    else {
      return true;
    }
  }

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
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    var headers;
    headers = ['filebarcode', 'remark'];
    // console.log("headers_1",headers);
    //  // let headerArray = [];
    // for (let j = 0; j < headers.length; j++) {
    //   headerArray.push(headers[j]);
    // }

    return headers;


  }

  fileReset() {
    //this.csvReader.nativeElement.value = "";  
    this.records = [];
  }

  onSubmit() {

    this.submitted = true;
    if (this.DataUploadForm.invalid) {
      return;
    }
    if (this.csvData != null && this.csvData != undefined) {
      this.DataUploadForm.patchValue({
       // id: localStorage.getItem('UserID'),
        CSVData: this.csvData,
       // User_Token: localStorage.getItem('User_Token'),
        //Save: this.DataUploadForm.controls['Save'].value
      });
      debugger;

      // const apiUrl = this._global.baseAPIUrl + 'DataUpload/AddEditDump';
      const apiUrl = this._global.baseAPIUrl + 'BranchInward/ScanningInwardBulk';
      this._onlineExamService.postData(this.DataUploadForm.value, apiUrl)
        .subscribe(data => {
         this.downloadFileErrorLog(data);
          this.showSuccessmessage("Record save successfully");
          this.reset();
          this.BindHeader(this._FilteredList, this._FilteredList);
        });
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
  ShowMessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success ! </span> <span data-notify="message"> ' + data + ' </span></div>',
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


  onFormat(csvRecordsArr: any) {
    //   let dt;

  }

  getDisplayNames(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    if (headers.length != 2) {
      var msg = 'Invalid No. of Column Expected :- ' + 2;
      this.ShowErrormessage(msg);
      return false;
    }
    this._ColNameList[0] = "filebarcode";
    this._ColNameList[1] = "remark";
    return true;
  }

  GetHeaderNames() {
    this._HeaderList = "filebarcode,remark";
    // this._HeaderList = "state,region,appl,apac,contract_no,apac_effective_date,product,location,sub_lcoation,tenure,maturity_date,maln_party_id,party_name,agr_value,eml_start_date,pdc_type";

  }
  downloadFileErrorLog(data: any) {
    const filename = 'ScanningInwardlog_CSV'
    let blob = new Blob(['\ufeff' + data], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = -1;
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
  downloadFile() {
    const filename = 'ScanningInwardFormat_CSV';
    // let csvData = "state,region,appl,apac,contract_no,apac_effective_date,product,location,sub_lcoation,tenure,maturity_date,maln_party_id,party_name,agr_value,eml_start_date,pdc_type";

    let csvData = "filebarcode,remark"
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

  prepareTableData(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'filebarcode', header: 'FILE BARCODE', index: 1 },
      { field: 'remark', header: "REMARK", index: 2 }
    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'filebarcode': el[0],
        'remark': el[1],
      });

    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }
  BindHeader(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'filebarcode', header: "FILE BARCODE", index: 1 },
      { field: 'remark', header: 'REMARK', index: 2 },
    ];
    this.headerList = tableHeader;
    console.log("this.headerList",this.headerList);
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;

  }
  prepareTableDataForCSV(tableData) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'filebarcode', header: 'FILE BARCODE', index: 2 },
      { field: 'remark', header: "REMARK", index: 1 },
    ];
    console.log("this.formattedData", tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'filebarcode': el[0],
        'remark': el[1],
      });

    });
    this.csvData=formattedData;
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }
  searchTable($event) {
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
      });
      this.formattedData = filteredArr;
    }
  }


  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
}
