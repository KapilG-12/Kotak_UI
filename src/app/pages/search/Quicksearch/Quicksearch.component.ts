import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
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
  selector: "app-Quicksearch",
  templateUrl: "Quicksearch.component.html",
  styleUrls : ["Quicksearch.component.css"]
})
export class QuicksearchComponent implements OnInit {


  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  _IndexListFile:any;
  _FilteredListFile:any;
  modalRef: BsModalRef;
  isReadonly = true;
  DispatchList: any;
  _FilteredList: any;
  _HeaderList:any;

  first:any=0;
  rows:any=0
  
  //_ColNameList:any;
  _IndexList:any;
    
  ContentSearchForm: FormGroup;

  submitted = false;

  Reset = false;
  sMsg: string = '';
  
  _IndexPendingList:any;
  bsValue = new Date();

  _ColNameList = ["batch_no","appl_apac", "product","location","sub_lcoation","party_name","File_No","document_type","pod_no","new_pod_no","file_status","status","pod_dispatch_date","pod_ack_date"];
  
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private route: ActivatedRoute,
    private router: Router,
  ){}
  ngOnInit(){
    document.body.classList.add('data-entry');
    this.ContentSearchForm = this.formBuilder.group({
      SearchBy: ["0", Validators.required],
      File_No: ['', Validators.required],    
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      
    });
  
    this.GetDumpdata();
    this.ContentSearchForm.controls['SearchBy'].setValue("0"); 
    
  }

  GetDumpdata() {     
    
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetDumpdataSearch?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    this._IndexPendingList = data;
    this._FilteredList = data;
  // this._ColNameList = data;
    this.prepareTableData(this._FilteredList, this._IndexPendingList); 
    });
  } 
    GetFilterSearch() {     
      console.log("this.ContentSearchForm.get('File_No').value",this.ContentSearchForm.get('File_No').value)
      const apiUrl = this._global.baseAPIUrl + 'BranchInward/SearchRecordsByFilter?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token') +'&FileNo='+this.ContentSearchForm.get('File_No').value+'&SearchBy='+this.ContentSearchForm.get('SearchBy').value;
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._IndexPendingList = data;
      this._FilteredList = data;
    
      this.prepareTableData(this._FilteredList, this._IndexPendingList);

      });
    }
  

    OnReset()
    {
    this.Reset = true;
  
    
    this.isReadonly = false;
    
    }
  
    hidepopup()
{

  this.modalRef.hide();
  
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
  
    selectedEntries = [];
    allSelected = false;
    selectRow(e, fileNo) {
      if(e.target.checked) {
        this.selectedEntries.push(fileNo);
      } else {
        this.selectedEntries.splice(this.selectedEntries.indexOf(fileNo), 1);
      }

      // check if all rows are individually selected
      if(this._FilteredList.length === this.selectedEntries.length) {
        setTimeout(() => {
          this.allSelected = true;
        }, 100);
      } else {
        setTimeout(() => {
          this.allSelected = false;
        }, 100);
      }
      console.log(this.selectedEntries);
    }

    selectAll(e) {
      console.log('All files selected');
      if(e.target.checked) {
        this._FilteredList.forEach(element => {
          this.selectedEntries.push(element.FileNo);
        });
      } else {
        this.selectedEntries = [];
      }
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
                { field: 'srNo', header: "SR NO", index: 1 },
                { field: 'batch_no', header: 'BATCH NO', index: 3 },
                { field: 'appl_apac', header: 'APPL APAC', index: 3},
                { field: 'File_No', header: 'FILE NO', index: 3 },
                { field: 'document_type', header: 'DOC TYPE', index: 2 },
                { field: 'product', header: 'PRODUCT', index: 3 },
                { field: 'location', header: 'LOCATION', index: 3 },
                { field: 'sub_lcoation', header: 'SUB LCOATION', index: 4},
                { field: 'party_name', header: 'PARTY NAME', index: 4},
                // { field: 'product_type', header: 'PRODUCT TYPE', index: 4},
                // { field: 'courier_name', header: 'COURIER NAME', index: 2 },
              
                { field: 'pod_no', header: 'POD NO', index: 2 },
                { field: 'new_pod_no', header: 'NEW POD NO', index: 3 },
                { field: 'status', header: 'STATUS', index: 3},
                { field: 'file_status', header: 'FILE STATUS', index: 3},  
                // { field: 'status', header: 'STATUS', index: 3 },
                { field: 'pod_dispatch_date', header: 'DISPATCH DATE', index: 3 },
                { field: 'pod_ack_date', header: 'ACK DATE', index: 3 },  
                
               
            ];
         
            tableData.forEach((el, index) => {
              formattedData.push({
                'srNo': parseInt(index + 1),
                'batch_no': el.batch_no,
                'appl_apac': el.appl_apac,
                'product': el.product,
                'location': el.location,
                'sub_lcoation': el.sub_lcoation,
                'party_name': el.party_name,
                'File_No': el.File_No,
                'document_type': el.document_type,
                'pod_no': el.pod_no,
                'new_pod_no': el.new_pod_no,
                'pod_dispatch_date': el.pod_dispatch_date,
                'file_status': el.file_status,
                'Courier_id': el.Courier_id,
                'status': el.status,  
                'pod_ack_date': el.pod_ack_date,  
              
     
              });
            
            });
            this.headerList = tableHeader;
            this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
            this.formattedData = formattedData;
            this.loading = false;
            

        //    console.log(this.formattedData);

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


          
GetHeaderNames()
{
  this._HeaderList="";
  for (let j = 0; j < this._ColNameList.length; j++) {  
       
      this._HeaderList += this._ColNameList[j] +((j <= this._ColNameList.length-2)?',':'') ;
    // headerArray.push(headers[j]);  
  }
  this._HeaderList += '\n'
  this._FilteredList.forEach(stat => {
    for (let j = 0; j < this._ColNameList.length; j++) {  
      this._HeaderList += (stat[this._ColNameList[j]]) + ((j <= this._ColNameList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
    }
    this._HeaderList += '\n'
  });
  

}

downloadFile() { 
  this.GetHeaderNames()
  let csvData = this._HeaderList;     
  var csvDatas = csvData.replace("null", ""); 

 // console.log(csvData) 
  if(this._FilteredList.length>0) {
  let blob = new Blob(['\ufeff' +  csvDatas], { 
      type: 'text/csv;charset=utf-8;'
  }); 
  let dwldLink = document.createElement("a"); 
  let url = URL.createObjectURL(blob); 
  let isSafariBrowser =-1;
  // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
  // navigator.userAgent.indexOf('Chrome') == -1; 
  
  //if Safari open in new window to save file with random filename. 
  if (isSafariBrowser) {  
      dwldLink.setAttribute("target", "_blank"); 
  } 
  dwldLink.setAttribute("href", url); 
  dwldLink.setAttribute("download",  "dump_data" + ".csv"); 
  dwldLink.style.visibility = "hidden"; 
  document.body.appendChild(dwldLink); 
  dwldLink.click(); 
  document.body.removeChild(dwldLink); 
} else {
  this.toastr.show(
    '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">There should be some data before you download!</span></div>',
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
}

ViewRepayement(template: TemplateRef<any> ,Row: any) {
  if (Row.document_type=='Repayment' || Row.document_type=='Repayment Insert')
  { 
  this.modalRef = this.modalService.show(template); 
  this.getRepayementData(Row.File_No);
  }
} 

closmodel()
{

  this.modalRef.hide();
}

formattedFileData: any = [];
headerListFile: any;
immutableFormattedDataFile: any;
//loading: boolean = true;

//  Repayement Code here 

getRepayementData(File_No:any) {     
    
const apiUrl = this._global.baseAPIUrl + 'BranchInward/SearchRecordsRepayement?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token') +'&FileNo='+File_No;
this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     

this._IndexListFile = data;
this._FilteredListFile = data ;

this.BingRepayementData(this._FilteredListFile, this._IndexListFile);

});
}

BingRepayementData(tableData, headerList) {
let formattedFileData = [];
let tableHeader: any = [
  { field: 'srNo', header: "SR NO", index: 1 },
  { field: 'File_No', header: 'FILE NO', index: 2 },
  //  { field: 'pod_no', header: 'POD NO', index: 3 },
   { field: 'repayment', header: 'ACTIVITY', index: 4 },
   { field: 'remark', header: 'REMARK', index: 5 },
   { field: 'entry_by', header: 'UPLOAD BY', index: 5 },
   { field: 'entry_date', header: 'UPLOAD DATE', index: 5 },
   { field: 'updated_by', header: 'MODIFY BY', index: 5 },
   { field: 'updated_date', header: 'MODIFY DATE', index: 5 },

];

tableData.forEach((el, index) => {
  formattedFileData.push({
    'srNo': parseInt(index + 1),
    'File_No': el.File_No,    
   'entry_by': el.entry_by,  
    'repayment': el.repayment,   
     'remark': el.remark, 
       'entry_date': el.entry_date,  
     'updated_by': el.updated_by,    
     'updated_date': el.updated_date,    

  });
 
});
this.headerListFile = tableHeader;
this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
this.formattedFileData = formattedFileData;
this.loading = false;
}

//  Docket Code here 
ViewDocket(template: TemplateRef<any> ,Row: any) {
 
if (Row.document_type=='Docket' || Row.document_type=='Docket Insert')
{
    this.modalRef = this.modalService.show(template); 
    this.getDocketData(Row.File_No);
}
} 

getDocketData(File_No:any) {     
    
const apiUrl = this._global.baseAPIUrl + 'BranchInward/SearchRecordsDocket?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token') +'&FileNo='+File_No;
this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     

this._IndexListFile = data;
this._FilteredListFile = data ;

this.BingDocketData(this._FilteredListFile, this._IndexListFile);

});
}

