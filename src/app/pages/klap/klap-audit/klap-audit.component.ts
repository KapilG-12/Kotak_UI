
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";


import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-klap-audit',
  templateUrl: './klap-audit.component.html',
  styleUrls: ['./klap-audit.component.scss']
})
export class KlapauditComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;   
  _FilteredList: any;
  _RoleList: any;
  AddKlapAuditForm: FormGroup;
  submitted = false;
  Reset = false;
  Isreadonly= false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
 _DocumentType="";
 documentsL:any;
 _message="";
  _UserID: any;
  User:any;
  first = 0;
  rows = 10;
  class:any;
  myFiles:string [] = [];
  httpService: any;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private router : Router
  ) {}
  ngOnInit() {
    this.AddKlapAuditForm = this.formBuilder.group({
      id: [""],
      document_type: [""],
      File_No: [""],      
      apac: [""],
      appl: [""],
      product: [""],
      location: [""],
      sub_lcoation: [""],
      maln_party_id: [""],
      party_name: [""],
      pdc_type: [""],
      apac_effective_date: [""],
      agr_value: [""],
      status:[""],
      document_Id: [0, Validators.required],
      query_status: [0, Validators.required],
      copy_type: [0, Validators.required],
      highlight_to_branch: [0, Validators.required],      
      cpu_query_remark: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID') 
    });
   
    
   this.getFiledetails();
    this.getDocumentList();  
  //  this.BindHeader("","");   
  }
 

  getDocumentList() {     
 
    const apiUrl = this._global.baseAPIUrl + 'Klap/getDcoument?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {   
    
          this.documentsL= data;
    });
  }
 
getFiledetails() {  

  this.AddKlapAuditForm.controls['File_No'].setValue(localStorage.getItem('file_no'));
  localStorage.removeItem("file_no");
// if(this.AddKlapAuditForm.value.File_No =="" || this.AddKlapAuditForm.value.File_No ==null) {
  
//   this.ShowErrormessage("Enter File No");
//   return false;
//  }

const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetFileDetailsKlap';          
this._onlineExamService.postData(this.AddKlapAuditForm.value,apiUrl)

.subscribe( data => {      
 //alert(data[0].message);

if (data[0].message =="Record found.")
{
  
  this.AddKlapAuditForm.controls['location'].setValue(data[0].location);
  this.AddKlapAuditForm.controls['sub_lcoation'].setValue(data[0].sub_lcoation);
  this.AddKlapAuditForm.controls['maln_party_id'].setValue(data[0].maln_party_id);
  this.AddKlapAuditForm.controls['party_name'].setValue(data[0].party_name);
  this.AddKlapAuditForm.controls['agr_value'].setValue(data[0].agr_value);
  this.AddKlapAuditForm.controls['pdc_type'].setValue(data[0].pdc_type);
  this.AddKlapAuditForm.controls['apac_effective_date'].setValue(data[0].apac_effective_date);
  this.AddKlapAuditForm.controls['apac'].setValue(data[0].apac);
  this.AddKlapAuditForm.controls['appl'].setValue(data[0].appl);
  this.AddKlapAuditForm.controls['document_type'].setValue(data[0].document_type);
  this.AddKlapAuditForm.controls['product'].setValue(data[0].product);

  this.GetFileDetailsKlap();

}
else
{  
  this.ShowErrormessage(data[0].message); 
  return;
}

});

}  

GetFileDetailsKlap() {     
 
  const apiUrl = this._global.baseAPIUrl + 'Klap/GetFileDetailsKlap?file_no='+this.AddKlapAuditForm.value.File_No+'&user_Token='+ localStorage.getItem('User_Token');
  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     

  this._FilteredList = data ;
  this.prepareTableData(data, data); 
  });
}

  entriesChange($event) {
    this.entries = $event.target.value;
  }
 
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
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
    { field: 'File_No', header: 'File No', index: 2 },   
     { field: 'documents', header: 'DOCUMENT', index: 3 },     
    { field: 'copy_type', header: 'COPY TYPE', index: 5},
    { field: 'query_status', header: 'QUERY STATUS', index: 6 },
    { field: 'highlight_to_branch', header: 'HIGHLIGHT TO BRANCH', index: 7 },
    { field: 'cpu_query_remark', header: 'CPU QUERY REMARK', index: 8 },   
      
  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'File_No': el.File_No,
      'documents': el.documents, 
      'copy_type': el.copy_type,
      'query_status': el.query_status,
      'highlight_to_branch': el.highlight_to_branch,  
      'cpu_query_remark': el.cpu_query_remark,  
    });
 
  });
  this.headerList = tableHeader;
//}

  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;

}


