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
  _FilteredList: any;
  _StatusList: any;
  _HeaderList: any;
  _IndexPendingList: any;
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
  ) { }

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

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [      
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'roleName', header: 'Role Name', index: 1 },
      { field: 'remarks', header: 'Remarks', index: 1 },
      { field: 'page_names', header: 'Menu', index: 1 },
      { field: 'page_rights_list', header: 'Menu Rights', index: 1 },
      { field: 'RoleStatus', header: 'Role Status', index: 1 },
      { field: 'CheckerRoleReviewBy', header: 'Checker Review By', index: 1 },
      { field: 'CheckerReviewDate', header: 'Checker Review Date', index: 1 },
      { field: 'CheckerReviewTime', header: 'Checker Review Time', index: 1 },
      { field: 'RoleApproveRemarks', header: 'Approve Remarks', index: 1 },
      { field: 'RoleRejectRemarks', header: 'Reject Remarks', index: 1 },
      { field: 'RoleReconsiderRemarks', header: 'Reconsider Remarks', index: 1 },
      { field: 'CreatedBy', header: 'Created By', index: 1 },
      { field: 'creationDate', header: 'Created Date', index: 1 },
      { field: 'creationTime', header: 'Created Time', index: 1 },
      { field: 'ModifiedBy', header: 'Modified By', index: 1 },
      { field: 'ModifiedDate', header: 'Modified Date', index: 1 },
      { field: 'ModifiedTime', header: 'Modified Time', index: 1 },
    ];

    tableData.forEach((el, index) => {
      formattedData.push({
        srNo: parseInt(index + 1),
        roleName: el.roleName,
        remarks: el.remarks,
        page_names: el.page_names,
        page_rights_list: el.page_rights_list,
        RoleStatus: el.RoleStatus,
        CheckerRoleReviewBy: el.CheckerRoleReviewBy,
        CheckerReviewDate: el.CheckerReviewDate,
        CheckerReviewTime: el.CheckerReviewTime,
        RoleApproveRemarks: el.RoleApproveRemarks,
        RoleRejectRemarks: el.RoleRejectRemarks,
        RoleReconsiderRemarks: el.RoleReconsiderRemarks,
        CreatedBy: el.CreatedBy,
        creationDate: el.creationDate,
        creationTime: el.creationTime,
        ModifiedBy: el.ModifiedBy,
        ModifiedDate: el.ModifiedDate,
        ModifiedTime: el.ModifiedTime
      });
    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }


  //---------------------------------------------------------------------------------------------------------
  formattedData1: any = [];
  headerList1: any;
  immutableFormattedData1: any;
  loading1: boolean = true;
  prepareTableData1(tableData, headerList1) {
    let formattedData1 = [];
    let tableHeader: any = [      
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'userid', header: 'User Id', index: 1 },
      { field: 'FullName', header: 'Name', index: 2 },
      { field: 'email', header: 'Email Id', index: 3 },
      { field: 'empid', header: 'Employee Id', index: 4 },
      { field: 'location', header: 'Location', index: 5 },
      { field: 'branchcode', header: 'Branch Code', index: 6 },
      { field: 'Status', header: 'Status', index: 7 },
      { field: 'roleName', header: 'Role Name', index: 8 },
      { field: 'LastLoginDate', header: 'Login Date', index: 9 },
      { field: 'LastLoginTime', header: 'Login Time', index: 10 },
      { field: 'LogoutDate', header: 'Logout Date', index: 11 },
      { field: 'LogoutTime', header: 'Logout Time', index: 12 },
      { field: 'IsActiveStatus', header: 'User Status', index: 13 },
      { field: 'UserType', header: 'User Type', index: 14 },
    ];
    tableData.forEach((el, index) => {
      formattedData1.push({
        'srNo': parseInt(index + 1),
        'userid': el.userid,
        'FullName': el.FullName,
        'email': el.email,
        'empid': el.empid,
        'location': el.location,
        'branchcode': el.branchcode,
        'Status': el.Status,
        'roleName': el.roleName,
        'LastLoginDate': el.LastLoginDate,
        'LastLoginTime': el.LastLoginTime,
        'LogoutDate': el.LogoutDate,
        'LogoutTime': el.LogoutTime,
        'IsActiveStatus': el.IsActiveStatus,
        'UserType': el.UserType,
      });
    });
    this.headerList1 = tableHeader;
    this.immutableFormattedData1 = JSON.parse(JSON.stringify(formattedData1));
    this.formattedData1 = formattedData1;
    this.loading1 = false;
  }


  //---------------------------------------------------------------------------------------------------------
  formattedData2: any = [];
  headerList2: any;
  immutableFormattedData2: any;
  loading2: boolean = true;
  prepareTableData2(tableData, headerList1) {
    let formattedData2 = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'empid', header: 'Emp ID', index: 1 },
      { field: 'userid', header: 'User ID', index: 5 },
      { field: 'FullName', header: 'Name', index: 2 },
      { field: 'email', header: 'Email ID', index: 6 },
      { field: 'mobile', header: 'Mobile', index: 7 },
      { field: 'roleName', header: 'Role Name', index: 16 },
      { field: 'location', header: 'Location', index: 3 },
      { field: 'branchcode', header: 'Branch Code', index: 4 },
      { field: 'UserType', header: 'User Type', index: 22 },
      { field: 'Status', header: 'Status', index: 14 },
      { field: 'ApprovalPurpose', header: 'Approval Purpose', index: 15 },
      { field: 'CreatedBy', header: 'Created By', index: 17 },
      { field: 'creationDate', header: 'Created Date', index: 19 },
      { field: 'creationTime', header: 'Created Time', index: 20 },
      { field: 'ModifiedBy', header: 'Modified By', index: 23 },
      { field: 'ModifiedDate', header: 'Modified Date', index: 24 },
      { field: 'ModifiedTime', header: 'Modified Time', index: 25 },
      { field: 'CheckerReviewBy', header: 'Checker Review By', index: 8 },
      { field: 'CheckerReviewDate', header: 'Checker Review Date', index: 9 },
      { field: 'CheckerReviewTime', header: 'Checker Review Time', index: 10 },
      { field: 'approveremarks', header: 'Approver Remarks', index: 11 },
      { field: 'rejectremarks', header: 'Reject Remarks', index: 12 },
      { field: 'reconsiderremarks', header: 'Reconsider Remarks', index: 13 },
      { field: 'IsActiveStatus', header: 'IsActive Status', index: 21 },
      { field: 'activeInactiveRemark', header: 'Active/Inactive Remark', index: 18 },
      { field: 'ActivationRequestedBy', header: 'Activation/Inactivation Requested By', index: 26 },
      { field: 'ActivationRequestedDate', header: 'Activation/Inactivation Requested Date', index: 27 },
      { field: 'ActivationRequestedTime', header: 'Activation/Inactivation Requested Time', index: 28 },
    ];

    tableData.forEach((el, index) => {
      formattedData2.push({
        srNo: parseInt(index + 1),
        empid: el.empid,
        FullName: el.FullName,
        location: el.location,
        branchcode: el.branchcode,
        userid: el.userid,
        email: el.email,
        mobile: el.mobile,
        CheckerReviewBy: el.CheckerReviewBy,
        CheckerReviewDate: (el.CheckerReviewDate === '0001-01-01T00:00:00' || !el.CheckerReviewDate) ? '' : el.CheckerReviewDate,
        CheckerReviewTime: (el.CheckerReviewTime === '0001-01-01T00:00:00' || !el.CheckerReviewTime) ? '' : el.CheckerReviewTime,
        approveremarks: el.approveremarks,
        rejectremarks: el.rejectremarks,
        reconsiderremarks: el.reconsiderremarks,
        Status: el.Status,
        ApprovalPurpose: el.ApprovalPurpose,
        roleName: el.roleName,
        CreatedBy: el.CreatedBy,
        activeInactiveRemark: el.activeInactiveRemark,
        creationDate: (el.creationDate === '0001-01-01T00:00:00' || !el.creationDate) ? '' : el.creationDate,
        creationTime: el.creationTime,
        IsActiveStatus: el.IsActiveStatus,
        UserType: el.UserType,
        ModifiedBy: el.ModifiedBy,
        ModifiedDate: el.ModifiedDate,
        ModifiedTime: el.ModifiedTime,
        ActivationRequestedBy: el.ActivationRequestedBy,
        ActivationRequestedDate: el.ActivationRequestedDate,
        ActivationRequestedTime: el.ActivationRequestedTime
      });

    });
    this.headerList2 = tableHeader;
    this.immutableFormattedData2 = JSON.parse(JSON.stringify(formattedData2));
    this.formattedData2 = formattedData2;
    this.loading2 = false;
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

  onReportTypeChange() {
    if(this.DumpReportForm.get('report_type').value == 1){
      this.getRoleReport();
    }
    else{
      this.formattedData = [];
      this.formattedData1 = [];
      this.formattedData2 = [];
    }
  }

  getAllsearch() {
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetAllReport';
    this._onlineExamService.postData(this.DumpReportForm.value, apiUrl)
      .subscribe(data => {
        this._StatusList = data;
        this._FilteredList = data;
        this.prepareTableData(this._StatusList, this._FilteredList);
        this.prepareTableData1(this._StatusList, this._FilteredList);
        this.prepareTableData2(this._StatusList, this._FilteredList);
      });
  }

  getRoleReport() {
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetAllReport';
    this._onlineExamService.postData(this.DumpReportForm.value, apiUrl)
      .subscribe(data => {
        this._StatusList = data;
        this._FilteredList = data;
        this.prepareTableData(this._StatusList, this._FilteredList);
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
    const headerRow = headerList.map(h => h.header).join(',');
    csv += headerRow + '\n';
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
