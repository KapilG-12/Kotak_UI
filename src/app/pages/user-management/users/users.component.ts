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
  selector: "app-users",
  templateUrl: "users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
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
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      userid: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9.]+$/)]],
      empid: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      pwd: [""], //, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/)]
      confirmPass: [""], //, Validators.required
      email: ["", [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      mobile: ["", [Validators.pattern(/^[6-9]\d{9}$/)]],
      location: new FormControl('', [Validators.required]),
      branchcode: new FormControl('', [Validators.required]),
      activeInactiveRemark: [""],
      sysRoleID: ["", Validators.required],
      UserType: ["", Validators.required],
      Remarks: [""],
      UserCreatedBy: [""],
      creationDate: [""],
      createdDate: [""],
      createdTime: [""],
      CheckerReviewBy: [""],
      CheckerReviewDate: [""],
      checkerReviewDate: [""],
      ModifiedBy: [""],
      modifiedDate: [""],
      modifiedTime: [""],
      checkerReviewTime: [""],
      ReviewerRemark: [""],
      activeInactiveViewRemark: [""],
      Status: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      ActiveInactiveBy: [""],
      ActiveInactiveDate: [""],
      ActiveInactiveTime: [""]
    }, {
      validator: this.ConfirmedValidator('pwd', 'confirmPass')
    });

    this.geRoleList();
    this.geUserList();
    this.User = "Create User";

  }

  //Newly added code 
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
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
    const apiUrl = this._global.baseAPIUrl + "Role/GetListForUserCreation?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
    });
  }
  geUserList() {
    const userToken = this.AddUserForm.get('User_Token').value || localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "Admin/GetList?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.UserList = data;
      this._FilteredList = data;
      this.prepareTableData(this.UserList, this._FilteredList);
      this.prepareTableDataa(this.UserList, this._FilteredList);
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
      { field: 'userid', header: 'User Id', index: 2 },
      { field: 'empid', header: 'Employee Id', index: 2 },
      { field: 'email', header: 'E-mail', index: 3 },
      { field: 'mobile', header: 'Mobile', index: 3 },
      { field: 'location', header: 'Location', index: 3 },
      { field: 'branchcode', header: 'Branch Code', index: 3 },
      { field: 'roleName', header: 'Role', index: 3 },
      { field: 'LastLoginDatetime', header: 'Last Login Date', index: 3 },
      { field: 'UserType', header: 'User Type', index: 3 },
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
        'Status': el.Status,
        'UserType': el.UserType,
        'LastLoginDatetime': el.LastLoginDatetime,
        'AccountTypeID': el.AccountTypeID,
        'ISACTIVE':
          (el.ApprovalPurpose === "Activation Approval" || el.ApprovalPurpose === "In-Activation Approval")
            ? "Pending For Approval"
            : el.IsActive === "Y"
              ? "Active"
              : "In-Active",
        // 'ISACTIVE': el.IsActive == "Y" ? "Active" : "In-Active",
        'checked': el.IsActive === "Y" ? false : true,
      });

    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }

  formattedDataa: any = [];
  headerListt: any;
  immutableFormattedDataa: any;
  loadings: boolean = true;
  prepareTableDataa(tableData, headerListt) {
    let formattedDataa = [];
    let tableHeader: any = [
      { field: 'srNo', header: "Sr No", index: 1 },
      { field: '', header: 'Created By', index: 3 },
      { field: 'creationDate', header: 'Created Date', index: 3 },
      { field: 'createdTime', header: 'Created Time', index: 3 },
      { field: '', header: 'Approved By', index: 3 },
      { field: '', header: 'Approved Date', index: 3 },
      { field: '', header: 'Approved Time', index: 3 },
      { field: 'LastLoginDatetime', header: 'Last Login Date', index: 3 },
    ];

    tableData.forEach((el, index) => {
      formattedDataa.push({
        'srNo': parseInt(index + 1),
        'LastLoginDatetime': el.LastLoginDatetime,
        'createdTime': el.createdTime,
        'creationDate': el.creationDate,
      });

    });
    this.headerListt = tableHeader;
    this.immutableFormattedDataa = JSON.parse(JSON.stringify(formattedDataa));
    this.formattedDataa = formattedDataa;
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
      firstname: '',
      lastname: '',
      userid: '',
      empid: '',
      pwd: '',
      confirmPass: '',
      email: '',
      mobile: '',
      location: '',
      branchcode: '',
      sysRoleID: '',
      UserType: '',
      Remarks: '',
      id: '',
      activeInactiveRemark: ''
    })
    this.User = "Create User";
  }

  OnClose() {
    this.modalService.hide(1);
  }

  hidepopup() {
    this.modalService.hide(1);
  }

  onSubmit() {
    this.submitted = true;

    if ((this.AddUserForm.value.firstname?.trim() ?? '') === "") {
      this.ShowErrormessage("Please enter user");
      return;
    }

    if (this.AddUserForm.value.User_Token == null) {
      this.AddUserForm.value.User_Token = localStorage.getItem('User_Token');
    }
    if (this.AddUserForm.get('id').value) {
      const apiUrl = this._global.baseAPIUrl + "Admin/Update";
      this._onlineExamService
        .postData(this.AddUserForm.value, apiUrl)
        .subscribe((data) => {
          if (data != null) {

            this.ShowMessage("User Details Updated Successfully.");
            this.modalService.hide(1);
            this.OnReset();
            this.geUserList();
          } else {
          }
        });
    } else {
      const apiUrl = this._global.baseAPIUrl + "Admin/Create";
      this._onlineExamService
        .postData(this.AddUserForm.value, apiUrl)
        .subscribe((data) => {
          if (data == 1) {
            this.ShowMessage("User Created Successfully.");

            this.OnReset();
            this.geUserList();
            this.modalService.hide(1);
          } else {
            this.ShowErrormessage("User already exists with the UserID & EmpID.");
          }
        });
    }
  }

  editEmployee(template: TemplateRef<any>, value: any) {
    this.User = "Edit user details";
    if (localStorage.getItem('UserID') == value.id) {
      this.ShowErrormessage('You cannot modify your own details.');
      return;
    }
    const apiUrl = this._global.baseAPIUrl + "Admin/GetDetails?ID=" + value.id + "&user_Token=" + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      var that = this;
      that._SingleUser = data;
      this.AddUserForm.patchValue({
        id: that._SingleUser.id,
        firstname: that._SingleUser.firstname,
        lastname: that._SingleUser.lastname,
        userid: that._SingleUser.userid,
        empid: that._SingleUser.empid,
        pwd: that._SingleUser.pwd,
        confirmPass: that._SingleUser.pwd,
        email: that._SingleUser.email,
        mobile: that._SingleUser.mobile,
        location: that._SingleUser.location,
        branchcode: that._SingleUser.branchcode,
        sysRoleID: that._SingleUser.sysRoleID,
        UserType: that._SingleUser.UserType,
        Remarks: that._SingleUser.remarks,
      })
    });
    this.AddUserForm.controls['userid'].disable();
    this.AddUserForm.controls['empid'].disable();
    // this.AddUserForm.controls['email'].disable();
    this.modalRef = this.modalService.show(template);
  }

  filter() {
    const firstnameControl = this.AddUserForm.get('firstname');
    const lastnameControl = this.AddUserForm.get('lastname');
    const mobileControl = this.AddUserForm.get('mobile');
    const loactionControl = this.AddUserForm.get('location');


    if (firstnameControl) {
      let filteredFirst = firstnameControl.value?.replace(/[^a-zA-Z ]/g, '') || '';
      filteredFirst = filteredFirst.replace(/^\s+/, ''); // Remove leading space
      if (firstnameControl.value !== filteredFirst) {
        firstnameControl.setValue(filteredFirst, { emitEvent: false });
      }
    }

    if (lastnameControl) {
      let filteredLast = lastnameControl.value?.replace(/[^a-zA-Z ]/g, '') || '';
      filteredLast = filteredLast.replace(/^\s+/, ''); // Remove leading space
      if (lastnameControl.value !== filteredLast) {
        lastnameControl.setValue(filteredLast, { emitEvent: false });
      }
    }

    if (mobileControl) {
      let value = mobileControl.value || '';
      value = value.replace(/[^0-9]/g, '');
      if (value.length > 0 && !/^[6-9]/.test(value)) {
        value = '';
      }
      value = value.slice(0, 10);
      if (mobileControl.value !== value) {
        mobileControl.setValue(value, { emitEvent: false });
      }
    }

    if (loactionControl) {
      let filteredloaction = loactionControl.value?.replace(/[^a-zA-Z ]/g, '') || '';
      filteredloaction = filteredloaction.replace(/^\s+/, ''); // Remove leading space
      if (loactionControl.value !== filteredloaction) {
        loactionControl.setValue(filteredloaction, { emitEvent: false });
      }
    }
  }


  ActiveInactiveProject(id: any) {
    var temp: any;
    if (id.ISACTIVE === "Active") {
      temp = "In-Active"
    }
    else {
      temp = "Active"
    }

    if (id.roleName == "Admin") {
      this.ShowErrormessage("You can not take action on Admin Role account.");
      return;
    }

    if (id.id == localStorage.getItem('UserID')) {
      this.ShowErrormessage("You cannot take action on your own profile.");
      return;
    }

    if (id !== localStorage.getItem("UserID")) {
      const swalOptions: any = {
        title: "Are you sure?",
        text: "You want to " + temp + " the User?",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: "btn dangerbtn",
        confirmButtonText: "Yes " + temp + " it!",
        cancelButtonClass: "btn successbtn",
        input: "textarea",
        inputLabel: "Remark",
        inputPlaceholder: "Enter reason for making user " + temp,
        inputValidator: (value) => {
          if (!value || value.trim() === "") {
            return "Remark is required.";
          }
          return null;
        },
      };

      swal.fire(swalOptions).then((result) => {
        if (result.value) {
          this.AddUserForm.patchValue({
            id: id.id,
            User_Token: localStorage.getItem("User_Token"),
            activeInactiveRemark: result.value
          });

          const apiUrl = this._global.baseAPIUrl + "Admin/ActiveInactiveRequest";
          this._onlineExamService.postData(this.AddUserForm.value, apiUrl).subscribe((data) => {
            swal.fire({
              title: "Requested !",
              text: "Request sent to Checker for approval !",
              type: "success",
              buttonsStyling: false,
              confirmButtonClass: "btn successbtn",
            });
            this.geUserList();
          });
        }
      });
    } else {
      this.ShowErrormessage("Your already log in so you can not delete!");
    }

    this.geUserList();
  }

  addUser(template: TemplateRef<any>) {
    this.AddUserForm.controls['userid'].enable();
    this.AddUserForm.controls['empid'].enable();
    // this.AddUserForm.controls['email'].enable();

    this.AddUserForm.patchValue({
      firstname: '',
      lastname: '',
      userid: '',
      empid: '',
      pwd: '',
      confirmPass: '',
      email: '',
      mobile: '',
      location: '',
      branchcode: '',
      sysRoleID: '',
      UserType: '',
      Remarks: '',
      id: ''
    })

    this.User = "Create user";
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


  ViewNACH(template: TemplateRef<any>, selectedUser: any) {
    const userId = selectedUser.id;  // or selectedUser.UserID if that's your key
    this.getUserDetailsById(userId, template);
  }

  getUserDetailsById(userId: number, template: TemplateRef<any>) {
    const userToken = this.AddUserForm.get('User_Token')?.value || localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "Admin/GetById?id=" + userId + "&user_Token=" + userToken;

    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      if (data) {
        this.AddUserForm.patchValue({
          UserCreatedBy: data.CreatedBy,
          creationDate: data.creationDate,
          createdDate: data.createdDate,
          createdTime: data.createdTime,
          CheckerReviewBy: data.CheckerReviewBy,
          checkerReviewDate: data.checkerReviewDate,
          checkerReviewTime: data.checkerReviewTime,
          ModifiedBy: data.ModifiedBy,
          modifiedDate: data.modifiedDate,
          modifiedTime: data.modifiedTime,
          LastLoginDatetime: data.LastLoginDatetime,
          Status: data.Status,
          Role: data.Role,
          UserType: data.UserType,
          User_Token: data.User_Token,
          branchcode: data.branchcode,
          location: data.location,
          sysRoleID: data.sysRoleID,
          ReviewerRemark: data.ReviewerRemark,
          activeInactiveViewRemark: data.activeInactiveRemark,
          ActiveInactiveBy: data.ActiveInactiveBy,
          ActiveInactiveDate: data.ActiveInactiveDate,
          ActiveInactiveTime: data.ActiveInactiveTime
        });
        this.modalRef = this.modalService.show(template);
      }
    });
  }

}

