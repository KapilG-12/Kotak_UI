import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { Router } from "@angular/router";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-branch-mapping",
  templateUrl: "branch-mapping.component.html",
  styleUrls: ["branch-mapping.componenet.css"]
})
export class BranchMappingComponent implements OnInit {
  select_all = false;
  _data: any;
  ordersData = [];
  _UserList: any;
  _UserL: any;
  _List: any;
  entries: number = 10;
  activeRow: any;
  _FilteredList: [];
  _BranchList: any;
  _BranchID: any = 0;
  modalRef: BsModalRef;
  BranchMappingForm: FormGroup;
  AddBranchMappingForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = "";
  _userid: any = 0;
  first = 0;
  rows = 10;

  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  __checkedList: string = "";

  userEditID: number;
  master_checked: boolean = false;
  master_indeterminate: boolean = false;
  // checkbox_list  = [
  //   { id: 100, BranchName: 'order 1' },
  //   { id: 200, BranchName: 'order 2' },
  //   { id: 300, BranchName: 'order 3' },
  //   { id: 400, BranchName: 'order 4' }
  // ];
  checkbox_list = [];
  itemRows: any;
  get checklistArray() { return this.AddBranchMappingForm.get('checklist') as FormArray; }
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public router: Router,
    private formBuilder: FormBuilder
  ) { }
  ngOnInit() {
    this.BranchMappingForm = this.formBuilder.group({
      BranchName: ["", Validators.required],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      id: [0],
      UserIDS: ['', Validators.required],
      UserID: [0, Validators.required],
    });
    this.AddBranchMappingForm = this.formBuilder.group({
      BranchName: [""],
      SelectItem: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      id: [0],
      UserID: ["", Validators.required],
      checkedList: [""],

      checklist: this.formBuilder.array([]),
      selectAll: [false],
    });

    // this.geBranchListchecked();
    this.geUserList();
    this.geBranchList(0);

    //this.getBranch(0);
  }
  OnReset() {
    this.Reset = true;
    this.BranchMappingForm.reset({ User_Token: localStorage.getItem('User_Token'), UserID: 0, UserIDS: 0 });
    this.checklistArray.clear();

    this.modalRef.hide();
    //this.geBranchList();
  }

  geBranchList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
      this._global.baseAPIUrl +
      "BranchMapping/GetBranchDetailsUserWise?ID=" +
      userid +
      "&user_Token=" +
      this.BranchMappingForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      //console.log(data);

      this._BranchList = data;
      this._FilteredList = data;
      this.prepareTableData(this._BranchList, this._FilteredList);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    // alert(this.type);

    //console.log("LL",tableData);
    // if (this.type=="Checker" )
    //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'UserName', header: 'USER NAME', index: 3 },
      { field: 'SFCode', header: 'SF CODE', index: 2 },
      { field: 'SFName', header: 'SF Name', index: 2 },
    ];

    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'UserName': el.UserName,
        'SFCode': el.SFCode,
        'id': el.id,
        'UserID': el.UserID,
        'SFName': el.SFName,
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

  geUserList() {
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetList?user_Token=" +
      this.BranchMappingForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UserL = data;
      this.BranchMappingForm.controls["UserID"].setValue(0);
      this.BranchMappingForm.controls["UserIDS"].setValue(0);
    });
  }

  getBranch(userid: number) {
    const apiUrl =
      this._global.baseAPIUrl +
      "BranchMapping/GetDetails?ID=" +
      userid +
      "&user_Token=" +
      this.BranchMappingForm.get("User_Token").value;;
    this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
      this.checkbox_list = [];
      this.checkbox_list = res;
      this.checklistArray.clear()
      this.checkbox_list.forEach(item => {
        let fg = this.formBuilder.group({
          id: [item.id],
          BranchName: [item.BranchName],
          ischecked: [item.ischecked]
        })
        this.checklistArray.push(fg)
      });
    });
  }

  master_change() {
    let _bool = this.AddBranchMappingForm.controls['selectAll'].value;
    this.checklistArray.controls.forEach(role => {
      role.patchValue({ ischecked: _bool })
    });
  }
  deleteBranch(car: any) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-danger",
        confirmButtonText: "Yes, delete it!",
        cancelButtonClass: "btn btn-secondary",


      })
      .then((result) => {
        if (result.value) {
          this.BranchMappingForm.patchValue({
            id: car.id,
          });
          const apiUrl = this._global.baseAPIUrl + "BranchMapping/Delete";
          this._onlineExamService
            .postData(this.BranchMappingForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "Folder Mapping has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geBranchList(this.BranchMappingForm.get("UserIDS").value);

            });
        }
      });


  }
  filterTable($event) {
    let val = $event.target.value;
    this._FilteredList = this._BranchList.filter(function (d) {
      for (var key in d) {
        if (key == "UserName" || key == "BranchName") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
  addBranchMapping(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.getBranchForUser(0);
    this.BranchMappingForm.controls["UserID"].setValue(0);
  }
  onSubmit() {
    this.submitted = true;

    if (this.AddBranchMappingForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    this.__checkedList = "";
    var _chkstatus = false;
    for (let value of this.checklistArray.value) {
      if (value.ischecked) {
        this.__checkedList += value.id + "#";
        _chkstatus = true;
      }
    }

    if (_chkstatus == false) {
      console.log("_chkstatus", _chkstatus);
      alert("Please select at lease one branch");
      return;
    }
    this.AddBranchMappingForm.patchValue({
      checkedList: this.__checkedList,
      CreatedBy: 1,
      UserID: this.AddBranchMappingForm.get('UserID').value,
    });
    var objectToSend = {
      id: 0,
      User_Token: this.AddBranchMappingForm.get('User_Token').value,
      UserID: this.AddBranchMappingForm.get('UserID').value,
      checkedList: this.AddBranchMappingForm.get('checkedList').value,
      CreatedBy: this.AddBranchMappingForm.get('CreatedBy').value
    }
    const apiUrl = this._global.baseAPIUrl + "BranchMapping/Create";
    this._onlineExamService
      .postData(this.AddBranchMappingForm.value, apiUrl)
      .subscribe((data) => {
        this.toastr.show(
          '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Branch Mapping Done</span></div>',
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
        this.OnReset();
        this.BranchMappingForm.controls["UserID"].setValue(0);
        this.geBranchList(0);
      });

    //  }
  }

  list_change() {
    let checked_count = 0;
    for (let value of Object.values(this.checkbox_list)) {
      if (value.ischecked) checked_count++;
    }

    if (checked_count > 0 && checked_count < this.checkbox_list.length) {
      this.master_indeterminate = true;
    } else if (checked_count == this.checkbox_list.length) {
      this.master_indeterminate = false;
      this.master_checked = true;
    } else {
      this.master_indeterminate = false;
      this.master_checked = false;
    }
  }
  geBranchListByUserID(userid: number) {
    this.geBranchList(userid);
  }
  getBranchForUser(userid: number) {
    this.getBranch(userid)


  }
  editBranchMapping(template: TemplateRef<any>, row: any) {
    this.addBranchMapping(template)
    this.checklistArray.clear()
    this.AddBranchMappingForm.patchValue({ UserID: row.userid })
    this.getBranch(row.userid)
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
}