BingDocketData(tableData, headerList) {
let formattedFileData = [];
let tableHeader: any = [
  { field: 'srNo', header: "SR NO", index: 1 },
  { field: 'File_No', header: 'FILE NO', index: 2 },
  //  { field: 'pod_no', header: 'POD NO', index: 3 },
   { field: 'status', header: 'ACTIVITY', index: 4 },
   { field: 'remark', header: 'REMARK', index: 5 },
   { field: 'entry_by', header: 'UPLOAD BY', index: 5 },
   { field: 'entry_date', header: 'UPLOAD DATE', index: 5 },
   { field: 'updated_by', header: 'MODIFY BY', index: 5 },
   { field: 'updated_date', header: 'MODIFY DATE', index: 5 },

];

tableData.forEach((el, index) => {
  formattedFileData.push({
    'srNo': parseInt(index + 1),
    'File_No': el.File_No,    
   'entry_by': el.entry_by,  
    'status': el.status,   
     'remark': el.remark, 
       'entry_date': el.entry_date,  
     'updated_by': el.updated_by,    
     'updated_date': el.updated_date,    

  });
 
});
this.headerListFile = tableHeader;
this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
this.formattedFileData = formattedFileData;
this.loading = false;
}

//  NACh Code here 
ViewNACH(template: TemplateRef<any> ,Row: any) {
 
// if (Row.document_type=='Docket' || Row.document_type=='Docket Insert')
// {
//     this.modalRef = this.modalService.show(template); 
//     this.getDocketData(Row.File_No);
// }
this.modalRef = this.modalService.show(template); 
this.getNACHData(Row.File_No);
} 

