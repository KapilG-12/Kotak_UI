import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { AbstractControl } from '@angular/forms';
import { ThirdPartyDraggable } from "@fullcalendar/interaction";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  AddBranchForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
 _BranchList :any;
 _DepartmentList:any;
  BranchForm: FormGroup;
  _FilteredList :any; 
 _BranchID: any =0;
// _FilteredList:any;
 //_IndexPendingList:any;
 first = 0;
rows = 10;

  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants
  ) {}
  ngOnInit() {
    this.AddBranchForm = this.formBuilder.group({
      documents: ['', Validators.required],
      user_Token: localStorage.getItem('User_Token') ,
      UserID: localStorage.getItem('UserID') ,
      id:[0]
    });
    this.geBranchList();
    //this.getDepartmentList();
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    //console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._BranchList.filter(function (d) {
    //  console.log(d);
      for (var key in d) {
        if (key == "BranchName") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
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
  geBranchList() {
    
    const apiUrl=this._global.baseAPIUrl+'Klap/getDcoument?user_Token='+ localStorage.getItem('User_Token')+'&UserID='+ localStorage.getItem('UserID')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._BranchList = data;
      this._FilteredList = data
this.prepareTableData( this._BranchList,  this._FilteredList);


    });
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
    { field: 'documents', header: 'Documents', index: 3 },
   // { field: 'BranchName', header: 'FOLDER', index: 2 },
 
  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'documents': el.documents,
      // 'BranchName': el.BranchName,
     'id': el.id,
       //'DepartmentID': el.DepartmentID,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
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
    this.AddBranchForm.controls['documents'].setValue('')
  
    this.modalRef.hide();  

  }


  getDepartmentList() {
    const apiUrl=this._global.baseAPIUrl+'Department/GetList?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._DepartmentList = data;
    //  this._FilteredList = data
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  onSubmit() {
    this.submitted = true;
    //console.log(this.AddBranchForm);
    if (this.AddBranchForm.invalid) {
      
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'Klap/AddEditDocuments';
    this._onlineExamService.postData(this.AddBranchForm.value,apiUrl).subscribe((data: {}) => {     
    // console.log(data);
     this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> Succesfully Updated the list</span></div>',
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
     this.geBranchList();
     
     
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
    this.OnReset()

    
  }

  
  deleteBrnach(template: TemplateRef<any>, row: any) {
    
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
          this.AddBranchForm.patchValue({
            id: row.id,
            documents:row.documents
          });
          const apiUrl = this._global.baseAPIUrl + 'Klap/DeleteDocument';
          this._onlineExamService.postData(this.AddBranchForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Folder has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              console.log("thisis the delected",data);
              
            });
            
            
        }
       // this.geBranchList();
      });

      this.geBranchList();
  }
  
  editBranch(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
      console.log('data', row);
      this.AddBranchForm.patchValue({
        id: that._SingleDepartment.id,
        documents: that._SingleDepartment.documents,
        user_Token: localStorage.getItem('User_Token') ,
        UserID: localStorage.getItem('UserID') 
      })
    

    this.modalRef = this.modalService.show(template);
  }
  addBranch(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

}




export function noEmptySpacesValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value && control.value.trim() === '') {
    return { 'emptySpaces': true };
  }
  return null;
}
