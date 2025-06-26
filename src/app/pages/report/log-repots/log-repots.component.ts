import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import noUiSlider from "nouislider";
import Dropzone from "dropzone";
Dropzone.autoDiscover = false;

import Selectr from "mobius1-selectr";

import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-log-repots',
  templateUrl: './log-repots.component.html',
  styleUrls: ['./log-repots.component.scss']
})
export class LogRepotsComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  DumpReportForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
  _IndexPendingList:any; 
//_ColNameList = ["batch_no","appl_apac", "product","location","sub_lcoation","party_name","File_No","document_type","pod_no","new_pod_no","file_status","status","pod_dispatch_date","pod_ack_date"];

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
 minToDate: Date | null = null;
  first = 0;
  first1 = 0;
  first2 = 0;
  rows = 10;

  constructor(

    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,

  ) {}
  ngOnInit() {
  this.DumpReportForm = this.formBuilder.group({
    FromDate: [null, Validators.required],
    ToDate: [null, Validators.required],
    report_type: [0, Validators.required],
    User_Token: localStorage.getItem('User_Token'),
    userid: localStorage.getItem('UserID')
  });

  this.DumpReportForm.get('FromDate')?.valueChanges.subscribe((fromDate: Date) => {
    this.minToDate = fromDate;
    const toDate = this.DumpReportForm.get('ToDate')?.value;
    if (toDate && new Date(toDate) < new Date(fromDate)) {
      this.DumpReportForm.get('ToDate')?.setValue(null); // Reset ToDate if invalid
    }
  });
  this.getAllsearch();
}
 
  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
// this.getAllsearch();
formattedData: any = [];
headerList: any;
immutableFormattedData: any;
loading: boolean = true;
prepareTableData(tableData, headerList) {
  let formattedData = [];
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'roleName', header: 'Role Name', index: 3 },
    { field: 'page_names', header: 'Menu', index: 3 },
    { field: 'sub_page_names', header: 'Sub Menu', index: 3 },

    { field: 'page_rights_names', header: 'Menu Rights', index: 3 },
    { field: 'CreatedBy', header: 'Created By', index: 3 },
    { field: 'RoleCreatedDate', header: 'Created Date', index: 3 },
    { field: 'RoleCreatedTime', header: 'Created Time', index: 3 },

    { field: 'CreatedBy', header: 'Updated By', index: 3 },
    { field: 'RoleCreatedDate', header: 'Updated Date', index: 3 },
    { field: 'RoleCreatedTime', header: 'Updated Time', index: 3 },

    { field: 'Approved_By', header: 'Approved By', index: 3 },
    { field: 'Approved_date', header: 'Approved Date', index: 3 },
    { field: 'Approved_Time', header: 'Approved Date', index: 3 },
    { field: 'RoleStatus', header: 'Role Status', index: 3 },
  ];

  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'roleName': el.roleName,
      'page_names': el.page_names,
      'sub_page_names': el.sub_page_names,
      'CreatedBy': el.CreatedBy,
      'RoleCreatedDate': el.RoleCreatedDate,
      'RoleCreatedTime': el.RoleCreatedTime,
      'Approved_By': el.Approved_By,
      'Approved_date': el.Approved_date,
      'Approved_Time': el.Approved_Time,
      'page_rights_names': el.page_rights_names,
      'RoleStatus': el.RoleStatus,
    });
  
  });
  this.headerList = tableHeader;
  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;
  

//    console.log(this.formattedData);

}

//-----------------Login-Logout-Table------------------

formattedData1: any = [];
headerList1: any;
immutableFormattedData1: any;
loading1: boolean = true;
prepareTableData1(tableData, headerList1) {
  let formattedData1 = [];
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'userid', header: 'User Id', index: 3 },
    { field: 'FullName', header: 'Name', index: 3 },
    { field: 'email', header: 'Email Id', index: 3 },
    { field: 'LastLoginDate', header: 'Login Date', index: 3 },
    { field: 'LastLoginTime', header: 'Login Time', index: 3 },
    { field: 'LogoutDate', header: 'Logout Date', index: 3 },
    { field: 'LogoutTime', header: 'Logout Time', index: 3 },
    { field: 'IsActiveStatus', header: 'User Status', index: 3 },
  ];

  tableData.forEach((el, index) => {
    formattedData1.push({
      'srNo': parseInt(index + 1),
      'userid': el.userid,
      'FullName': el.FullName,
      'email': el.email,
      'LastLoginDate': el.LastLoginDate,
      'LastLoginTime': el.LastLoginTime,
      'LogoutDate': el.LogoutDate,
      'LogoutTime': el.LogoutTime,
      'IsActiveStatus': el.IsActiveStatus,
    });
  
  });
  this.headerList1 = tableHeader;
  this.immutableFormattedData1 = JSON.parse(JSON.stringify(formattedData1));
  this.formattedData1 = formattedData1;
  this.loading1 = false;
//    console.log(this.formattedData);
}

//-----------------Login-Logout-Table------------------

