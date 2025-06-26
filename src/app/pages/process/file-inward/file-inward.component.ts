
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { Router } from '@angular/router';

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
  selector: 'app-file-inward',
  templateUrl: './file-inward.component.html',
  styleUrls: ['./file-inward.component.scss']
})
export class FileinwardComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;   
  _FilteredList: any;
  AddFileInwardForm: FormGroup;
  submitted = false;
  Reset = false;
  Isreadonly= false;
  //_UserList: any;
  sMsg: string = "";  
 _message="";
  _UserID: any;
  document_typeList:any;
  User:any;
  first = 0;
  rows = 10;
  class:any;
  myFiles:string [] = [];
  _FileDetails:string [][] = [];
  FileUPloadForm: any;
  httpService: any;
  IsreadonlyFileno= false; 

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private router : Router
  ) {}
  ngOnInit() {
    this.AddFileInwardForm = this.formBuilder.group({
      id: [""],
      BatchNo: [localStorage.getItem('fileInwardBatch'), [Validators.required]],
      document_type: [""],
      apac: ["", Validators.required],
      File_No: ["", Validators.required],
      appl: [""],
      product: [""],
      location: [""],
      sub_lcoation: [""],
      maln_party_id: [""],
      party_name: [""],
      pdc_type: [""],
      apac_effective_date: [""],
      agr_value: [""],
      file_status:"",
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID') 
    });

    this.GetBatchDetails();
  
 this.BindHeader( this._FilteredList);  
  
  }

  GetBatchDetails() {      
 
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetBatchDetailsAck?BatchNo='+this.AddFileInwardForm.controls['BatchNo'].value + '&USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     

    this.AddFileInwardForm.controls['BatchNo'].setValue(data[0].BatchNo);     
     this._FilteredList = data ;
    this.prepareTableData(data, data);   
    this.Isreadonly=true;

    });
  }
 
getAppackDetails() {  

  if(this.AddFileInwardForm.value.BatchNo =="" || this.AddFileInwardForm.value.BatchNo ==null) {   
        this.ShowErrormessage("Enter BatchNo value");
        return false;
    }  
    if(this.AddFileInwardForm.value.apac =="" || this.AddFileInwardForm.value.apac ==null) {   
      this.ShowErrormessage("Enter Apac value");
      return false;
  }  
 
const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetAppacDetailsAck';          
this._onlineExamService.postData(this.AddFileInwardForm.value,apiUrl)

.subscribe( data => {      
   
if (data[0].message =="Record found.")
{
  console.log("Data",data[0]);
  this.AddFileInwardForm.controls['product'].setValue(data[0].product);
  this.AddFileInwardForm.controls['location'].setValue(data[0].location);
  this.AddFileInwardForm.controls['sub_lcoation'].setValue(data[0].sub_lcoation);
  this.AddFileInwardForm.controls['maln_party_id'].setValue(data[0].maln_party_id);
  this.AddFileInwardForm.controls['party_name'].setValue(data[0].party_name);
  this.AddFileInwardForm.controls['agr_value'].setValue(data[0].agr_value);
  this.AddFileInwardForm.controls['pdc_type'].setValue(data[0].pdc_type);
  this.AddFileInwardForm.controls['apac_effective_date'].setValue(data[0].apac_effective_date);
  this.AddFileInwardForm.controls['appl'].setValue(data[0].appl);
  this.AddFileInwardForm.controls['document_type'].setValue(data[0].document_type);
  this.AddFileInwardForm.controls['File_No'].setValue(data[0].File_No);
   this.IsreadonlyFileno=true;
 //  this.Isreadonly=false;
}
else
{
  this.ShowErrormessage(data[0].message);
  this.AddFileInwardForm.controls['apac'].setValue('');  
  return;
}

});

}

onBack(){
  this.router.navigateByUrl('/process/pod-ack');
}


getDocumentdetails()
    {
      const apiUrl=this._global.baseAPIUrl+'BranchInward/getDocumentdetails?user_Token='+localStorage.getItem('User_Token')+"&appl="+this.AddFileInwardForm.get("appl").value+"&apac="+this.AddFileInwardForm.get("apac").value; 
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
        console.log("Doc Type" , data);
        this.document_typeList =data;  
      });

    }

// getDocumentdetails() {  

  
//   const apiUrl = this._global.baseAPIUrl + 'BranchInward/getDocumentdetails';          
//   this._onlineExamService.postData(this.AddBranchInwardForm.value,apiUrl)
  
//   .subscribe((data: {}) => {       

