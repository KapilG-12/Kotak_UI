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
  selector: "app-out-report",
  templateUrl: "out-report.component.html",
})
export class OutreportComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  OutReportForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
  _IndexPendingList:any;  
  _ColNameList = ["lanno","file_barcode","property_barcode","request_no","request_type","request_reason","request_date","ack_date","file_status","status","file_barcode_status"];
  
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  first = 0;
  rows = 10;

  constructor(

    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,

  ) {}
  ngOnInit() {
    this.OutReportForm = this.formBuilder.group({
      ToDate:[],
      FromDate:[],
      status:[0],
      User_Token:  localStorage.getItem('User_Token') ,  
      CreatedBy: localStorage.getItem('UserID') ,      
    });

    this.getoutreport();
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
                { field: 'lanno', header: 'LAN NO', index: 3 },
                { field: 'request_no', header: 'REQ NO', index: 3},
                { field: 'request_type', header: 'REQ TYPE', index: 3 },
                { field: 'request_reason', header: 'REQ REASON', index: 3 },
                { field: 'branch_code', header: 'BRANCH CODE', index: 4},
                { field: 'branch_name', header: 'BRANCH NAME', index: 4},
                { field: 'product_type', header: 'PRODUCT TYPE', index: 4},
                { field: 'file_barcode', header: 'FILE BARCODE', index: 2 },
                { field: 'property_barcode', header: 'PROPERTY BARCODE', index: 2 },
                
                { field: 'request_date', header: 'REQ DATE', index: 3}, 
                { field: 'file_status', header: 'FILE STATUS', index: 3},  
                { field: 'status', header: 'STATUS', index: 3 },
                { field: 'file_barcode_status', header: 'FB STATUS', index: 3 },

  ];
 //console.log("Tablelog",tableData);
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'lanno': el.lanno,

      'request_no': el.request_no,

      'file_barcode_status': el.file_barcode_status,
      'request_type': el.request_type,
      'request_reason': el.request_reason,
      'status': el.status,
      'request_by': el.request_by,
      'request_date': el.request_date,
      'file_status': el.file_status, 
      'branch_code': el.branch_code,    
      'branch_name': el.branch_name,
      'product_type': el.product_type ,
      'ack_date': el.ack_date ,
      'file_barcode': el.file_barcode,
      'property_barcode': el.property_barcode
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

  getoutreport() {  

    const apiUrl = this._global.baseAPIUrl + 'Retrival/Getoutreport';          
    this._onlineExamService.postData(this.OutReportForm.value,apiUrl)

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
    dwldLink.setAttribute("download",  "Retrieval Report" + ".csv"); 
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
    this.OutReportForm.reset();
  }
  isValid() {
    return this.OutReportForm.valid 
  } 
}

