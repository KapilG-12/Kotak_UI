import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import swal from "sweetalert2";
import { Router } from "@angular/router";
// import { Listboxclass } from '../../../Helper/Listboxclass';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-klap-branch-pending',
  templateUrl: './klap-branch-pending.component.html',
  styleUrls: ['./klap-branch-pending.component.scss']
})
export class KlapBranchPendingComponent implements OnInit {

 
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  isReadonly = true; 
  _IndexList:any; 
 UserID:any;
 PODAckForm: FormGroup;   
  submitted = false; 
  Reset = false;
  sMsg: string = '';  
  _FileNo:any="";
  first:any=0;
  rows:any=0;
  _IndexPendingListFile:any;
  _FilteredListFile:any;
 
   
// _Replacestr:any="D:/WW/14-Jully-2020/UI/src/assets";
  
  _TotalPages:any=0;
  _FileList:any;
  _FilteredList :any; 
  _IndexPendingList:any;
  bsValue = new Date();
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router : Router
  ){}
  ngOnInit(){
    document.body.classList.add('data-entry');
   
    this.PODAckForm = this.formBuilder.group({     
      
      
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') , 
      
    });
    
    this.getAuditpending();    
 
  }
   
  getAuditpending() {  

const apiUrl = this._global.baseAPIUrl + 'Klap/getBranchPending?UserID='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token');
this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
this._IndexPendingList = data;
this._FilteredList = data; 
 this.prepareTableData(this._FilteredList, this._IndexPendingList);

});
}

formattedData: any = [];
headerList: any;
immutableFormattedData: any;
loading: boolean = true;
prepareTableData(tableData, headerList) {
  let formattedData = [];
  let tableHeader: any = [
  { field: 'srNo', header: "SR NO", index: 1 },
  { field: 'batch_no', header: 'BATCH ID', index: 2 },
  { field: 'File_No', header: 'FILE NO', index: 2 },
  { field: 'document_type', header: 'DOCUMENT TYPE', index: 4 },
  { field: 'appl', header: 'APPL', index: 3 },
  { field: 'apac', header: 'APAC', index: 3 },
  { field: 'party_name', header: 'PARTY NAME', index: 3 }, 
  { field: 'location', header: 'LOCATION', index: 4 },  
  //{ field: 'sub_lcoation', header: 'SUB LOCATION', index: 4 },  
  { field: 'file_status', header: 'FILE STATUS', index: 4 }, 
  { field: 'status', header: 'STATUS', index: 3 },
  { field: 'audit_date', header: 'AUDIT DATE', index: 4 },  
  { field: 'send_to_auditor', header: 'SEND TO AUDITOR', index: 3 },  
  ];
  
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'File_No': el.File_No,    
      'appl_apac': el.appl_apac,    
      'appl': el.appl,       
       'status': el.status,   
       'file_status': el.file_status,   
      "apac": el.apac, 
      "party_name": el.party_name,  
      "audit_date": el.audit_date, 
      "location": el.location,   
      //"sub_lcoation": el.sub_lcoation,    
      "send_to_auditor": el.send_to_auditor, 
      "batch_no": el.batch_no, 
      "document_type": el.document_type, 
    });
  
  });
  this.headerList = tableHeader;
  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;
   
 // console.log(this.formattedData);

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
    
OnReset()
{
this.Reset = true;
this.PODAckForm.reset();
this.isReadonly = false;
 
}

Print(row:any)
{

  //console.log("Print",row);

   // const fileExt = _File.filePath.substring(_File.filePath.lastIndexOf('.'), _File.filePath.length);
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/DownloadFile?BatchNo='+row.batch_no +'&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {
     
        const pdf = new Blob([res], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(pdf);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl ; //this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
   //   }
 

      }
    });
    
  }
 

//}
 
 
onSubmit() {
this.submitted = true;

if(!this.validation()) {
  return;
}
 
const that = this;
const apiUrl = this._global.baseAPIUrl + 'BranchInward/PODAckdetailsEntry';
this._onlineExamService.postData(this.PODAckForm.value,apiUrl)
// .pipe(first())
.subscribe( data => {
    
this.toastr.show(
  '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> '+ data +' </span></div>',
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



// this.modalRef
this.modalRef.hide();
that.getAuditpending();
//this.OnReset();      
});
// }

}

paginate(e) {
  this.first = e.first;
  this.rows = e.rows;
}

hidepopup()
{
// this.modalService.hide;
this.modalRef.hide();
//this.modalRef.hide
}
    

Editinward(template: TemplateRef<any>, row: any) {
  var that = this; 

 if (row.Status =="POD Acknowledge" && localStorage.getItem('UserID') != '1' )
 {
   this.showmessage("You can not modify POD ");
   return;
 }
  
 this.PODAckForm.patchValue({     
  batch_no:row.batch_no,
  pod_no:row.pod_no,
  courier_name:row.CourierID, 
  new_pod_no:row.new_pod_no, 
  })
  
this.modalRef = this.modalService.show(template); 
this.GetBatchDetails();
//this.GetVerificationData(row.FileNo);

}
  entriesChange($event) {
    this.entries = $event.target.value;
  }
 
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  ngOnDestroy() {
    document.body.classList.remove('data-entry')
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
  
  validation()
  {
     
      var var_PODNo =this.PODAckForm.get('pod_no').value;

      if (var_PODNo.trim() =="" )
      {
                this.showmessage("Please Enter POD No");
                return false;
      }
      if (this.PODAckForm.get('courier_name').value ==0 || this.PODAckForm.get('courier_name').value ==null )
      {
                this.showmessage("Please Select Courier Name");
                return false;
      }
      if (this.PODAckForm.get('courier_name').value =="0" )
      {
                this.showmessage("Please Select Courier Name");
                return false;
      } 
            
      if (this.PODAckForm.get('batch_no').value =="" )
      {
                this.showmessage("Please Enter Batch No");
                return false;
      }   
       
      return true;

  } 
  
   

 

        formattedFileData: any = [];
        headerListFile: any;
        immutableFormattedDataFile: any;
//loading: boolean = true;

      BindFileDetails(tableData, headerList) {
        let formattedFileData = [];
        let tableHeader: any = [
          { field: 'srNo', header: "SR NO", index: 1 },
          { field: 'batch_no', header: 'BATCHNO', index: 2 },
          //  { field: 'pod_no', header: 'POD NO', index: 3 },
           { field: 'appl', header: 'APPL', index: 4 },
           { field: 'apac', header: 'APAC', index: 5 },
       
        ];
       
        tableData.forEach((el, index) => {
          formattedFileData.push({
            'srNo': parseInt(index + 1),
            'batch_no': el.batch_no,    
            // 'pod_no': el.pod_no,  
            'appl': el.appl,   
             'apac': el.apac,       
       
          });
         
        });
        this.headerListFile = tableHeader;
        this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
        this.formattedFileData = formattedFileData;
        this.loading = false;
         
       // console.log(this.formattedData);
      
      }


      GetBatchDetails() {      
 
        const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetBatchDetails?BatchNo='+this.PODAckForm.controls['batch_no'].value + '&USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token');
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
          this._IndexPendingListFile = data;
          this._FilteredListFile = data ;
  
        this.BindFileDetails(this._IndexPendingListFile, this._FilteredListFile);    
      
        });
      }

      viewDocumentList(row:any){

        localStorage.setItem('file_no',row.File_No);
        this.router.navigateByUrl('/klap/Branch-Document-List');
      }
 


}