formattedData2: any = [];
headerList2: any;
immutableFormattedData2: any;
loading2: boolean = true;
prepareTableData2(tableData, headerList1) {
  let formattedData2 = [];
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'userid', header: 'User Id', index: 3 },
    { field: 'firstname', header: 'First Name', index: 3 },
    { field: 'lastname', header: 'Last Name', index: 3 },
    { field: 'mobile', header: 'Mobile', index: 3 },
    { field: 'email', header: 'Email Id', index: 3 },
    { field: 'branchcode', header: 'Branch Code', index: 3 },
    { field: 'CreatedBy', header: 'Created By', index: 3 },
    { field: 'createdDate', header: 'Created Date', index: 3 },
    { field: 'createdTime', header: 'Created Time', index: 3 },
    { field: 'ModifiedBy', header: 'Modified By', index: 3 },
    { field: 'modifiedDate', header: 'Modified Date', index: 3 },
    { field: 'modifiedTime', header: 'Modified Time', index: 3 },
    { field: 'CheckerReviewBy', header: 'Checker Review By', index: 3 },
    { field: 'checkerReviewDate', header: 'Checker Review Date', index: 3 },
    { field: 'checkerReviewTime', header: 'Checker Review Time', index: 3 },
    { field: 'IsActiveStatus', header: 'Status', index: 3 },
  ];

  tableData.forEach((el, index) => {
    formattedData2.push({
      'srNo': parseInt(index + 1),
      'userid': el.userid,
      'firstname': el.firstname,
      'lastname': el.lastname,
      'mobile': el.mobile,
      'email': el.email,
      'branchcode': el.branchcode,
      'IsActiveStatus': el.IsActiveStatus,
      'CreatedBy': el.CreatedBy,
      'createdDate': el.createdDate,
      'createdTime': el.createdTime,
      'ModifiedBy': el.ModifiedBy,
      'modifiedDate': el.modifiedDate,
      'modifiedTime': el.modifiedTime,
      'checkerReviewDate': el.checkerReviewDate,
      'checkerReviewTime': el.checkerReviewTime,
      'CheckerReviewBy': el.CheckerReviewBy,
    });
  
  });
  this.headerList2 = tableHeader;
  this.immutableFormattedData2 = JSON.parse(JSON.stringify(formattedData2));
  this.formattedData2 = formattedData2;
  this.loading2 = false;
//    console.log(this.formattedData);
}


searchTable($event) {
  // console.log($event.target.value);
  let val = $event.target.value;
  if(val == '') {
    this.formattedData = this.immutableFormattedData;
  } else {
    let filteredArr = [];
    const strArr = val.split(',');
    this.formattedData = this.immutableFormattedData.filter(function (d) {
      for (var key in d) {
        strArr.forEach(el => {
          if (d[key] && el!== '' && (d[key]+ '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
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

searchTable1($event) {
  let val = $event.target.value;
  if (val == '') {
    this.formattedData1 = this.immutableFormattedData1;
  } else {
    let filteredArr = [];
    const strArr = val.split(',');
    this.formattedData1 = this.immutableFormattedData1.filter(function (d) {
      for (var key in d) {
        strArr.forEach(el => {
          if (d[key] && el !== '' && (d[key] + '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
            if (filteredArr.filter(e => e.srNo === d.srNo).length === 0) {
              filteredArr.push(d);
            }
          }
        });
      }
    });
    this.formattedData1 = filteredArr;
  }
}

searchTable2($event) {
  let val = $event.target.value;
  if (val === '') {
    this.formattedData2 = this.immutableFormattedData2;
  } else {
    let filteredArr = [];
    const strArr = val.split(',');
    this.formattedData2 = this.immutableFormattedData2.filter(function (d) {
      for (var key in d) {
        strArr.forEach(el => {
          if (d[key] && el !== '' && (d[key] + '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
            if (filteredArr.filter(e => e.srNo === d.srNo).length === 0) {
              filteredArr.push(d);
            }
          }
        });
      }
    });
    this.formattedData2 = filteredArr;
  }
}


// getdumpsearch() {  
//     const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetDumpReport';          
//     this._onlineExamService.postData(this.DumpReportForm.value,apiUrl)
//     // .pipe(first())

//     .subscribe( data => {      
//       this._StatusList = data;          
//       this._FilteredList = data;      
//       this.prepareTableData( this._StatusList,  this._FilteredList);
    
//   });

//   } 
onReportTypeChange() {
  this.formattedData = [];
  this.formattedData1 = [];
  this.formattedData2 = [];
}


  //------------------------
  getAllsearch() {  
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetAllReport';          
    this._onlineExamService.postData(this.DumpReportForm.value,apiUrl)
    // .pipe(first())

    .subscribe( data => {      
      this._StatusList = data;          
      this._FilteredList = data;      
      this.prepareTableData( this._StatusList,  this._FilteredList);
      this.prepareTableData1( this._StatusList,  this._FilteredList);
      this.prepareTableData2( this._StatusList,  this._FilteredList);
  });
  } 

  onDownload() {
  const reportType = this.DumpReportForm.get('report_type')?.value;

  if (reportType == 1) {
    this.downloadFile(this.headerList, this.formattedData, "Access_Control_Report");
  } else if (reportType == 2) {
    this.downloadFile(this.headerList1, this.formattedData1, "Log_Report");
  } else if (reportType == 3) {
    this.downloadFile(this.headerList2, this.formattedData2, "Total_User_Report");
  } else {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please select a valid report type before downloading!</span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify"
      }
    );
  }
}


  GetHeaderNames(headerList: any[], dataList: any[]): string {
  let csv = '';

  // Header row
  const headerRow = headerList.map(h => h.header).join(',');
  csv += headerRow + '\n';

  // Data rows
  dataList.forEach(row => {
    const rowData = headerList.map(h => {
      const cellValue = row[h.field];
      return typeof cellValue === 'string' && cellValue.includes(',') ? `"${cellValue}"` : cellValue;
    });
    csv += rowData.join(',') + '\n';
  });

  return csv;
}
  
  downloadFile(headerList: any[], dataList: any[], fileName: string) {
  const csvData = this.GetHeaderNames(headerList, dataList);

  if (dataList.length > 0) {
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);

    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", fileName + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  } else {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">There should be some data before you download!</span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify"
      }
    );
  }
}


  OnReset() {
    this.Reset = true;
    this.DumpReportForm.reset();
  }

  isValid() {
    return this.DumpReportForm.valid 
  } 
}
