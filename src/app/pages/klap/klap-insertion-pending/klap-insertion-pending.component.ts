import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";


@Component({
  selector: 'app-klap-insertion-pending',
  templateUrl: './klap-insertion-pending.component.html',
  styleUrls: ['./klap-insertion-pending.component.scss']
})
export class KlapInsertionPendingComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
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
    
    this.getInsertionAuditpending();    
 
  }
   
  getInsertionAuditpending() {  

const apiUrl = this._global.baseAPIUrl + 'Klap/getInsertionPending?UserID='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token');
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
  { field: 'appl', header: 'APPL', index: 3 },
  { field: 'apac', header: 'APAC', index: 3 },
  { field: 'party_name', header: 'PARTY NAME', index: 3 },
    { field: 'location', header: 'LOCATION', index: 4 }, 
//  { field: 'sub_lcoation', header: 'SUB LOCATION', index: 4 },  
  { field: 'status', header: 'STATUS', index: 3 },
  // { field: 'file_status', header: 'FILE STATUS', index: 4 }, 
  // { field: 'entry_date', header: 'AUDIT DATE', index: 4 },  
  // { field: 'remark', header: 'REMARK', index: 4 },  
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
      "entry_date": el.entry_date, 
      "remark": el.remark,  
      "location": el.location,  
  //    "sub_lcoation": el.sub_lcoation, 
      "batch_no": el.batch_no, 
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
 

  entriesChange($event) {
    this.entries = $event.target.value;
  }
 

  onActivate(event) {
    this.activeRow = event.row;
  }

  ngOnDestroy() {
    document.body.classList.remove('data-entry')
  }
  SendToKlap(row:any)
{
  localStorage.setItem('Audit_File_no',row.File_No);
 this.router.navigateByUrl('/klap/Klap-insertion-audit');

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
 





}