BindHeader(tableData, headerList) {
  
  let formattedData = []; 
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'File_No', header: 'File No', index: 2 },   
     { field: 'documents', header: 'DOCUMENT', index: 3 },     
    { field: 'copy_type', header: 'COPY TYPE', index: 5},
    { field: 'query_status', header: 'QUERY STATUS', index: 6 },
    { field: 'highlight_to_branch', header: 'HIGHLIGHT TO BRANCH', index: 7 },
    { field: 'cpu_query_remark', header: 'CPU QUERY REMARK', index: 8 },   
      
  ];

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
  this.AddKlapAuditForm.controls['product'].setValue('');
  this.AddKlapAuditForm.controls['location'].setValue('');
  this.AddKlapAuditForm.controls['sub_lcoation'].setValue('');
  this.AddKlapAuditForm.controls['maln_party_id'].setValue('');
  this.AddKlapAuditForm.controls['party_name'].setValue('');
  this.AddKlapAuditForm.controls['agr_value'].setValue('');
  this.AddKlapAuditForm.controls['pdc_type'].setValue('');
  this.AddKlapAuditForm.controls['apac_effective_date'].setValue('');
  this.AddKlapAuditForm.controls['document_type'].setValue('');
  this.AddKlapAuditForm.controls['apac'].setValue('');
  this.AddKlapAuditForm.controls['appl'].setValue('');  
  this.AddKlapAuditForm.controls['File_No'].setValue('');
  this.AddKlapAuditForm.controls['cpu_query_remark'].setValue('');
  this.AddKlapAuditForm.controls['highlight_to_branch'].setValue(0);
  this.AddKlapAuditForm.controls['document_Id'].setValue(0);
  this.AddKlapAuditForm.controls['copy_type'].setValue(0);
  this.AddKlapAuditForm.controls['query_status'].setValue(0); 

  this.BindHeader("","");
 
}
OnAddReset() {

  this.AddKlapAuditForm.controls['cpu_query_remark'].setValue('');
  this.AddKlapAuditForm.controls['highlight_to_branch'].setValue(0);
  this.AddKlapAuditForm.controls['document_Id'].setValue(0);
  this.AddKlapAuditForm.controls['copy_type'].setValue(0);
  this.AddKlapAuditForm.controls['query_status'].setValue(0); 
 
}

OnClose()
{
  this.modalService.hide(1);
}
//onAdd

onBack(){

  this.router.navigateByUrl('/klap/Klap-audit-Pending');

}

onAdd() {
  this.submitted = true;
  if(!this.validation())
  {
      return;
  }  
    const apiUrl = this._global.baseAPIUrl + "Klap/AddEditKlapdetails";
    this._onlineExamService
      .postData(this.AddKlapAuditForm.value, apiUrl)
      // .pipe(first())
      .subscribe((data) => {

if (data =='Record save succesfully')
{
  this.ShowMessage(data);  
}
else
{
  this.ShowErrormessage(data);
}


this.OnAddReset(); 
this.GetFileDetailsKlap();
      
      });
 
  
}

 
onSubmit() {
  this.submitted = true;
  if(!this.validation())
  {
      return;
  }  
    const apiUrl = this._global.baseAPIUrl + "BranchInward/AddEditAppacdetails";
    this._onlineExamService
      .postData(this.AddKlapAuditForm.value, apiUrl)
      // .pipe(first())
      .subscribe((data) => {

if (data =='Record save succesfully')
{
  this.ShowMessage(data);  
}
else
{
  this.ShowErrormessage(data);
}
this.OnReset(); 
this.GetFileDetailsKlap();
      
      });
 
  
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

validation()
{
 
  if(this.AddKlapAuditForm.value.File_No =="" || this.AddKlapAuditForm.value.File_No ==null) {
  
    this.ShowErrormessage("Enter File No");
    return false;
   }

   if(this.AddKlapAuditForm.value.document_Id ==0) {
  
    this.ShowErrormessage("Select Document");
    return false;
   }

   if(this.AddKlapAuditForm.value.copy_type ==0) {
  
    this.ShowErrormessage("Select copy_type");
    return false;
   }
   if(this.AddKlapAuditForm.value.query_status ==0) {
  
    this.ShowErrormessage("Select Query Status");
    return false;
   }
   if(this.AddKlapAuditForm.value.highlight_to_branch ==0) {
  
    this.ShowErrormessage("Select Highlight to branch");
    return false;
   }
  
   return true;
}

showmessage(data:any)
{
  this.toastr.show(
    '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> '+ data +' </span></div>',
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

 
OnSave(status:any) {
  this.submitted = true;

  this.AddKlapAuditForm.patchValue({     
    status:status    
    })
 
    const apiUrl = this._global.baseAPIUrl + "Klap/updatestatus";
    this._onlineExamService
      .postData(this.AddKlapAuditForm.value, apiUrl)
      // .pipe(first())
      .subscribe((data) => {
        this.ShowMessage(data);  
          this.OnReset(); 

          this.router.navigateByUrl('/klap/Klap-audit-Pending');
      
});
 
  
}




}

