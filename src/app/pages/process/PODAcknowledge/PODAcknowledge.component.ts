import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import swal from "sweetalert2";
// import { Listboxclass } from '../../../Helper/Listboxclass';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-PODAcknowledge",
  templateUrl: "PODAcknowledge.component.html",
  styleUrls : ["PODAcknowledge.component.css"]
})
export class PODAcknowledgeComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  isReadonly = true;
  _TemplateList :any;   
  _IndexList:any;
  TempField:any;
  TemplateList:any;
 UserID:any;
  InwardForm: FormGroup;  
 
  submitted = false;
  _DeptList:any;
  Reset = false;
  sMsg: string = '';
  _IndexPendingListFile:any;
  _FilteredListFile:any;
  _FileNo:any="";
  first:any=0;
  rows:any=0
   
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
  ){}
  ngOnInit(){
    document.body.classList.add('data-entry');
   
    this.InwardForm = this.formBuilder.group({     
      PODNo: ['', Validators.required],   
      NewPODNo: ['', Validators.required],
      CourierName:[0, Validators.required],     
      DespatchedDate:['', Validators.required],
      BatchNo:['', Validators.required], 
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') , 
      
    });    
     
        this.GetPODDetails();     
        this.InwardForm.controls['CourierName'].setValue("0");
        this.UserID =localStorage.getItem('UserID');     
    // this.isReadonly = false;   
  }
 

  GetPODDetails() {  


const apiUrl = this._global.baseAPIUrl + 'Inward/GetPODDetailsACK?user_Token='+ localStorage.getItem('User_Token');
this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
this._IndexPendingList = data;
this._FilteredList = data
 //console.log("IndexListPending",data);

 this.prepareTableData(this._FilteredList, this._IndexPendingList);
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
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
    { field: 'BatchNo', header: 'BATCH NO', index: 2 },
    { field: 'PODNo', header: 'POD NO', index: 3 },
    { field: 'CourierName', header: 'COURIER NAME', index: 3 }, 
       { field: 'Status', header: 'POD STATUS', index: 7 },
 //  { field: 'department', header: 'Department', index: 4 },
 //  { field: 'docType', header: 'Doc Type', index: 5 },
   { field: 'DispatchDate', header: 'DISPATCH DATE', index: 8 },

   { field: 'AcknowledgeDate', header: 'ACKNOWLEDGE DATE', index: 8 },

    
    // { field: 'PODReceivedDate', header: 'RECDATE', index: 9 },
    // { field: 'filePath', header: 'File Path', index: 3 },
  ];
  // headerList.forEach((el, index) => {
  //   tableHeader.push({
  //     field: 'metadata-' + parseInt(index+1), header: el.DisplayName, index: parseInt(5+index)
  //   })
  // })
//    console.log("tableData",tableData);
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'BatchNo': el.BatchNo,    
      'PODNo': el.PODNo,    
      'CourierName': el.CourierName,   
    
       'Status': el.Status,         
      "DispatchDate": el.PODEntrydate,
    //  'department': el.DepartmentName,
      // 'docType': el.DocType,
    
      'AcknowledgeDate': el.AcknowledgeDate,       
 
    });
    // headerList.forEach((el1, i) => {
    //   formattedData[index]['metadata-' + parseInt(i + 1)] = el['Ref'+ parseInt(i+1)]
    // });
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
this.InwardForm.reset();
this.isReadonly = false;
 
}
 

onSubmit() {
this.submitted = true;

if(!this.validation()) {
  return;
}


const that = this;
const apiUrl = this._global.baseAPIUrl + 'Inward/PODAcknowledge';
this._onlineExamService.postData(this.InwardForm.value,apiUrl)
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
that.GetPODDetails();
//this.OnReset();      
});
// }

}


SendBackBranch() {
  this.submitted = true;
  
  if(!this.validation()) {
    return;
  }

  
  
  
  const that = this;
  const apiUrl = this._global.baseAPIUrl + 'Inward/SendBackBranch';
  this._onlineExamService.postData(this.InwardForm.value,apiUrl)
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
  that.GetPODDetails();
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
 // console.log("row----",row);
 /// this.FilePath = row.FilePath;\

 //console.log(row);
 //alert(row.PODNo);

 if (row.PODNo =="")
 {
  this.showmessage("POD No. should not be blank to Acknowledge POD");
  return;
 }

 if (row.Status !="POD Acknowledged")
 {

 this.InwardForm.patchValue({     
  BatchNo:row.BatchNo,
  PODNo:row.PODNo,
  

  })
  
this.modalRef = this.modalService.show(template); 
//this.GetVerificationData(row.FileNo);
this.GetbatchDetails();
}
else
{
  this.showmessage("POD already Acknowledge");
}

}



