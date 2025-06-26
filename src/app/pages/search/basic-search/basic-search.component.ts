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
  selector: "app-basic-search",
  templateUrl: "basic-search.component.html",
  styleUrls : ["basic-search.component.css"]
})
export class BasicsearchComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  isReadonly = true;
  
  DispatchList: any;
  _FilteredList: any;
  _HeaderList:any;

  first:any=0;
  rows:any=0
  
  //_ColNameList:any;
  _IndexList:any;
   
  PODForm: FormGroup;
  ContentSearchForm: FormGroup;
  submitted = false;
 
  Reset = false;
  sMsg: string = '';
   
  _IndexPendingList:any;
  bsValue = new Date();

  _ColNameList = ["lanno","pod_number", "request_no","request_type","request_reason","product_type","courier_name","request_date","file_status","status","file_barcode_status"];
   
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
      FileNo: ['', Validators.required],    
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      
    });
    this.PODForm = this.formBuilder.group({
      pod_number:['', Validators.required],     
      Courier_id:['', Validators.required],
      request_no:['', Validators.required],
      lanno:['', Validators.required], 
      CourierName:['', Validators.required], 
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      
    });
  
    this.GetDumpdata();
    this.ContentSearchForm.controls['SearchBy'].setValue("0"); 
  }
 
  GetDumpdata() {     
     
    const apiUrl = this._global.baseAPIUrl + 'Retrival/Getbasicsearch?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    this._IndexPendingList = data;
    this._FilteredList = data;
   // this._ColNameList = data;
    this.prepareTableData(this._FilteredList, this._IndexPendingList);

  // console.log("IndexListPending",data);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
  
   
    GetFilterSearch() {     

      const apiUrl = this._global.baseAPIUrl + 'Retrival/BasicSearchRecordsByFilter?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token') +'&FileNo='+this.ContentSearchForm.get('FileNo').value+'&SearchBy='+this.ContentSearchForm.get('SearchBy').value;
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._IndexPendingList = data;
      this._FilteredList = data
    
      this.prepareTableData(this._FilteredList, this._IndexPendingList);

      });
    }

    OnReset()
    {
    this.Reset = true;
    this.PODForm.reset();
    
    this.isReadonly = false;
    
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
                { field: 'lanno', header: 'LAN NO', index: 3 },
                { field: 'request_no', header: 'REQ NO', index: 3},
                { field: 'request_type', header: 'REQ TYPE', index: 3 },
                { field: 'request_reason', header: 'REQ REASON', index: 3 },
                { field: 'branch_code', header: 'BRANCH CODE', index: 4},
                { field: 'branch_name', header: 'BRANCH NAME', index: 4},
                { field: 'product_type', header: 'PRODUCT TYPE', index: 4},
                { field: 'courier_name', header: 'COURIER NAME', index: 2 },
                { field: 'pod_number', header: 'POD No', index: 3 },
                { field: 'file_barcode', header: 'FILE BARCODE', index: 2 },
                { field: 'property_barcode', header: 'PROPERTY BARCODE', index: 2 },
                { field: 'request_date', header: 'REQ DATE', index: 3},
                { field: 'file_status', header: 'FILE STATUS', index: 3},  
                { field: 'status', header: 'STATUS', index: 3 },
                { field: 'file_barcode_status', header: 'FB STATUS', index: 3 },
                // { field: 'property_barcode_status', header: 'PB STATUS', index: 3 },  
                
                 
              ];
           
              tableData.forEach((el, index) => {
                formattedData.push({
                  'srNo': parseInt(index + 1),
                  'lanno': el.lanno,
                  'pod_number': el.pod_number,
                  'request_no': el.request_no,
                  'courier_name': el.courier_name,
                  'file_barcode_status': el.file_barcode_status,
                  'property_barcode_status': el.property_barcode_status,
                  'request_type': el.request_type,
                  'request_reason': el.request_reason,
                  'status': el.status,
                  'request_by': el.request_by,
                  'request_date': el.request_date,
                  'file_status': el.file_status,
                  'Courier_id': el.Courier_id,
                  'Attachment': el.Attachment,  
                  'file_path': el.file_path,  
                  'lc_filepath': el.lc_filepath,
                  'branch_code': el.branch_code,    
                  'branch_name': el.branch_name,
                  'product_type': el.product_type ,
                  'file_barcode': el.file_barcode,
                  'property_barcode': el.property_barcode   
       
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
    dwldLink.setAttribute("download",  "Searchrecords" + ".csv"); 
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

  ViewPODDetails(template: TemplateRef<any> ,Row: any) {
     
    this.PODForm.patchValue({     
      Courier_id:Row.Courier_id, 
      pod_number:Row.pod_number, 
      request_no:Row.request_no, 
      lanno:Row.lanno, 
      })
      
    this.modalRef = this.modalService.show(template); 
    
  } 
  
  onUpdate() {
  this.submitted = true;
  
  if(!this.validation()) {
    return;
  }
  
  
  const that = this;
  const apiUrl = this._global.baseAPIUrl + 'Retrival/UpdatePOD';
  this._onlineExamService.postData(this.PODForm.value,apiUrl)
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
  that.GetDumpdata();
  //this.OnReset();      
  });
  // }
  
  }

  validation()
  {

      if (this.PODForm.get('pod_number').value =="" )
      {
                this.showmessage("Please Enter POD No");
                return false;
      }
      if (this.PODForm.get('Courier_id').value <=0)
      {
                this.showmessage("Please select Courier Name");
                return false;
      }
     
      return true;

  } 

  closmodel()
  {

    this.modalRef.hide();
  }

  downloadLC(_File:any) {
 
  if (_File.request_reason !="Loan Closure")
  {
    return;
  } 

    if (_File.file_path ==null || _File.lc_filepath =="" || _File.lc_filepath.length ==0)
    {
      this.showmessage("LC Attachment not available");
      return;
    } 
    const fileExt = _File.lc_filepath.substring(_File.lc_filepath.lastIndexOf('.'), _File.lc_filepath.length);
    const apiUrl = this._global.baseAPIUrl + 'Retrival/DownlaodAttachment?ID='+localStorage.getItem('UserID')+'&file_path='+_File.lc_filepath+'&user_Token='+localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {
  
     //   console.log("res",res);
        saveAs(res,_File.request_no + fileExt);
      }
    });
    
  }
  
  downloadAttachment(_File:any) {
 

    if (_File.file_path ==null ||_File.Attachment =="" || _File.Attachment.length ==0)
    {
      this.showmessage("Mail attachment not available");
      return;
    } 
    const fileExt = _File.Attachment.substring(_File.Attachment.lastIndexOf('.'), _File.Attachment.length);
    const apiUrl = this._global.baseAPIUrl + 'Retrival/DownlaodAttachment?ID='+localStorage.getItem('UserID')+'&file_path='+_File.Attachment+'&user_Token='+localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {
  
     //   console.log("res",res);
        saveAs(res,_File.request_no+'_'+_File.lanno + fileExt);
      }
    });
    
  }
  
  downloadSoftCopy(_File:any) {
   
   if (_File.request_type !="Scan Copy")
   {
     return;
   } 

     if (_File.file_path ==null || _File.file_path =="" || _File.file_path.length ==0)
     {
      this.showmessage("Soft copy attachment not available");
       return;
     } 
     const fileExt = _File.file_path.substring(_File.file_path.lastIndexOf('.'), _File.file_path.length);
     const apiUrl = this._global.baseAPIUrl + 'Retrival/DownlaodAttachment?ID='+localStorage.getItem('UserID')+'&file_path='+_File.file_path+'&user_Token='+localStorage.getItem('User_Token');
     this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
       if (res) {
   
      //   console.log("res",res);
         saveAs(res,_File.request_no+'_'+_File.lanno + fileExt);
       }
     });
     
   }
  
}