getNACHData(File_No:any) {     
    
const apiUrl = this._global.baseAPIUrl + 'BranchInward/SearchRecordsNACh?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token') +'&FileNo='+File_No;
this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     

this._IndexListFile = data;
this._FilteredListFile = data;

this.BingNACHData(this._FilteredListFile, this._IndexListFile);

});
}

BingNACHData(tableData, headerList) {
let formattedFileData = [];
let tableHeader: any = [
  { field: 'srNo', header: "SR NO", index: 1 },
  { field: 'File_No', header: 'FILE NO', index: 2 },
  //{ field: 'pod_no', header: 'POD NO', index: 3 },
   { field: 'status', header: 'ACTIVITY', index: 4 },
   { field: 'remark', header: 'REMARK', index: 5 },
   { field: 'entry_by', header: 'UPLOAD BY', index: 5 },
   { field: 'entry_date', header: 'UPLOAD DATE', index: 5 },
   { field: 'updated_by', header: 'MODIFY BY', index: 5 },
   { field: 'updated_date', header: 'MODIFY DATE', index: 5 },

];

tableData.forEach((el, index) => {
  formattedFileData.push({
    'srNo': parseInt(index + 1),
    'File_No': el.File_No,    
   'entry_by': el.entry_by,  
    'status': el.status,   
     'remark': el.remark, 
       'entry_date': el.entry_date,  
     'updated_by': el.updated_by,    
     'updated_date': el.updated_date,    

  });
 
});
this.headerListFile = tableHeader;
this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
this.formattedFileData = formattedFileData;
this.loading = false;
}
viewKlapDocumentList(row:any){

  if (row.document_type==='Original KLAP' || row.document_type=='Original KLAP Insert')
{
  
  console.log('rowinsisde',row.File_No)
  localStorage.setItem("file_no",row.File_No);
  this.router.navigate(['/search/Klap-search']);
  //"PD00034578"
  //  setTimeout(()=>{
   
  // },1000)
}
}


  
}