AddInward(template: TemplateRef<any>) {
  var that = this;
 // console.log("row----",row);
 /// this.FilePath = row.FilePath;\

 //console.log(row);
  
 this.InwardForm.patchValue({     
  PODNO:"",
  CourierName:0,   
 
  Remark:"",      

  })
  
this.modalRef = this.modalService.show(template); 
//this.GetVerificationData(row.FileNo);
   
}


AddIndexing(template: TemplateRef<any>, row: any) {
var that = this;
 
 
// console.log('form', this.AddBranchForm);
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
this.modalRef = this.modalService.show(template);

// this.GetFullFile(row.FileNo);
 
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
      // if (this.FileUPloadForm.get('BranchID').value <=0 )
      // {
      //          this.showmessage("Please Select Branch");
      //           return false;
      // }

      if (this.InwardForm.get('PODNo').value =="" )
      {
                this.showmessage("Please Enter POD No");
                return false;
      }
     
      return true;

  } 
  
  deleteCode(row: any) {

    console.log(row);

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

          this.InwardForm.patchValue({
            PODNO: row.PODNo,
          });
        
          const apiUrl = this._global.baseAPIUrl + 'Inward/Delete';
          this._onlineExamService.postData(this.InwardForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Customer has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.GetPODDetails();
            });
        }
      });
  }

  
  ongetTerritorycode() {

    let  PODNO = this.InwardForm.controls['PODNO'].value;
     // let  __TempID = this.InwardForm.controls['TemplateID'].value;  
      const apiUrl=this._global.baseAPIUrl+'Inward/GetPODCode?PODNo='+PODNO+'&user_Token='+ localStorage.getItem('User_Token');
  
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {             
   
        // this.InwardForm.controls['Remark'].setValue(data[0].Remark);
        // this.InwardForm.controls['CourierName'].setValue(data[0].CourierName);
        // this.InwardForm.controls['TotalInvoicecount'].setValue(data[0].TotalInvoicecount);

        // this.InwardForm.controls['Remark'].setValue(data[0].Remark);
        // this.InwardForm.controls['State'].setValue(data[0].State);
        // this.InwardForm.controls['Division'].setValue(data[0].Division);
        //console.log("FilePath", data[0].FilePath);
 

      });
  
      }

      formattedFileData: any = [];
      headerListFile: any;
      immutableFormattedDataFile: any;

      BindFileDetails(tableData, headerList) {
        let formattedFileData = [];
        let tableHeader: any = [
          { field: 'srNo', header: "SR NO", index: 1 },
          { field: 'BatchNo', header: 'BATCHNO', index: 2 },
           { field: 'PODNo', header: 'POD NO', index: 3 },
           { field: 'AccountNo', header: 'ACCOUNT NO', index: 7 },
          //  { field: 'CourierName', header: 'COURIER NAME', index: 3 },
        
       
        ];
       
        tableData.forEach((el, index) => {
          formattedFileData.push({
            'srNo': parseInt(index + 1),
            'BatchNo': el.BatchNo,    
            'PODNo': el.PODNo,  
            'AccountNo': el.AccountNo,    
            // 'CourierName': el.CourierName,    
             'Status': el.Status,     
            "DispatchDate": el.PODEntrydate,         
               
       
          });
         
        });
        this.headerListFile = tableHeader;
        this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
        this.formattedFileData = formattedFileData;
        this.loading = false;
         
       // console.log(this.formattedData);
      
      }


      GetbatchDetails() {
 
        // const apiUrl=this._global.baseAPIUrl+'Inward/GetPODCode?PODNo='+PODNO+'&user_Token='+ localStorage.getItem('User_Token');
        //  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
          const apiUrl = this._global.baseAPIUrl + 'Inward/GetBatchDetails?BatchNo='+this.InwardForm.controls['BatchNo'].value + '&USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token');
          this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
          
            this._IndexPendingListFile = data;
            this._FilteredListFile = data ;
            this.BindFileDetails(this._IndexPendingListFile, this._FilteredListFile);    
          });
      
          }

}