//     console.log("Doc Type" , data);
//     this.document_typeList =data;  
//   });  
//   } 
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
    { field: 'BatchNo', header: 'BATCH ID', index: 2 },   
    { field: 'apac', header: 'APAC', index: 3 },
    { field: 'appl', header: 'APPL', index: 4 },
    { field: 'document_type', header: 'DOCUMENT TYPE', index: 4 },
    { field: 'File_No', header: 'FILE NO', index: 4 },
    { field: 'status', header: 'STATUS', index: 4 },
    { field: 'file_status', header: 'FILE STATUS', index: 4 },
 
 //   { field: 'document_type', headerList: 'DOCUMENT TYPE', index: 5},
    // { field: 'product', header: 'PRODUCT', index: 6 },
    // { field: 'location', header: 'LOCATION', index: 7 },
    // { field: 'sub_lcoation', header: 'SUB LOACTION', index: 8 },
    // { field: 'maln_party_id', header: 'MAIN PARTY ID', index: 9 },
    // { field: 'party_name', header: 'PARTY NAME', index: 10 },
    // { field: 'agr_value', header: 'AGR VALUE', index: 11},
    // { field: 'pdc_type', header: 'PDC TYPE', index: 12}, 
    // { field: 'apac_effective_date', header: 'APAC EFFECTIVE DATE', index: 13}, 
      
  ];
 console.log("tableData",tableData);
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'BatchNo': el.BatchNo,
      'document_type': el.document_type,
      'apac': el.apac,
      'appl': el.appl,
      'File_No': el.File_No,
      'status': el.status,
      'file_status': el.file_status,
      // 'product': el.product,
      // 'location': el.location,
      // 'sub_lcoation': el.sub_lcoation,
      // 'maln_party_id': el.maln_party_id,
      // 'party_name': el.party_name,
      // 'agr_value': el.agr_value,
      // 'pdc_type': el.pdc_type,
      // 'apac_effective_date': el.apac_effective_date
    });


 
  });
  this.headerList = tableHeader;
//}

  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;

}


BindHeader(tableData) {

  let formattedData = []; 
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'BatchNo', header: 'BATCH ID', index: 2 },   
    { field: 'apac', header: 'APAC', index: 3 },
    { field: 'appl', header: 'APPL', index: 4 },
    { field: 'document_type', header: 'DOCUMENT TYPE', index: 4 },
    { field: 'File_No', header: 'FILE NO', index: 4 },
    { field: 'status', header: 'STATUS', index: 4 },
    { field: 'file_status', header: 'FILE STATUS', index: 4 },  
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
  this.AddFileInwardForm.controls['product'].setValue('');
  this.AddFileInwardForm.controls['location'].setValue('');
  this.AddFileInwardForm.controls['sub_lcoation'].setValue('');
  this.AddFileInwardForm.controls['maln_party_id'].setValue('');
  this.AddFileInwardForm.controls['File_No'].setValue('');
  this.AddFileInwardForm.controls['party_name'].setValue('');
  this.AddFileInwardForm.controls['agr_value'].setValue('');
  this.AddFileInwardForm.controls['pdc_type'].setValue('');
  this.AddFileInwardForm.controls['apac_effective_date'].setValue('');
  this.AddFileInwardForm.controls['document_type'].setValue('');
  this.AddFileInwardForm.controls['apac'].setValue('');
  this.AddFileInwardForm.controls['appl'].setValue('');
 // this.AddBranchInwardForm.reset(); 
 this.Isreadonly=false;
 this._message="";
 this.IsreadonlyFileno=false; 

}

OnClose()
{
  this.modalService.hide(1);
}

OnreadonlyAppc()
{
  if(this.AddFileInwardForm.value.appl <=0) {
    // this.ShowErrormessage("Select appl value");
    // return false;    
      this.Isreadonly=false;
   }
   else{
    this.Isreadonly=true;
   }

}
onSubmit() {
  this.submitted = true;
  if(!this.validation())
  {
      return;
  }  

  this.AddFileInwardForm.patchValue({
    file_status: "File Received", 
    
  })
    const apiUrl = this._global.baseAPIUrl + "BranchInward/AddEditAppacdetailsAck";
    this._onlineExamService
      .postData(this.AddFileInwardForm.value, apiUrl)
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
this.GetBatchDetails();
 
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

 
   if(this.AddFileInwardForm.value.apac <=0) {
    this.ShowErrormessage("Enter Apac No");
    return false;
   }
   if(this.AddFileInwardForm.value.appl <=0) {
    this.ShowErrormessage("Select appl value");
    return false;
   }

   if(this.AddFileInwardForm.value.BatchNo =="" || this.AddFileInwardForm.value.BatchNo ==null) {
    //alert(this.AddBranchInwardForm.value.apac);
    
        this.ShowErrormessage("Enter Batch No value");
        return false;
       } 
      
   if(this.AddFileInwardForm.value.apac =="" || this.AddFileInwardForm.value.apac ==null) {
//alert(this.AddBranchInwardForm.value.apac);

    this.ShowErrormessage("Enter Apac value");
    return false;
   }     
   if(this.AddFileInwardForm.value.File_No =="" || this.AddFileInwardForm.value.File_No ==null) {
    //alert(this.AddBranchInwardForm.value.apac);
    
        this.ShowErrormessage("Enter File No");
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

  DeleteFile(Row: any) {
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
          this.AddFileInwardForm.patchValue({
            apac: Row.apac,
            appl: Row.appl,
            BatchNo: Row.BatchNo,
            User_Token: localStorage.getItem('User_Token'), 
          });

          const that = this;
          const apiUrl = this._global.baseAPIUrl + 'BranchInward/Delete';
          this._onlineExamService.postData(this.AddFileInwardForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Record has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.GetBatchDetails();
            //  that.getSearchResult(that.AddBranchInwardForm.get('TemplateID').value);
            });

        }
      });
   
  }

  NotReceived()
  {
    if(!this.validation())
    {
        return;
    }  

    this.AddFileInwardForm.patchValue({
      file_status: "File Not Received",
    })

    const apiUrl = this._global.baseAPIUrl + "BranchInward/AddEditAppacdetailsAck";
    this._onlineExamService
      .postData(this.AddFileInwardForm.value, apiUrl)
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
this.GetBatchDetails();
 
      });
    
  }

}

