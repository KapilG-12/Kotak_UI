import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import noUiSlider from "nouislider";
import Dropzone from "dropzone";
Dropzone.autoDiscover = false;

import Selectr from "mobius1-selectr";

import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-dump-report",
  templateUrl: "dump-report.component.html",
})
export class DumpreportComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  DumpReportForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
  _IndexPendingList:any;

// _ColNameList = ["lanno","pod_number","request_no","file_barcode","property_barcode","branch_code","branch_name","ref_request_no","product_type","request_type","request_reason","request_by","request_email","courier_name","request_date","ack_date","pod_entry_date","ref_entry_date","ref_ack_date","file_status","status","file_barcode_status","dispatch_address"];
  
_ColNameList = ["batch_no","appl_apac", "product","location","sub_lcoation","party_name","File_No","document_type","pod_no","new_pod_no","file_status","status","pod_dispatch_date","pod_ack_date"];
 
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  first = 0;
  rows = 10;
minToDate: any;

  constructor(

    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,

  ) {}
  ngOnInit() {
    this.DumpReportForm = this.formBuilder.group({
      ToDate:[],
      FromDate:[],
      report_type:[0,Validators.required],
      User_Token:  localStorage.getItem('User_Token') ,  
      userid: localStorage.getItem('UserID') ,      
    });

    this.getdumpsearch();

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
    { field: 'sub_lcoation', header: 'SUB LOCATION', index: 4},
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

getdumpsearch() {  
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetDumpReport';          
    this._onlineExamService.postData(this.DumpReportForm.value,apiUrl)
    // .pipe(first())

    .subscribe( data => {      
      this._StatusList = data;          
      this._FilteredList = data;      
      this.prepareTableData( this._StatusList,  this._FilteredList);
    
  });

  } 

  onDownload()
  {
    this.downloadFile();
  }

  GetHeaderNames()
  {
    this._HeaderList="";
    for (let j = 0; j < this._ColNameList.length; j++) {  
         
        this._HeaderList += this._ColNameList[j] +((j <= this._ColNameList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
    }
    this._HeaderList += '\n'
    this._StatusList.forEach(stat => {
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
 //   console.log(csvData) 
    if(this._StatusList.length>0) {
    let blob = new Blob(['\ufeff' +  csvData], { 
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
    dwldLink.setAttribute("download",  "Dump Report" + ".csv"); 
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
  OnReset() {
    this.Reset = true;
    this.DumpReportForm.reset();
  }
  isValid() {
    return this.DumpReportForm.valid 
  } 
}

