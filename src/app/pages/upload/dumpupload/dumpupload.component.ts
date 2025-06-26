import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { get } from "jquery";

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-dumpupload",
  templateUrl: "dumpupload.component.html",
})
export class DumpuploadComponent implements OnInit {
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
  getFileHistory: any;
  File_Name: any = '';
  Download_File_List: any

  @Output() public onUploadFinished = new EventEmitter();

  constructor(
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
  ) { }
  ngOnInit() {
    this.DataUploadForm = this.formBuilder.group({
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      id: [0],
      CSVData: [""],
      File_Name: '',
      File_Name_Uploaded: ''
    });
    // this.BindHeader(this._FilteredList, this._FilteredList);
    // this.prepareTableData(this._FilteredList, this._FilteredList);
    this.getFileUplodedHistory()
  }


  entriesChange($event) {
    this.entries = $event.target.value;
  }
  getFileUplodedHistory() {
    debugger;

    const userToken = localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "DataUpload/GetUploaded_File_History?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.getFileHistory = data;
      debugger;
      console.log(data);
      // this._FilteredList = data;
      this.prepareTableData(this.getFileHistory, this.getFileHistory);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
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

  }
  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    //console.log(this.DataUploadForm);

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
debugger;
    let text = [];
    let files = $event.srcElement.files;
    this.File_Name = $event.srcElement.files[0].name;
    this.File_Name = this.File_Name.substring(0, this.File_Name.lastIndexOf('.')) || this.File_Name;
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

          //  this.prepareTableDataForCSV(this._FilteredList);         

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

