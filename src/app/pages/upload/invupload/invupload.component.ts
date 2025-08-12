import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, EventEmitter,Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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
  selector: "app-invupload",
  templateUrl: "invupload.component.html",
})
export class InvuploadComponent implements OnInit {
entries: number = 10;
selected: any[] = [];
temp = [];
activeRow: any;
SelectionType = SelectionType;
modalRef: BsModalRef;
_SingleDepartment: any;
submitted = false;
Reset = false;     
sMsg: string = '';      
_FilteredList = []; 
_StatusList:any;
_IndexList:any;
_Records :any; 
DataUploadForm: FormGroup;

public message: string;
_HeaderList: any;
_HeaderColList:any;
_ColNameList = [];
_CSVData: any;
public records: any[] = [];
papa: any;
_TempID: any = 0;

myFiles:string [] = [];
_FileDetails:string [][] = [];
first = 0;
rows = 10;

_ColList = ["PODNo", "AccountNo","CartonNo","FileNo"];
   

@Output() public onUploadFinished = new EventEmitter();
  constructor(
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
  ) {}
  ngOnInit() {
    this.DataUploadForm = this.formBuilder.group({     
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0],     
       CSVData:[""]
    });     
this.prepareTableData(this._FilteredList,this._FilteredList);
  }
   

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    let val = $event.target.value;
    let that = this
    this._FilteredList = this.records.filter(function (d) {
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  OnReset() {   
    
  }
  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    
    if(this.DataUploadForm.valid && files.length>0) {
      var file = files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        var csv = event.target.result; // Content of CSV file
        this.papa.parse(csv, {
          skipEmptyLines: true,
          header: true,
          complete: (results) => {
            for (let i = 0; i < results.data.length; i++) {
              let orderDetails = {
                order_id: results.data[i].Address,
                age: results.data[i].Age
              };
              this._Records.push(orderDetails);
            }
          }
        });
      }
    } else {
      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select <br> <b>Csv File</b><br><b>Template</b><br> before uploading!</span></div>',
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

  uploadListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      $(".selected-file-name").html(input.files[0].name);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this._CSVData = csvRecordsArray;
        this._IndexList = csvRecordsArray;

        // alert(headersRow);
        // alert(this._ColNameList);
        //let ColName = 
        let validFile = this.getDisplayNames(csvRecordsArray);
        if (validFile == false) {
          this.fileReset();
        } else {
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
       
          this._FilteredList = this.records;


          this.prepareTableDataForCSV(this._FilteredList);         

          (<HTMLInputElement>document.getElementById('csvReader')).value = '';
        }
  

      };

      reader.onerror = function () {
      };

    } else {
      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select A Valid CSV File And Template</span></div>',
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
      this.fileReset();
    }
    this._FilteredList = this.records
  }

  checkDateFormat(date) {

    if (date !="")
    {
    let dateArr = date.split('-');
    const dateString = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
    if(isNaN(dateArr[0]) || isNaN(dateArr[1]) || isNaN(dateArr[2])) {
      return false;
    }
    if(isNaN(new Date(dateString).getTime())) {
      return false;
    }
    return true;
  }
  else
  {
    return true;
  }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        const single = []
        for (let i = 0; i < this._ColNameList.length; i++) {
          single.push(curruntRecord[i].toString().trim())
        }
        csvArr.push(single)
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    var  headers;
   // headers ="NewCBSAccountNo,ApplicationNo,CBSCUSTIC,Team,HandliedBy,ProductCode,Product,ProductDescription,JCCode,JCName,Zone,CustomerName,DBDate,FinalRemarks,DisbursedMonth";
   headers =['PODNo','AccountNo','CartonNo','FileNo'];
 
   // let headerArray = [];
    // for (let j = 0; j < headers.length; j++) {
    //   headerArray.push(headers[j]);
    // }

    return headers;


  }

  fileReset() {
    //this.csvReader.nativeElement.value = "";  
    this.records = [];
  }

  onSubmit() {

        this.submitted = true;      
  
 if(this._CSVData != null && this._CSVData != undefined)
 {

    this.DataUploadForm.patchValue({
      id: localStorage.getItem('UserID'),
      CSVData: this._CSVData,     
      User_Token: localStorage.getItem('User_Token')   

    });    

    const apiUrl = this._global.baseAPIUrl + 'DataUpload/Invupload';
    this._onlineExamService.postData(this.DataUploadForm.value, apiUrl)
      // .pipe(first())
      .subscribe(data => {
        
      // alert(data);
        this.showSuccessmessage(data); 
        this.BindHeader(this._FilteredList,this._FilteredList);

      });

    //  }     
    }
    else
    {
      this.showmessage("please select file"); 

    }
  }

  ShowErrormessage(data:any)
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
 

  getDisplayNames(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
 
 
    if (headers.length != 4) {
     // alert('Invalid No. of Column Expected :- ' + this._ColNameList.length);
     var msg= 'Invalid No. of Column Expected :- ' + this._ColNameList.length; 
     //this.showmessage(msg);
     this.ShowErrormessage(msg);

      return false;
    }
   // this._HeaderList ="POD No,Invoice Details,Invoice No,Invoice Date,Vendor Name,Barcode No";
    //'PODNo','AppNo','CartonNo','FileNo','Status'
   this._ColNameList[0] ="PODNo";
   this._ColNameList[1] ="AccountNo"; 
   this._ColNameList[2] ="CartonNo";
   this._ColNameList[3] ="FileNo"; 
  //  this._ColNameList[4] ="Status";
   

    return true;
  }


  GetHeaderNames() {
  //  this._HeaderList = "";
    this._HeaderList ="PODNo,AccountNo,CartonNo,FileNo";
  }

  downloadFile() {
    const filename = 'INVUpload_CSVFileUpload';
     
    let csvData = "PODNo,AccountNo,CartonNo,FileNo";    
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = -1;
    // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
    // navigator.userAgent.indexOf('Chrome') == -1; 

    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  
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
          "ngx-toastr alert alert-dismissible alert-success alert-notify"
      }
    );


  }

  showSuccessmessage(data:any)
  {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title"> </span> <span data-notify="message"> '+ data +' </span></div>',
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

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;


 // PODNo,AppNo,CartonNo,FileNo,Status

  prepareTableDataForCSV(tableData) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'PODNo', header: "PODNo", index: 1 }, 
      { field: 'AccountNo', header: 'ACCOUNT NO', index: 2 },

      { field: 'CartonNo', header: "CartonNo", index: 1 }, 
      { field: 'FileNo', header: 'FileNo', index: 2 },
      // { field: 'Status', header: "Status", index: 1 }, 
      
    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'PODNo': el[0],   
        'AccountNo': el[1],
        'CartonNo': el[2],   
        'FileNo': el[3],
        // 'Status': el[4],          
      
      });
   
    });
    this.headerList = tableHeader;
  //}
  
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  
  }

  prepareTableData(tableData, headerList) {
    let formattedData = [];
   // alert(this.type);
  
  // if (this.type=="Checker" )
  //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'PODNo', header: "PODNo", index: 1 }, 
      { field: 'AccountNo', header: 'ACCOUNT NO', index: 2 },

      { field: 'CartonNo', header: "CartonNo", index: 1 }, 
      { field: 'FileNo', header: 'FileNo', index: 2 },
      // { field: 'Status', header: "Status", index: 1 }, 
      
      // { field: 'PropertyBarcode', header: 'PROPERTY BARCODE', index: 2 },
    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'PODNo': el.PODNo,
        'AccountNo': el.AccountNo,
        'CartonNo': el.CartonNo,
        'FileNo': el.FileNo,
      
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
      { field: 'PODNo', header: "PODNo", index: 1 }, 
      { field: 'AccountNo', header: 'ACCOUNT NO', index: 2 },

      { field: 'CartonNo', header: "CartonNo", index: 1 }, 
      { field: 'FileNo', header: 'FileNo', index: 2 },
    ];
   
    
    this.headerList = tableHeader;
  //}
  
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  
  }
  
  
  searchTable($event) {
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

  
paginate(e) {
this.first = e.first;
this.rows = e.rows;
}
 

GetPendingData() {  
    const apiUrl = this._global.baseAPIUrl + 'Inward/GetPendingINVData';          
    this._onlineExamService.postData(this.DataUploadForm.value,apiUrl)
    .subscribe( data => {
      this._StatusList = data;
      this.downloadPendingData();
  });
  }
  
  downloadPendingData() { 
    this.GetColList()
    let csvData = this._HeaderColList;     
    if(this._StatusList.length>0) {
    let blob = new Blob(['\ufeff' +  csvData], { 
        type: 'text/csv;charset=utf-8;'
    }); 
    let dwldLink = document.createElement("a"); 
    let url = URL.createObjectURL(blob); 
    let isSafariBrowser =-1;
    if (isSafariBrowser) {  
        dwldLink.setAttribute("target", "_blank"); 
    } 
    dwldLink.setAttribute("href", url); 
    dwldLink.setAttribute("download",  "INV_PendingData" + ".csv"); 
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

  GetColList()
  {
    this._HeaderColList="";
    for (let j = 0; j < this._ColList.length; j++) {  
         
        this._HeaderColList += this._ColList[j] +((j <= this._ColList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
    }


    this._HeaderColList += '\n'
    this._StatusList.forEach(stat => {
      for (let j = 0; j < this._ColList.length; j++) {  
        this._HeaderColList += (stat[this._ColList[j]]) + ((j <= this._ColList.length-2)?',':'') ;
        // headerArray.push(headers[j]);  
      }
      this._HeaderColList += '\n'
    });
      
  }

 
}
