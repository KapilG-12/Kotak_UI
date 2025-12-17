import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-addchecker-roles',
  templateUrl: './addchecker-roles.component.html',
  styleUrls: ['./addchecker-roles.component.scss']
})
export class AddcheckerRolesComponent implements OnInit {

  AddRoleForm: FormGroup;
  submitted = false;
  Reset = false;
  editrole = false;
  sMsg: string = '';
  UserList: any;
  modalRef: BsModalRef;
  _PageList: any;
  PageViewList: any;
  _RightList: any;
  _RoleList: any;
  _UserList: any;
  myFiles: string[] = [];
  _PageIDAndChk: any;
  _pageRights: any;
  Role: any;
  car: any;

  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,

    private http: HttpClient,
    private httpService: HttpClient
  ) { }

  get rf() { return this.AddRoleForm.controls; }
  get roles() { return this.AddRoleForm.get('Roles') as FormArray; }
  get _PageRight() { return this.AddRoleForm.get('_PageRight') as FormArray; }

  ngOnInit() {
    this.AddRoleForm = this.formBuilder.group({
      roleName: ['', Validators.required],
      Status: [""],
      id: [""],
      RoleApprovalPurpose: [""],
      remarks: ['', Validators.required],
      approveremarks: new FormControl('', [Validators.required]),
      rejectremarks: new FormControl('', [Validators.required]),
      reconsiderremarks: new FormControl('', [Validators.required]),
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      Roles: this.formBuilder.array([]),
      SelectAll: [false],
      SelectAllRights: [false],
      _PageIDAndChk: "",
      pageRights: "",
      _PageRight: this.formBuilder.array([]),
    });



    let _RoleID = localStorage.getItem('_RoleID');

    if (Number(_RoleID) > 0) {
      this.getPageList(Number(_RoleID));
      this.getRightList(Number(_RoleID));
      this.AddRoleForm.controls['roleName'].setValue(localStorage.getItem('_RoleName'));
      this.AddRoleForm.controls['remarks'].setValue(localStorage.getItem('_RoleRemark'));
      this.AddRoleForm.controls['RoleApprovalPurpose'].setValue(localStorage.getItem('_RoleApprovalPurpose'));
      this.Role = "Edit Role";
      this.editrole = true;
    }
    else {
      this.getPageList(0);
      this.getRightList(0);
      this.Role = "Create Role";
    }
  }

  getPageList(TID: number) {
    const apiUrl = this._global.baseAPIUrl + 'Role/GetPageList?ID=' + TID + '&user_Token=' + this.AddRoleForm.get('User_Token').value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._PageList = data;
      this._PageList.forEach(item => {
        if (item.parent_id == 0) {
          item.subItem = []
          let fg = this.formBuilder.group({
            page_name: [item.page_name],
            isChecked: [item.isChecked],
            subItems: this.formBuilder.array([]),
            id: [item.id],
            parent_id: [item.parent_id]
          })
          this.roles.push(fg)
        }
      })

      this._PageList.forEach(item => {
        if (item.parent_id && item.parent_id != 0) {
          let found = this.roles.controls.find(ctrl => ctrl.get('id').value == item.parent_id)
          if (found) {
            let fg = this.formBuilder.group({
              page_name: [item.page_name],
              isChecked: [item.isChecked],
              subItems: [[]],
              id: [item.id],
              parent_id: [item.parent_id]
            })
            let subItems = found.get('subItems') as FormArray
            subItems.push(fg)
          }
        }
      })
    });
  }

  getRightList(TID: number) {
    const apiUrl = this._global.baseAPIUrl + 'Role/GetRightList?ID=' + TID + '&user_Token=' + this.AddRoleForm.get('User_Token').value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RightList = data;
      this._RightList.forEach(item => {
        let fg = this.formBuilder.group({
          page_right: [item.page_right],
          isChecked: [item.isChecked],
          id: [item.id],
        })
        this._PageRight.push(fg)
      })
    });
  }

  onSubmit(type: string) {
    this.submitted = true;

    if (this.AddRoleForm.value.User_Token == null) {
      this.AddRoleForm.value.User_Token = localStorage.getItem('User_Token');
    }

    this.AddRoleForm.patchValue({
      Status: type,
      id: localStorage.getItem('_RoleID'),
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      RoleApprovalPurpose: localStorage.getItem('_RoleApprovalPurpose')
    });

    const apiUrl = this._global.baseAPIUrl + "Role/CheckerRoleApproval";
    this._onlineExamService.postData(this.AddRoleForm.value, apiUrl).subscribe((data) => {
      if (data === 'Role has been successfully Approved.') {
        this.ShowMessage(data);
        this.OnReset();
        this.OnBack();
        this.modalService.hide(1);
      } else {
        this.ShowErrormessage(data);
        this.OnReset();
        this.OnBack();
        this.modalService.hide(1);
      }
    });
  }

  editEmployee(template: TemplateRef<any>) {
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

  onCheckChild(role) {
    setTimeout(() => {
      let oneFalseFound = role
        .get("subItems")
        .controls.every((r) => r.get("isChecked").value == true);
      oneFalseFound
        ? role.patchValue({ isChecked: true })
        : role.patchValue({ isChecked: false });
    }, 100);
  }

  onCheckParent(role: any) {
    let _bool = role.get("isChecked").value;
    if (_bool) {
      role.get("subItems").controls.forEach((elm) => {
        elm.patchValue({ isChecked: false });
      });
    } else {
      role.get("subItems").controls.forEach((elm) => {
        elm.patchValue({ isChecked: true });
      });
    }
  }

  OnSelectAll() {
    let _bool = this.AddRoleForm.controls["SelectAll"].value;
    this.roles.controls.forEach((role) => {
      role.patchValue({ isChecked: _bool });
      let subItems = role.get("subItems") as FormArray;
      subItems.controls.forEach((elm) => {
        elm.patchValue({ isChecked: _bool });
      });
    });
  }

  OnSelectRightAll() {
    let _bool = this.AddRoleForm.controls["SelectAllRights"].value;
    this._PageRight.controls.forEach((role) => {
      role.patchValue({ isChecked: _bool });
    });
  }


  OnReset() {
    this.AddRoleForm.controls['roleName'].setValue("");
    this.AddRoleForm.controls['remarks'].setValue("");
    let _bool = false;
    this.roles.controls.forEach((role) => {
      role.patchValue({ isChecked: _bool });
      let subItems = role.get("subItems") as FormArray;
      subItems.controls.forEach((elm) => {
        elm.patchValue({ isChecked: _bool });
      });
    });
    this._PageRight.controls.forEach((role) => {
      role.patchValue({ isChecked: false });
    });
    this.AddRoleForm.patchValue({
      Status: "",
      approveremarks: '',
      rejectremarks: '',
      reconsiderremarks: '',
      _UserIDList: '',
      bulkrejectremarks: '',
      bulkapproveremarks: '',
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID')
    });
  }

  OnBack() {
    localStorage.removeItem('_RoleID');
    localStorage.removeItem('_RoleName');
    localStorage.removeItem('_RoleRemark');
    localStorage.removeItem('_RoleApprovalPurpose');
    this.router.navigate(['/usermanagement/checker-roles']);
  }

  MessageBox(msg: any) {

    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> ' + msg + ' </span></div>',
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
}
