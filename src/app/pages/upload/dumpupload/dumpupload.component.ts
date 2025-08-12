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
  fileSelected = false;
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
    this.getFileUplodedHistory()
  }


  entriesChange($event) {
    this.entries = $event.target.value;
  }
  getFileUplodedHistory() {


    const userToken = localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "DataUpload/GetUploaded_File_History?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.getFileHistory = data;
      this.prepareTableData(this.getFileHistory, this.getFileHistory);
    });
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

  OnReset() {

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
    this.fileSelected = true;
    let files = $event.srcElement.files;
    this.File_Name = $event.srcElement.files[0].name;
    this.File_Name = this.File_Name.substring(0, this.File_Name.lastIndexOf('.')) || this.File_Name;
    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      $(".selected-file-name").html(input.files[0].name);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this._CSVData = csvRecordsArray;
        this._IndexList = csvRecordsArray;

        let validFile = this.getDisplayNames(csvRecordsArray);
        if (validFile == false) {
          this.fileReset();
        } else {
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);

          this._FilteredList = this.records;
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
    headers = ['State', 'Region', 'Appl', 'Apac', 'Contract_No', 'Apac_Effective_Date', 'Product', 'Location', 'Sub_Location', 'Tenure', 'maturity_date', 'maln_party_id', 'Party_Name', 'Agreement_Value', 'EMI_Start_Date', 'PDC_Type'];
    return headers;
  }

  fileReset() {
    this.records = [];
    const span = document.querySelector('.selected-file-name');
    span.textContent = '';
    this.fileSelected = false;
  }

  onSubmit() {

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
        .subscribe(data => {
          this.getFileUplodedHistory();
          this.showSuccessmessage(data);
          this.fileReset();
        });
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
  }



  getDisplayNames(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    if (headers.length != 14) {
      var msg = 'Invalid No. of Column Expected :- ' + 14;
      this.ShowErrormessage(msg);
      return false;
    }
    this._ColNameList[0] = "State";
    this._ColNameList[1] = "Region";
    this._ColNameList[2] = "Appl";
    this._ColNameList[3] = "Apac";
    this._ColNameList[4] = "Party_Name";
    this._ColNameList[5] = "Contract_No";
    this._ColNameList[6] = "Apac_Effective_Date";
    this._ColNameList[7] = "Product";
    this._ColNameList[8] = "Location";
    this._ColNameList[9] = "sub_location";
    this._ColNameList[10] = "Tenure";
    this._ColNameList[11] = "Agreement_Value";
    this._ColNameList[12] = "EMI_Start_Date";
    this._ColNameList[13] = "PDC_Type";

    return true;
  }

  GetHeaderNames() {
    this._HeaderList = "State,Region,Appl,Apac,Party_Name,Contract_No,Apac_Effective_Date,Product,Location,Sub_Location,Tenure,Agreement_Value,EMI_Start_Date,PDC_Type";
  }



  downloadFile() {
    const filename = 'DumpUpload_Format_CSV';

    let csvData = "State,Region,Appl,Apac,Party_Name,Contract_No,Apac_Effective_Date,Product,Location,Sub_Location,Tenure,Agreement_Value,EMI_Start_Date,PDC_Type";
    let blob = new Blob(['\ufeff' + csvData], {
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
      { field: 'State', header: 'STATE', index: 2 },
      { field: 'Region', header: "REGION", index: 1 },
      { field: 'Appl', header: 'APPL', index: 2 },
      { field: 'Apac', header: "APAC", index: 1 },
      { field: 'Contract_No', header: 'CONTRACT_NO', index: 2 },
      { field: 'Apac_Effective_Date', header: "APAC_EFFECTIVE_DATE", index: 1 },
      { field: 'Product', header: 'PRODUCT', index: 2 },
      { field: 'Location', header: "LOCATION", index: 1 },
      { field: 'Sub_Location', header: 'SUB_LOCATION', index: 2 },
      { field: 'Tenure', header: "TENURE", index: 1 },
      { field: 'maturity_date', header: 'MATURITY_DATE', index: 2 },
      { field: 'maln_party_id', header: "MALN_PARTY_ID", index: 1 },
      { field: 'Party_Name', header: 'PARTY_NAME', index: 2 },
      { field: 'Agreement_Value', header: 'AGR_VALUE', index: 2 },
      { field: 'EMI_Start_Date', header: 'EML_START_DATE', index: 2 },
      { field: 'PDC_Type', header: 'PDC_TYPE', index: 3 },
    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'State': el[0],
        'Region': el[1],
        'Appl': el[2],
        'Apac': el[3],
        'Contract_No': el[4],
        'Apac_Effective_Date': el[5],
        'Product': el[6],
        'Location': el[7],
        'Sub_Location': el[8],
        'Tenure': el[9],
        'maturity_date': el[10],
        'maln_party_id': el[11],
        'Party_Name': el[12],
        'Agreement_Value': el[13],
        'EMI_Start_Date': el[14],
        'PDC_Type': el[15],
      });
    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.loading = false;
  }

  FileuploadedList(folderName: any) {
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
      this.Download_ExportCSV(this.Download_File_List, filename);
      this.loading = false;
    });

  }

  Error_File(folderName: any) {
    debugger;
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
      this.Error_ExportCSV(this.Download_File_List, folderName.Error_File);
      this.loading = false;
    });
  }

  Download_ExportCSV(dt: any, filename: any) {
    const worksheet = XLSX.utils.json_to_sheet(dt);
    const csv: string = XLSX.utils.sheet_to_csv(worksheet);
    this.saveAsCSVFile(csv, filename);
  }

  Error_ExportCSV(dt: any, filename: any) {
    const worksheet = XLSX.utils.json_to_sheet(dt);
    const csv: string = XLSX.utils.sheet_to_csv(worksheet);
    this.saveAsCSVFile(csv, filename);
  }

  saveAsCSVFile(csv: string, fileName: string): void {
    const CSV_TYPE = 'text/csv;charset=utf-8;';
    const CSV_EXTENSION = '.csv';
    const data: Blob = new Blob([csv], { type: CSV_TYPE });
    FileSaver.saveAs(data, fileName + CSV_EXTENSION);
  }



  // Download_ExportExcel(dt: any) {
  //   let Exportdata: any[];
  //   const worksheet = XLSX.utils.json_to_sheet(dt)//ForExcelData);//,{header:[+filtered+]}
  //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, "Download File Data");
  // }

  // Error_ExportExcel(dt: any) {
  //   let Exportdata: any[];
  //   const worksheet = XLSX.utils.json_to_sheet(dt)//ForExcelData);//,{header:[+filtered+]}
  //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, "Download Error File Data");
  // }

  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //   let EXCEL_EXTENSION = '.xlsx';
  //   const data: Blob = new Blob([buffer], {
  //     type: EXCEL_TYPE
  //   });
  //   FileSaver.saveAs(data, fileName + '_export' + EXCEL_EXTENSION);
  // }


  prepareTableData(tableData, headerList) {
    let formattedData = [];
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
  }

  BindHeader(tableData, headerList) {
    let formattedData = [];
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
