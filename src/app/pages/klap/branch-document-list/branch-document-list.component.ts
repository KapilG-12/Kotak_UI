import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";





export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-branch-document-list',
  templateUrl: './branch-document-list.component.html',
  styleUrls: ['./branch-document-list.component.scss']
})
export class BranchDocumentListComponent implements OnInit {



  entries: number = 10;
  selected: any[] = [];
  temp = [];
  physicalCopy: boolean;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  softCopy: boolean;
  _IndexList: any;
  headerListFile: any;
  headerListPC: any;
  UserID: any;
  PODEntryForm: FormGroup;
  STAEntryForm: FormGroup;
  AddKlapAuditForm: FormGroup;
  STASoftCopyEntryForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = '';
  _FileNo: any = "";
  first: any = 0;
  rows: any = 0;
  _IndexPendingListFile: any;
  _FilteredListFile: any;
  _SCopyList: any;
  _SCFilteredList: any;
  _FileList: any;
  _FilteredList: any;
  _IndexPendingList: any;
  bsValue = new Date();
  enableValue = 0;
  PhysicalEnableValue =0
  DisabledEnableValue = 0
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router
  ) { }
  ngOnInit() {
    document.body.classList.add('data-entry');
    this.AddKlapAuditForm = this.formBuilder.group({
      id: [""],
      document_Id: [""],
      File_No: [""],
      apac: [""],
      appl: [""],
      product: [""],
      location: [""],
      sub_lcoation: [""],
      maln_party_id: [""],
      party_name: [""],
      pdc_type: [""],
      apac_effective_date: [""],
      agr_value: [""],
      status: [""],
      document_type: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID')
    });

    this.PODEntryForm = this.formBuilder.group({
      File_No: [""],
      pod_no: [""],
      courier_name: [0, ""],
      physical_copy_remark: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),

    });
    this.STAEntryForm = this.formBuilder.group({
      File_No: [""],
      document_Id: [""],
      send_physical_dcoument: [0, ""],
      branch_remark: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),

    });

    this.STASoftCopyEntryForm = this.formBuilder.group({
      File_No: [""],
      soft_copy_remark: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),

    });

    var FileNo = localStorage.getItem('file_no');
    //localStorage.removeItem("file_no");
    this.getAuditBranchPending(FileNo);
  }

  getAuditBranchPending(FileNo: any) {
    localStorage.setItem("file_no",FileNo);

    console.log("FileNo",FileNo);
    const apiUrl = this._global.baseAPIUrl + 'Klap/getAuditBranchPending?FileNo=' + FileNo + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._IndexPendingList = data;
      this._FilteredList = data;
      
      this.prepareTableData(this._FilteredList, this._IndexPendingList);

      this.AddKlapAuditForm.controls['File_No'].setValue(data[0]!.File_No);
      //this.AddKlapAuditForm.controls['apac'].setValue(data[0].apac);
      //this.AddKlapAuditForm.controls['party_name'].setValue(data[0].party_name);

      this.AddKlapAuditForm.controls['location'].setValue(data[0].location);
      this.AddKlapAuditForm.controls['sub_lcoation'].setValue(data[0].sub_lcoation);
      this.AddKlapAuditForm.controls['maln_party_id'].setValue(data[0].maln_party_id);
      this.AddKlapAuditForm.controls['party_name'].setValue(data[0].party_name);
      this.AddKlapAuditForm.controls['agr_value'].setValue(data[0].agr_value);
      this.AddKlapAuditForm.controls['pdc_type'].setValue(data[0].pdc_type);
      this.AddKlapAuditForm.controls['apac_effective_date'].setValue(data[0].apac_effective_date);
      this.AddKlapAuditForm.controls['apac'].setValue(data[0].apac);
      this.AddKlapAuditForm.controls['appl'].setValue(data[0].appl);
      this.AddKlapAuditForm.controls['document_type'].setValue(data[0].document_type);
      this.AddKlapAuditForm.controls['product'].setValue(data[0].product);

    });
  }

  formattedData: any = [];
  firstFormattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    let firstFormattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'File_No', header: 'FILE NO', index: 2 },
      { field: 'apac', header: 'APAC', index: 2 },
      { field: 'party_name', header: 'PARTY NAME', index: 2 },
      { field: 'documents', header: 'DOCUMENT', index: 3 },
      { field: 'copy_type', header: 'COPY TYPE', index: 3 },
      { field: 'query_status', header: 'QUERY STATUS', index: 3 },
      { field: 'highlight_to_branch', header: 'HIGHLIGHTED TO BRANCH', index: 3 },
      { field: 'cpu_query_remark', header: 'CPU QUERY REMARK', index: 8 },
      // { field: 'location', header: 'LOCATION', index: 4 }, 
       
      { field: 'document_status', header: 'DOCUMENT STATUS', index: 4 },
      // { field: 'send_physical_dcoument', header: 'DOCUMENT TYPE', index: 3 },
      // { field: 'send_to_auditor', header: 'SEND TO AUDITOR', index: 3 },
      { field: 'document_remark', header: 'BRANCH REMARK', index: 3 },
      { field: 'send_physical_dcoument', header: 'Document update', index: 4 }, 

    ];

    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'File_No': el.File_No,
        'copy_type': el.copy_type,
        'query_status': el.query_status,
        'status': el.status,
        'document_status': el.document_status,
        "apac": el.apac,
        "party_name": el.party_name,
        "location": el.location,
        "documents": el.documents,
        "sub_lcoation": el.sub_lcoation,
        "cpu_query_remark": el.cpu_query_remark,
        "highlight_to_branch": el.highlight_to_branch,
        "document_Id": el.document_Id,
        "send_to_auditor": el.send_to_auditor,
        "send_physical_dcoument": el.send_physical_dcoument,
        "document_remark": el.document_remark,  

      });

     
      if (el.send_physical_dcoument == "Soft Copy" && el.highlight_to_branch =="Yes" && el.document_status!=="") {
        // this.softCopy = true
        // console.log("soft",index);
        this.enableValue = 1 + this.enableValue
        console.log("this.enableValue",this.enableValue);
      }
   
      if (el.send_physical_dcoument == "Physical Copy" && el.highlight_to_branch =="Yes" && el.document_status!=="") {
        //this.physicalCopy = true
        this.PhysicalEnableValue = 1 + this.PhysicalEnableValue
        console.log("this.v",this.PhysicalEnableValue);
      }
      if(el.highlight_to_branch =="No"){
        this.DisabledEnableValue = 1 + this.DisabledEnableValue
        console.log("this.DisabledEnableValue",this.DisabledEnableValue);
      }
      console.log(this.enableValue +  this.PhysicalEnableValue +this.DisabledEnableValue,"this.enableValue +  this.PhysicalEnableValue +this.DisabledEnableValue")
      console.log(index,"index");

      if(this.enableValue +  this.PhysicalEnableValue +this.DisabledEnableValue == index+1){
        this.physicalCopy = true
        this.softCopy = true
        console.log(index,"index")
      }
      else{
        this.physicalCopy = false
        this.softCopy = false
      }



    });
    this.enableValue = 0
    this.PhysicalEnableValue = 0
    this.DisabledEnableValue = 0

    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;

  }

  searchTable($event) {
    // console.log($event.target.value);

    let val = $event.target.value;
    if (val == '') {
      this.formattedData = this.immutableFormattedData;
    } else {
      let filteredArr = [];
      const strArr = val.split(',');
      this.formattedData = this.immutableFormattedData.filter(function (d) {
        for (var key in d) {
          strArr.forEach(el => {
            if (d[key] && el !== '' && (d[key] + '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
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
    this.PODEntryForm.reset();

  }

  onSubmit() {
    this.submitted = true;

    if (!this.validation()) {
      return;
    }

    const that = this;
    const apiUrl = this._global.baseAPIUrl + 'Klap/UpdatePODEntry';
    this._onlineExamService.postData(this.PODEntryForm.value, apiUrl)
      // .pipe(first())
      .subscribe(data => {

        this.toastr.show(
          '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> ' + data + ' </span></div>',
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
        that.getAuditBranchPending(this.AddKlapAuditForm.get('File_No').value);
        //this.OnReset();      
      });
    // }

  }

  OnPODAdd(template: TemplateRef<any>) {
    var that = this;
    this.PODEntryForm.controls['pod_no'].setValue("");
    this.PODEntryForm.controls['courier_name'].setValue(0);
    this.PODEntryForm.controls['physical_copy_remark'].setValue("");
    this.PODEntryForm.controls['File_No'].setValue(this.AddKlapAuditForm.get('File_No').value);
    this.modalRef = this.modalService.show(template);
    this.getPhysicalFiledetails();

  }
  OnSoftCopyUdpate(template: TemplateRef<any>) {
    var that = this;
    this.STASoftCopyEntryForm.controls['File_No'].setValue("");
    this.STASoftCopyEntryForm.controls['soft_copy_remark'].setValue("");
    this.STASoftCopyEntryForm.controls['File_No'].setValue(this.AddKlapAuditForm.get('File_No').value);
    this.modalRef = this.modalService.show(template);

    this.getsoftcopydetails();
  }
  OnPhysicalUdpate(template: TemplateRef<any>) {
    var that = this;

    this.PODEntryForm.controls['File_No'].setValue(this.AddKlapAuditForm.get('File_No').value);
    this.modalRef = this.modalService.show(template);
    this.getPhysicalFiledetails();
  }

  OnSTAAdd(template: TemplateRef<any>, row: any) {
    var that = this;
    if (row.highlight_to_branch == "Yes" ) {
      this.STAEntryForm.controls['branch_remark'].setValue("");
      this.STAEntryForm.controls['File_No'].setValue(row.File_No);
      this.STAEntryForm.controls['document_Id'].setValue(row.document_Id);
      this.modalRef = this.modalService.show(template);
    }
    else {
      this.showmessage("Query is not highlight tobranch")
    }
  }
  // && row.file_status != "SEND TO AUDITOR"

  UdpateStatus() {

    const that = this;
    const apiUrl = this._global.baseAPIUrl + 'Klap/UdpateSendToAuditorStatus';
    this._onlineExamService.postData(this.STAEntryForm.value, apiUrl)

      .subscribe(data => {

        this.toastr.show(
          '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> ' + data + ' </span></div>',
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

      });
    this.getAuditBranchPending(this.AddKlapAuditForm.get('File_No').value);
    this.hidepopup();


  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

  hidepopup() {
    this.getAuditBranchPending(this.AddKlapAuditForm.get('File_No').value)
    this.modalRef.hide();

  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  ngOnDestroy() {
    document.body.classList.remove('data-entry')
  }

  showmessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> ' + data + ' </span></div>',
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

  getsoftcopydetails() {

    var FileNo = this.AddKlapAuditForm.get('File_No').value;

    const apiUrl = this._global.baseAPIUrl + 'Klap/getsoftcopydetails?FileNo=' + FileNo + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._SCopyList = data;
      this._SCFilteredList = data;

      this.BindSoftCopyDetails(this._SCFilteredList, this._SCopyList);
    });
  }

  getPhysicalcopydetails() {

    var FileNo = this.AddKlapAuditForm.get('File_No').value;

    const apiUrl = this._global.baseAPIUrl + 'Klap/getPhysicalcopydetails?FileNo=' + FileNo + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._SCopyList = data;
      this._SCFilteredList = data;
      this.BindSoftCopyDetails(this._SCFilteredList, this._SCopyList);
    });
  }

  validation() {

    var var_PODNo = this.PODEntryForm.get('pod_no').value;

    if (var_PODNo.trim() == "") {
      this.showmessage("Please Enter POD No");
      return false;
    }
    if (this.PODEntryForm.get('courier_name').value == 0 || this.PODEntryForm.get('courier_name').value == null) {
      this.showmessage("Please Select Courier Name");
      return false;
    }
    if (this.PODEntryForm.get('courier_name').value == "0") {
      this.showmessage("Please Select Courier Name");
      return false;
    }

    return true;

  }

  formattedFileData: any = [];
  immutableFormattedDataFile: any;
  //loading: boolean = true;

  BindSoftCopyDetails(tableData, headerList) {
    let formattedFileData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'File_No', header: 'FILE NO', index: 2 },
      { field: 'documents', header: 'DOCUMENTS', index: 5 },
      { field: 'document_remark', header: 'BRANCH DOCUMENT REMARK', index: 4 },
      //  { field: 'soft_copy_remark', header: 'SOFT COPY REMARK', index: 4 },

    ];

    tableData.forEach((el, index) => {
      formattedFileData.push({
        'srNo': parseInt(index + 1),
        'File_No': el.File_No,
        'document_Id': el.document_Id,
        "documents": el.documents,
        "soft_copy_remark": el.soft_copy_remark,
        "document_remark": el.document_remark,

      });

    });
    this.headerListFile = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
    this.formattedFileData = formattedFileData;
    this.loading = false;

    // console.log(this.formattedData);

  }


  getPhysicalFiledetails() {

    var FileNo = this.AddKlapAuditForm.get('File_No').value;

    const apiUrl = this._global.baseAPIUrl + 'Klap/getphysicalcopydetails?FileNo=' + FileNo + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._SCopyList = data;
      this._SCFilteredList = data;
      console.log("data", data);
      this.BindPhysicalCopyDetails(this._SCFilteredList, this._SCopyList);
    });
  }

  formattedPCData: any = [];
  immutableFormattedDataPH: any;
  //loading: boolean = true;
  BindPhysicalCopyDetails(tableData, headerList) {
    let formattedFileData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'File_No', header: 'FILE NO', index: 2 },
      { field: 'documents', header: 'DOCUMENTS', index: 5 },
      { field: 'document_remark', header: 'BRANCH DOCUMENT REMARK', index: 4 },
      //  { field: 'soft_copy_remark', header: 'SOFT COPY REMARK', index: 4 },

    ];

    tableData.forEach((el, index) => {
      formattedFileData.push({
        'srNo': parseInt(index + 1),
        'File_No': el.File_No,
        'document_Id': el.document_Id,
        "documents": el.documents,
        "soft_copy_remark": el.soft_copy_remark,
        "document_remark": el.document_remark,

      });

    });
    this.headerListFile = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
    this.formattedFileData = formattedFileData;
    this.loading = false;

    // console.log(this.formattedData);

  }



  onUpdateSoftCopy() {
    this.submitted = true;

    const that = this;
    const apiUrl = this._global.baseAPIUrl + 'Klap/onUpdateSoftCopy';
    this._onlineExamService.postData(this.STASoftCopyEntryForm.value, apiUrl)
      // .pipe(first())
      .subscribe(data => {

        this.toastr.show(
          '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> ' + data + ' </span></div>',
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
        that.getAuditBranchPending(this.AddKlapAuditForm.get('File_No').value);
        //this.OnReset();      
      });
    // }

  }


  // onBack() {

  //   this.router.navigateByUrl('/klap/Klap-Branch-Pending');

  // }


  onBack(status:any) {
    
  
    this.AddKlapAuditForm.patchValue({     
      status:status    
      })
   
      const apiUrl = this._global.baseAPIUrl + "Klap/updatestatus";
      this._onlineExamService
        .postData(this.AddKlapAuditForm.value, apiUrl)
        // .pipe(first())
        .subscribe((data) => {
          this.ShowMessage(data);  
            this.OnReset(); 
  
            this.router.navigateByUrl('/klap/Klap-Branch-Pending');
        
  });
   
    
  }

  back(){
    this.router.navigateByUrl('/klap/Klap-Branch-Pending');
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



}