  checkDateFormat(date) {
    //  console.log("Date",date);

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
    // headers ="NewCBSAccountNo,ApplicationNo,CBSCUSTIC,Team,HandliedBy,ProductCode,Product,ProductDescription,JCCode,JCName,Zone,CustomerName,DBDate,FinalRemarks,DisbursedMonth";
    headers = ['state', 'region', 'appl', 'apac', 'contract_no', 'apac_effective_date', 'product', 'location', 'sub_location', 'tenure', 'maturity_date', 'maln_party_id', 'party_name', 'agr_value', 'eml_start_date', 'pdc_type'];
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
debugger;
    this.submitted = true;

    if (this._CSVData != null && this._CSVData != undefined) {

      this.DataUploadForm.patchValue({
        id: localStorage.getItem('UserID'),
        CSVData: this._CSVData,
        User_Token: localStorage.getItem('User_Token'),
        File_Name: this.File_Name
      });

      const apiUrl = this._global.baseAPIUrl + 'DataUpload/AddEditDump';
      this._onlineExamService.postData(this.DataUploadForm.value, apiUrl)
        // .pipe(first())
        .subscribe(data => {
this.getFileUplodedHistory();
          // alert(data);
          this.showSuccessmessage(data);
        //  this.BindHeader(this._FilteredList, this._FilteredList);

        });

      //  }     
    }
    else {
      this.showmessage("please select file");

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
    if (headers.length != 14) {
      // alert('Invalid No. of Column Expected :- ' + this._ColNameList.length);
      var msg = 'Invalid No. of Column Expected :- ' + 14;
      //this.showmessage(msg);
      this.ShowErrormessage(msg);

      return false;
    }
    // this._HeaderList ="POD No,Invoice Details,Invoice No,Invoice Date,Vendor Name,Barcode No";

    //  this._ColNameList[0] ="appl_apac";
    this._ColNameList[0] = "state";
    this._ColNameList[1] = "region";
    this._ColNameList[2] = "appl";
    this._ColNameList[3] = "apac";
    this._ColNameList[4] = "party_name";
    this._ColNameList[5] = "contract_no";
    this._ColNameList[6] = "apac_effective_date";
    this._ColNameList[7] = "product";
    this._ColNameList[8] = "location";
    this._ColNameList[9] = "sub_location";
    this._ColNameList[10] = "tenure";
    // this._ColNameList[10] = "maturity_date";
    // this._ColNameList[11] = "maln_party_id";
    this._ColNameList[11] = "agr_value";
    this._ColNameList[12] = "eml_start_date";
    this._ColNameList[13] = "pdc_type";

    return true;
  }

  GetHeaderNames() {
    //  this._HeaderList = "";
    // this._HeaderList = "state,region,appl,apac,contract_no,apac_effective_date,product,location,sub_location,tenure,maturity_date,maln_party_id,party_name,agr_value,eml_start_date,pdc_type";
    this._HeaderList = "state,region,appl,apac,party_name,contract_no,apac_effective_date,product,location,sub_location,tenure,agr_value,eml_start_date,pdc_type";
  }



  downloadFile() {
    const filename = 'DumpUpload_Format_CSV';
    // let csvData = "state,region,appl,apac,contract_no,apac_effective_date,product,location,sub_location,tenure,maturity_date,maln_party_id,party_name,agr_value,eml_start_date,pdc_type";

    let csvData = "state,region,appl,apac,party_name,contract_no,apac_effective_date,product,location,sub_location,tenure,agr_value,eml_start_date,pdc_type";

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
          "ngx-toastr alert alert-dismissible alert-danger alert-notify"
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
      //  { field: 'appl_apac', header: "APPL_APAC", index: 1 }, 
      { field: 'state', header: 'STATE', index: 2 },
      { field: 'region', header: "REGION", index: 1 },
      { field: 'appl', header: 'APPL', index: 2 },
      { field: 'apac', header: "APAC", index: 1 },
      { field: 'contract_no', header: 'CONTRACT_NO', index: 2 },
      { field: 'apac_effective_date', header: "APAC_EFFECTIVE_DATE", index: 1 },
      { field: 'product', header: 'PRODUCT', index: 2 },
      { field: 'location', header: "LOCATION", index: 1 },
      { field: 'sub_location', header: 'sub_location', index: 2 },
      { field: 'tenure', header: "TENURE", index: 1 },
      { field: 'maturity_date', header: 'MATURITY_DATE', index: 2 },
      { field: 'maln_party_id', header: "MALN_PARTY_ID", index: 1 },
      { field: 'party_name', header: 'PARTY_NAME', index: 2 },
      { field: 'agr_value', header: 'AGR_VALUE', index: 2 },
      { field: 'eml_start_date', header: 'EML_START_DATE', index: 2 },
      { field: 'pdc_type', header: 'PDC_TYPE', index: 3 },


    ];
    console.log("this.formattedData", tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        //  'appl_apac': el[0],   
        'state': el[0],
        'region': el[1],
        'appl': el[2],
        'apac': el[3],
        'contract_no': el[4],
        'apac_effective_date': el[5],
        'product': el[6],
        'location': el[7],
        'sub_location': el[8],
        'tenure': el[9],
        'maturity_date': el[10],
        'maln_party_id': el[11],
        'party_name': el[12],
        'agr_value': el[13],
        'eml_start_date': el[14],
        'pdc_type': el[15],
        // 'Password': el[3],
        // 'Moblienumber': el[4],
        // 'Role': el[5],
        // 'Remarks': el[6]

      });

    });
    this.headerList = tableHeader;
    //}

    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    // this.formattedData = formattedData;
    this.loading = false;

    // console.log("this.formattedData", this.formattedData);
  }

  FileuploadedList(folderName: any) {
    debugger;
    console.log(folderName);
    let filename = folderName.File_Name_Uploaded

    this.DataUploadForm.patchValue({
      id: localStorage.getItem('UserID'),
      CSVData: "",
      User_Token: localStorage.getItem('User_Token'),
      File_Name_Uploaded: filename
    });
    const userToken = localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "DataUpload/DownLoad_Uploaded_File_History";
    this._onlineExamService.postData(this.DataUploadForm.value, apiUrl).subscribe((data: {}) => {
      this.Download_File_List = data;
      console.log(data);
      this.Download_ExportExcel(this.Download_File_List);
      this.loading = false;
    });

  }

  Error_File(folderName: any) {
    console.log(folderName);
    debugger;
    console.log(folderName);
    let filename = folderName.File_Name_Uploaded
    this.DataUploadForm.patchValue({
      id: localStorage.getItem('UserID'),
      CSVData: "",
      User_Token: localStorage.getItem('User_Token'),
      File_Name_Uploaded: filename
    });

    const apiUrl = this._global.baseAPIUrl + "DataUpload/DownLoad_Error_File_History";
    this._onlineExamService.postData(this.DataUploadForm.value, apiUrl).subscribe((data: {}) => {
      this.Download_File_List = data;
      console.log(data);
      this.Error_ExportExcel(this.Download_File_List);
      this.loading = false;
    });


  }

  Download_ExportExcel(dt: any) {
    let Exportdata: any[];
    const worksheet = XLSX.utils.json_to_sheet(dt)//ForExcelData);//,{header:[+filtered+]}
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "Download File Data");
  }

  Error_ExportExcel(dt: any) {
    let Exportdata: any[];
    const worksheet = XLSX.utils.json_to_sheet(dt)//ForExcelData);//,{header:[+filtered+]}
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "Download Error File Data");
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export' + EXCEL_EXTENSION);
  }


  prepareTableData(tableData, headerList) {
    let formattedData = [];
    // alert(this.type);

    // if (this.type=="Checker" )
    //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'File_Name_Uploaded', header: 'FILE UPLOADED', index: 2 },
      { field: 'Status', header: "STATUS", index: 1 },
      { field: 'Error_File', header: 'ERROR FILE', index: 2 },
      { field: 'Success_Records', header: "SUCCESS RECORD", index: 1 },
      { field: 'Error_Records', header: "ERROR RECORD", index: 1 },
      { field: 'Uploaded_By', header: 'UPLOADED BY', index: 2 },
      { field: 'Uploaded_Date_time', header: "UPLOADED DATE TIME", index: 1 },
    ];
    // console.log("this.formattedData", tableData);
    tableData.forEach((el, index) => {
      formattedData.push({

        'srNo': parseInt(index + 1),
        'File_Name_Uploaded': el.File_Name_Uploaded,
        'Status': el.Status,
        'Error_File': el.Error_File,
        'Success_Records': el.Success_Records,
        'Error_Records': el.Error_Records,
        'Uploaded_By': el.Uploaded_By,
        'Uploaded_Date_time': el.Uploaded_Date_time,

      });

    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;

    // console.log("this.formattedData", this.formattedData);
  }

  BindHeader(tableData, headerList) {
    let formattedData = [];
    // alert(this.type);

    // if (this.type=="Checker" )
    //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'AccountNo', header: "ACCOUNT N0", index: 1 },
      { field: 'AppNo', header: 'APP NO', index: 2 },

      { field: 'CRN', header: "CRN", index: 1 },
      { field: 'URN', header: 'URN', index: 2 },
      { field: 'DBDate', header: "DB DATE", index: 1 },
      { field: 'DBMonth', header: 'DB MONTH', index: 2 },
      { field: 'DBYear', header: "DB YEAR", index: 1 },
      { field: 'ProductCode', header: 'PRODUCT CODE', index: 2 },
      { field: 'ProductType', header: "PRODUCT TYPE", index: 1 },
      { field: 'ProductName', header: 'PRODUCT NAME', index: 2 },
      { field: 'COD_OFFICR_ID', header: "COD OFFICR ID", index: 1 },
      { field: 'CustomerName', header: 'CUSTOMER NAME', index: 2 },
      { field: 'BranchCode', header: "BRANCH CODE", index: 1 },
      { field: 'BranchName', header: 'BRANCH NAME', index: 2 },
      { field: 'Zone', header: 'ZONE', index: 2 },
      { field: 'ClosedDate', header: 'CLOSE DATE', index: 2 },
    ];
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
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
