import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
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
  selector: 'app-checker',
  templateUrl: './checker.component.html',
  styleUrls: ['./checker.component.scss']
})
export class CheckerComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  UserList: any;
  _FilteredList: any;
  _RoleList: any;
  AddUserForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = "";
  _SingleUser: any = [];
  _UserID: any;
  User: any;
  first = 0;
  rows = 10;
  bulkAction = false;
  selectedAction: string = "0";
  RejectBtn = true;
  ApproveBtn = true;
  UserCreatedBy: any;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
  ) { }
  ngOnInit() {
    this.AddUserForm = this.formBuilder.group({
      id: [""],
      UserID: [""],
      Status: [""],
      _UserIDList: [""],
      activeInactiveRemark: [""],
      ApprovalPurpose: [""],
      approveremarks: new FormControl('', [Validators.required]),
      rejectremarks: new FormControl('', [Validators.required]),
      bulkapproveremarks: new FormControl('', [Validators.required]),
      bulkrejectremarks: new FormControl('', [Validators.required]),
      reconsiderremarks: new FormControl('', [Validators.required]),
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID')
    });

    this.geRoleList();
    this.geUserList();
    this.User = "Create User";
    this.UserCreatedBy = localStorage.getItem('UserID');
  }

  get f() {
    return this.AddUserForm.controls;
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value;
    this._FilteredList = this.UserList.filter(function (d) {
      for (var key in d) {
        if (key == "firstname" || key == "email" || key == "userid" || key == "mobile" || key == "roleName") {
          if (d[key].toLowerCase().indexOf(val.toLowerCase()) !== -1) {
            return true;
          }
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

  geRoleList() {
    const userToken = this.AddUserForm.get('User_Token').value || localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "Role/GetList?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
    });
  }

  geUserList() {
    const userToken = this.AddUserForm.get('User_Token').value || localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "Admin/GetCheckerList?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.UserList = data;
      this._FilteredList = data;
      this.prepareTableData(this.UserList, this._FilteredList);
    });
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
      { field: 'srNo', header: "Sr No", index: 1 },
      { field: 'firstname', header: 'First Name', index: 3 },
      { field: 'lastname', header: 'Last Name', index: 3 },
      { field: 'userid', header: 'User id', index: 2 },
      { field: 'empid', header: 'Employee id', index: 2 },
      { field: 'email', header: 'E mail', index: 3 },
      { field: 'mobile', header: 'Mobile', index: 3 },
      { field: 'location', header: 'Location', index: 3 },
      { field: 'branchcode', header: 'Branch Code', index: 3 },
      { field: 'roleName', header: 'Role', index: 3 },
      { field: 'CreatedBy', header: 'Created By', index: 3 },
      { field: 'ModifiedBy', header: 'Modified By', index: 3 },
      { field: 'createdDate', header: 'Created DateTime', index: 3 },
      { field: 'modifiedDate', header: 'Modified DateTime', index: 3 },
      { field: 'ApprovalPurpose', header: 'Approval Purpose', index: 3 },
    ];

    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'firstname': el.firstname,
        'lastname': el.lastname,
        'id': el.id,
        'userid': el.userid,
        'empid': el.empid,
        'email': el.email,
        'mobile': el.mobile,
        'location': el.location,
        'branchcode': el.branchcode,
        'roleName': el.roleName,
        'AccountTypeID': el.AccountTypeID,
        'CreatedBy': el.CreatedBy,
        'CreatedById': el.CreatedById,
        'ModifiedById': el.ModifiedById,
        'activeInactiveBy': el.activeInactiveBy,
        'ApprovalPurpose': el.ApprovalPurpose,
        'ModifiedBy': el.ModifiedBy,
        'createdDate': el.createdDate,
        'activeInactiveRemark': el.activeInactiveRemark,
        'modifiedDate': el.modifiedDate,
        'isCheckboxDisabled': el.CreatedById === this.UserCreatedBy || el.ModifiedById === this.UserCreatedBy || el.activeInactiveBy === this.UserCreatedBy
                              || el.ApprovalPurpose === 'Activation Approval' || el.ApprovalPurpose === 'In-Activation Approval',
      });

    });
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

  OnReset() {
    this.Reset = true;
    this.AddUserForm.patchValue({
      UserID: "",
      Status: "",
      approveremarks: '',
      rejectremarks: '',
      reconsiderremarks: '',
      _UserIDList: '',
      bulkrejectremarks: '',
      bulkapproveremarks: '',
      ApprovalPurpose: '',
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID')
    });
    this.selectedAction = "0";
    this.ApproveBtn = true;
    this.RejectBtn = true;
    this.bulkAction = false;
    this.User = "Create User";
  }

  OnClose() {
    this.modalService.hide(1);
  }

  onSubmit(type: string) {
    this.submitted = true;

    if (this.AddUserForm.value.User_Token == null) {
      this.AddUserForm.value.User_Token = localStorage.getItem('User_Token');
    }

    this.AddUserForm.patchValue({
      Status: type,
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID')
    });

    const apiUrl = this._global.baseAPIUrl + "Admin/CheckerApproval";
    this._onlineExamService.postData(this.AddUserForm.value, apiUrl).subscribe((data) => {
      if (data === 'User has been successfully Approved.' || data === 'User activation/inactivation request has been approved.') {
        this.ShowMessage(data);
        this.OnReset();
        this.geUserList();
        this.modalService.hide(1);
      } else {
        this.ShowErrormessage(data);
        this.OnReset();
        this.geUserList();
        this.modalService.hide(1);
      }
    });
  }

  onBulkSubmit(type: string) {
    this.submitted = true;

    if (this.AddUserForm.value.User_Token == null) {
      this.AddUserForm.value.User_Token = localStorage.getItem('User_Token');
    }

    this.AddUserForm.patchValue({
      Status: type,
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID')
    });

    const apiUrl = this._global.baseAPIUrl + "Admin/CheckerBulkApproval";
    this._onlineExamService.postData(this.AddUserForm.value, apiUrl).subscribe((data) => {
      if (data === 'User has been successfully Approved.' || data === 'User activation/inactivation request has been approved.') {
        this.ShowMessage(data);
        this.OnReset();
        this.geUserList();
        this.modalService.hide(1);
      } else {
        this.ShowErrormessage(data);
        this.OnReset();
        this.geUserList();
        this.modalService.hide(1);
      }
    });
  }

  editEmployee(template: TemplateRef<any>, value: any) {
    this.AddUserForm.patchValue({
      UserID: value.id,
      ApprovalPurpose: value.ApprovalPurpose,
    });
    this.modalRef = this.modalService.show(template);
  }

  Activation(template: TemplateRef<any>, value: any) {
    this.AddUserForm.patchValue({
      UserID: value.id,
      activeInactiveRemark : value.activeInactiveRemark
    });
    this.modalRef = this.modalService.show(template);
  }

  BulkAction(template: TemplateRef<any>) {
    
    if (!this.selectedRowsUser || this.selectedRowsUser.length === 0) {
      this.ShowErrormessage("Please select at least one User");
      return;
    }

    let UserIDList = "";
    for (let j = 0; j < this.selectedRowsUser.length; j++) {
      UserIDList += this.selectedRowsUser[j] + ',';
    }
    
    let ApprovalPurposeList = this.formattedData
    .filter((row: any) => this.selectedRowsUser.includes(row.id)) 
    .map((row: any) => row.ApprovalPurpose)
    .join(",");

    this.AddUserForm.patchValue({
      _UserIDList: UserIDList,
      ApprovalPurpose: ApprovalPurposeList
    });
    this.modalRef = this.modalService.show(template);
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

  selectAllRows = false;
  // selectAllRow(e) {
  //   this.selectedRowsUser = [];
  //   if (e.checked) {
  //     this.selectAllRows = true;
  //     this.formattedData.forEach((el, index) => {
  //       this.selectedRowsUser.push(el.id);
  //       el.selected = true;
  //     })
  //   } else {
  //     this.selectAllRows = false;
  //     this.selectedRowsUser = [];
  //     this.formattedData.filter(el => el.selected).forEach(element => {
  //       element.selected = false;
  //     });
  //   }

  //   this.bulkAction = this.selectedRowsUser.length > 0;
  // }

selectAllRow(e) {
  this.selectedRowsUser = [];
  if (e.checked) {
    this.selectAllRows = true;
    this.formattedData.forEach((el) => {
      if (!el.isCheckboxDisabled) { 
        this.selectedRowsUser.push(el.id);
        el.selected = true;
      } else {
        el.selected = false;
      }
    });
  } else {
    this.selectAllRows = false;
    this.selectedRowsUser = [];
    this.formattedData.forEach(el => {
      el.selected = false;
    });
  }
  this.bulkAction = this.selectedRowsUser.length > 0;
}


  selectedRowsUser = [];
  selectRow(e, row) {
    this.selectAllRows = false;
    e.originalEvent.stopPropagation();
    if (e.checked) {
      this.selectedRowsUser.push(row.id);
    } else {
      this.selectAllRows = false;
      var index = this.selectedRowsUser.indexOf(row.slNo);
      this.selectedRowsUser.splice(index, 1);
    }

    this.bulkAction = this.selectedRowsUser.length > 0;
  }

  onSelectedAction(action: any) {
    if (action == 'Approve') {
      this.ApproveBtn = false;
      this.RejectBtn = true;
    }
    else if (action == 'Reject') {
      this.RejectBtn = false;
      this.ApproveBtn = true;
    }
    else {
      this.ApproveBtn = true;
      this.RejectBtn = true;
    }
  }
}
