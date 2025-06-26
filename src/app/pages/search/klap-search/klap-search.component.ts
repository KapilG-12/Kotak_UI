import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-klap-search',
  templateUrl: './klap-search.component.html',
  styleUrls: ['./klap-search.component.scss']
})
export class KlapSearchComponent implements OnInit {

  
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  // SelectionType = SelectionType;
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
  
    this.GetFileDetailsKlap();
  }
 
  GetFileDetailsKlap() {     
    
    var FileNo= localStorage.getItem('file_no');;
   
   
         // localStorage.getItem('file_no');
     console.log("fileNo",FileNo)
   
    const apiUrl = this._global.baseAPIUrl + 'Klap/getKlapSearch?USERId='+localStorage.getItem('UserID')+'&file_no='+FileNo+'&user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  
    this._FilteredList = data ;
    this.prepareTableData(data, data); 
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
                { field: 'File_No', header: 'FILE NO', index: 2 },   
                 { field: 'documents', header: 'DOCUMENT', index: 3 },     
                { field: 'copy_type', header: 'COPY TYPE', index: 5},
                { field: 'query_status', header: 'QUERY STATUS', index: 6 },
                { field: 'highlight_to_branch', header: 'HIGHLIGHT TO BRANCH', index: 7 },
                { field: 'cpu_query_remark', header: 'CPU QUERY REMARK', index: 8 },   
                { field: 'document_status', header: 'DOCUMENT STATUS', index: 8 },   
                { field: 'document_remark', header: 'DOCUMENT REMARK', index: 8 },   
                { field: 'status', header: 'STATUS', index: 8 },   
                { field: 'file_status', header: 'FILE STATUS', index: 8 },   
                { field: 'audit_date', header: 'AUDIT DATE', index: 8 }, 
                { field: 'audit_by', header: 'AUDIT BY', index: 8 },   
              ];
             
              tableData.forEach((el, index) => {
                formattedData.push({
                  'srNo': parseInt(index + 1),
                  'File_No': el.File_No,
                  'documents': el.documents, 
                  'copy_type': el.copy_type,
                  'query_status': el.query_status,
                  'highlight_to_branch': el.highlight_to_branch,  
                  'document_remark': el.document_remark,  
                  'cpu_query_remark': el.cpu_query_remark,  
                  'soft_copy_remark': el.soft_copy_remark,  
                  'physical_copy_remark': el.physical_copy_remark,  
                  'document_status': el.document_status,  
                  'document_Id': el.document_Id, 
                  'audit_date': el.audit_date, 
                  'audit_by': el.audit_by, 
                  'status': el.status, 
                  'file_status': el.file_status, 
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
   
  this.modalRef = this.modalService.show(template); 
  this.getKlapHistory(Row.File_No,Row.document_Id);
} 

getKlapHistory(File_No:any,document_Id:any ) {     
      
  const apiUrl = this._global.baseAPIUrl + 'Klap/getKlapHistory?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token') +'&file_no='+File_No+'&document_Id='+document_Id;
  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     

  this._FilteredListFile = data ;
  this.BindKLAPData(this._FilteredListFile, this._FilteredListFile);

  });
}
 
BindKLAPData(tableData, headerList) {
  let formattedFileData = [];
  let tableHeader: any = [
   
    { field: 'srNo', header: "SR NO", index: 1 },
   { field: 'File_No', header: 'FILE NO', index: 2 },   
   { field: 'documents', header: 'DOCUMENT', index: 3 },     
   { field: 'copy_type', header: 'COPY TYPE', index: 5},
   { field: 'query_status', header: 'QUERY STATUS', index: 6 },
   { field: 'highlight_to_branch', header: 'HIGHLIGHT TO BRANCH', index: 7 },
   { field: 'cpu_query_remark', header: 'CPU QUERY REMARK', index: 8 },
   { field: 'document_status', header: 'DOCUMENT STATUS', index: 8 },    
   { field: 'document_remark', header: 'DOCUMENT REMARK', index: 8 },   
  //  { field: 'status', header: 'STATUS', index: 8 },   
  //  { field: 'file_status', header: 'FILE STATUS', index: 8 },   
   { field: 'audit_date', header: 'AUDIT DATE', index: 8 }, 
   { field: 'audit_by', header: 'AUDIT BY', index: 8 },
  //  { field: 'entry_by', header: 'UPLOAD BY', index: 5 },
  //  { field: 'entry_date', header: 'UPLOAD DATE', index: 5 },
  //  { field: 'updated_by', header: 'MODIFY BY', index: 5 },
  //  { field: 'updated_date', header: 'MODIFY DATE', index: 5 },
 
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

      'documents': el.documents, 
      'copy_type': el.copy_type,  
      'query_status': el.query_status,    
      'highlight_to_branch': el.highlight_to_branch,  
      'cpu_query_remark': el.cpu_query_remark, 
      'document_remark': el.document_remark,  
      'audit_date': el.audit_date,    
      'audit_by': el.audit_by,  
      'document_status': el.document_status,  
    });
   
  });
  this.headerListFile = tableHeader;
  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
  this.formattedFileData = formattedFileData;
  this.loading = false;
}

QuickSearchPage(){
  this.router.navigateByUrl('/search/quick-search');
}


}
