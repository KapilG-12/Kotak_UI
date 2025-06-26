import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup,FormControl, FormBuilder, Validators } from "@angular/forms";
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
  selector: 'app-file-acknowledge',
  templateUrl: './file-acknowledge.component.html',
  styleUrls: ['./file-acknowledge.component.scss']
})
export class FileAcknowledgeComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;

  UserList: any;
  _FilteredList: any;
  _RoleList: any;
  AddApprovalForm: FormGroup;
  submitted = false;
  Reset = false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
  _SingleUser: any = [];
  _UserID: any;
  User:any;
  first = 0;
  rows = 10;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
  ) {}
  ngOnInit() {
    this.AddApprovalForm = this.formBuilder.group({
      id: [""],
      podName: new FormControl('', [Validators.required]),
      userid: ["", Validators.required],
      User_Token: localStorage.getItem('User_Token'),
    });
    this.geUserList();
this.User ="Create User";

  }

  get f(){
    return this.AddApprovalForm.controls;
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
  //  console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this.UserList.filter(function (d) {
    //  console.log(d);
      for (var key in d) {
        if (key == "name" || key == "email" || key == "userid" || key == "mobile" || key == "roleName") {
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

  geUserList() {
    const userToken = this.AddApprovalForm.get('User_Token').value || localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "Admin/GetList?user_Token="+userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.UserList = data;
      this._FilteredList = data;
      this.prepareTableData( this.UserList,  this._FilteredList);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
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
 // alert(this.type);

// if (this.type=="Checker" )
//{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'lanno', header: 'LANNO', index: 3 },
    { field: 'customerNmae', header: 'CUSTOMER NAME', index: 2 },
    { field: 'barcode', header: 'BARCODE', index: 3 },
    { field: 'requestType', header: 'REQUEST TYPE', index: 3 },
    { field: 'requestReason', header: 'REQUEST REASON', index: 3 },
    { field: 'dispatchAddress', header: 'DISPATCH ADDRESS', index: 3 },
    { field: 'status', header: 'STATUS', index: 3 },
    { field: 'requestedby', header: 'REQUESTED BY', index: 3 },
    { field: 'requestdate', header: 'REQUEST DATE', index: 3 },
  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'lanno': el.lanno,
      'customerNmae': el.customerNmae,
      'barcode': el.barcode,
      'requestType': el.requestType,
      'requestReason': el.requestReason,
      'dispatchAddress': el.dispatchAddress,
      'status': el.status,
      'requestedby': el.requestedby,
      'requestdate': el.requestdate,  
    
    });
 
  });
  this.headerList = tableHeader;
//}

  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;

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

  OnReset() {
    this.Reset = true;
    this.AddApprovalForm.reset();
    this.User ="Create User";
  }

  OnClose()
  {
    this.modalService.hide(1);
  }

  onSubmit() {
    this.submitted = true; 

    if(this.AddApprovalForm.value.sysRoleID <=0) {
     this.ShowErrormessage("Select Role Name");
     return;
    }
    
    if(this.AddApprovalForm.value.userid.trim() =="") {
      this.ShowErrormessage("Please enter user ID");
      return;
     }
     

    if(this.AddApprovalForm.value.User_Token == null) {
      this.AddApprovalForm.value.User_Token = localStorage.getItem('User_Token');
    }
    if (this.AddApprovalForm.get('id').value) {
     // console.log('Form',this.AddUserForm.value);
      //console.log('Inside Edit');
      const apiUrl = this._global.baseAPIUrl + "Admin/Update";
      this._onlineExamService
        .postData(this.AddApprovalForm.value, apiUrl)
        // .pipe(first())
        .subscribe((data) => {
          if (data != null) {
           
            this.ShowMessage("Record Updated Successfully.."); 
            // alert("Record Updated Succesfully..");
            this.modalService.hide(1);
            this.OnReset();
            //this.router.navigate(['/student']);
            this.geUserList();
          } else {
            // Open Modal like you have opned in other pages
            //alert("User already exists.");
          }
        });
    } else {
     // console.log('Form',this.AddUserForm.value);
     // console.log('Inside Create');
      const apiUrl = this._global.baseAPIUrl + "Admin/Create";
      this._onlineExamService
        .postData(this.AddApprovalForm.value, apiUrl)
        // .pipe(first())
        .subscribe((data) => {
          if (data == 1) {
           // alert("Record Saved Successfully..");
           this.ShowMessage("Record Saved Successfully.."); 
           
           this.OnReset();
            //this.router.navigate(['/student']);
            this.geUserList();
            this.modalService.hide(1);
          } else {
            this.ShowErrormessage("User already exists.");
           // alert("User already exists.");
          }
        });
    }

    //this.studentForm.patchValue({File: formData});
  }


  deleteEmployee(id: any) {

    if (id != localStorage.getItem('UserID'))
{
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
          this.AddApprovalForm.patchValue({
            id: id.id,
            User_Token: localStorage.getItem('User_Token'),
          });

          const apiUrl = this._global.baseAPIUrl + "Admin/Delete";
          this._onlineExamService
            .postData(this.AddApprovalForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "User has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geUserList();
            });
        }
      });
    }
    else
    {

      this.ShowErrormessage("Your already log in so you can not delete!");
    }
    }
//---
addUser(template: TemplateRef<any>){
    // this.modalRef = this.modalService.show(template);
    this.AddApprovalForm.patchValue({
      podName: '',
      courierName: '',
      id:''
    })
    this.User ="Create user";
  }


  ShowErrormessage(data:any)
  {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error ! </span> <span data-notify="message"> '+ data +' </span></div>',
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

  ShowMessage(data:any)
  {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success ! </span> <span data-notify="message"> '+ data +' </span></div>',
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

