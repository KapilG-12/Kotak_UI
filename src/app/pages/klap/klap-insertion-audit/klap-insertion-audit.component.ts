import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";



@Component({
  selector: 'app-klap-insertion-audit',
  templateUrl: './klap-insertion-audit.component.html',
  styleUrls: ['./klap-insertion-audit.component.scss']
})
export class KlapInsertionAuditComponent implements OnInit {



  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  modalRef: BsModalRef;
  _FilteredList: any;
  _RoleList: any;
  AddKlapAuditForm: FormGroup;
  PODEntryForm: FormGroup;
  submitted = false;
  Reset = false;
  Isreadonly = false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
  buttonDisabled: any;
  _DocumentType = "";
  documentsL: any;
  _message = "";
  _UserID: any;
  User: any;
  first = 0;
  rows = 10;
  class: any;
  myFiles: string[] = [];
  httpService: any;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private router: Router
  ) { }
  ngOnInit() {
    this.AddKlapAuditForm = this.formBuilder.group({
      id: [""],
      document_type: [""],
      File_No: [""],
      //localStorage.getItem('Audit_File_no'),  
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
      document_Id: [0, Validators.required],
      query_status: [0, Validators.required],
      copy_type: [0, Validators.required],
      highlight_to_branch: [0, Validators.required],
      cpu_query_remark: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID')
    });

    this.PODEntryForm = this.formBuilder.group({
      document_Id: [""],
      copy_type: [""],
      query_status: [0, Validators.required],
      highlight_to_branch: [0, Validators.required],
      File_No: [""],
      soft_copy_remark: [""],
      physical_copy_remark: [""],
      document_remark: [""],
      cpu_query_remark: [""],
      remark: [""],
      documents: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
    });

    this.getFiledetails();
    //  this.BindHeader("","");   
  }


  getDocumentList() {

    const apiUrl = this._global.baseAPIUrl + 'Klap/getDcoument?USERId=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {

      this.documentsL = data;
    });
  }

  getFiledetails() {


    this.AddKlapAuditForm.controls['File_No'].setValue(localStorage.getItem('Audit_File_no'));


    const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetFileDetailsKlap';
    this._onlineExamService.postData(this.AddKlapAuditForm.value, apiUrl)

      .subscribe(data => {
        //alert(data[0].message);

        if (data[0].message == "Record found.") {

          this.AddKlapAuditForm.controls['location'].setValue(data[0].location);
          this.AddKlapAuditForm.controls['sub_lcoation'].setValue(data[0].sub_lcoation);
          this.AddKlapAuditForm.controls['maln_party_id'].setValue(data[0].maln_party_id);
          this.AddKlapAuditForm.controls['party_name'].setValue(data[0].party_name);
          this.AddKlapAuditForm.controls['agr_value'].setValue(data[0].agr_value);
          this.AddKlapAuditForm.controls['pdc_type'].setValue(data[0].party_name);
          this.AddKlapAuditForm.controls['apac_effective_date'].setValue(data[0].agr_value);
          this.AddKlapAuditForm.controls['apac'].setValue(data[0].apac);
          this.AddKlapAuditForm.controls['appl'].setValue(data[0].appl);
          this.AddKlapAuditForm.controls['document_type'].setValue(data[0].document_type);
          this.AddKlapAuditForm.controls['product'].setValue(data[0].product);

          this.GetFileDetailsKlap();
          console.log('data', data)

        }
        else {
          this.ShowErrormessage(data[0].message);
          return;
        }

      });

  }

  GetFileDetailsKlap() {

    const apiUrl = this._global.baseAPIUrl + 'Klap/GetFileDetailsKlap?file_no=' + this.AddKlapAuditForm.value.File_No + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {

      this._FilteredList = data;
      this.prepareTableData(data, data);
    });
  }

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
      { field: 'File_No', header: 'FILE NO', index: 2 },
      { field: 'documents', header: 'DOCUMENT', index: 3 },
      { field: 'copy_type', header: 'COPY TYPE', index: 5 },
      { field: 'query_status', header: 'QUERY STATUS', index: 6 },
      { field: 'highlight_to_branch', header: 'HIGHLIGHT TO BRANCH', index: 7 },
      { field: 'cpu_query_remark', header: 'CPU QUERY REMARK', index: 8 },
      { field: 'document_status', header: 'DOCUMENT STATUS', index: 8 },
      { field: 'document_remark', header: 'DOCUMENT REMARK', index: 8 },
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
      });

      if (el.document_status == "Audit Complete") {
        this.buttonDisabled = true
      }
      else {
        this.buttonDisabled = false
      }

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
    this.AddKlapAuditForm.controls['product'].setValue('');
    this.AddKlapAuditForm.controls['location'].setValue('');
    this.AddKlapAuditForm.controls['sub_lcoation'].setValue('');
    this.AddKlapAuditForm.controls['maln_party_id'].setValue('');
    this.AddKlapAuditForm.controls['party_name'].setValue('');
    this.AddKlapAuditForm.controls['agr_value'].setValue('');
    this.AddKlapAuditForm.controls['pdc_type'].setValue('');
    this.AddKlapAuditForm.controls['apac_effective_date'].setValue('');
    this.AddKlapAuditForm.controls['document_type'].setValue('');
    this.AddKlapAuditForm.controls['apac'].setValue('');
    this.AddKlapAuditForm.controls['appl'].setValue('');
    this.AddKlapAuditForm.controls['File_No'].setValue('');
    this.AddKlapAuditForm.controls['cpu_query_remark'].setValue('');
  }
  OnAddReset() {

    this.AddKlapAuditForm.controls['cpu_query_remark'].setValue('');
    this.AddKlapAuditForm.controls['highlight_to_branch'].setValue(0);
    this.AddKlapAuditForm.controls['document_Id'].setValue(0);
    this.AddKlapAuditForm.controls['copy_type'].setValue(0);
    this.AddKlapAuditForm.controls['query_status'].setValue(0);

  }

  OnClose() {
    this.modalService.hide(1);
  }
  //onAdd


  onAdd() {
    this.submitted = true;
    if (!this.validation()) {
      return;
    }
    const apiUrl = this._global.baseAPIUrl + "Klap/AddEditKlapdetails";
    this._onlineExamService
      .postData(this.AddKlapAuditForm.value, apiUrl)
      // .pipe(first())
      .subscribe((data) => {

        if (data == 'Record save succesfully') {
          this.ShowMessage(data);
        }
        else {
          this.ShowErrormessage(data);
        }

        this.OnAddReset();
        this.GetFileDetailsKlap();

      });
  }

  onSubmit() {
    
    this.submitted = true;
    if (!this.validation()) {
      return;
    }
    const apiUrl = this._global.baseAPIUrl + "Klap/onUpdateDocumentStatus";
    this._onlineExamService
      .postData(this.PODEntryForm.value, apiUrl)
      // .pipe(first())
      .subscribe((data) => {
        
        if (data == 'Record updated succesfully') {
          this.ShowMessage(data);
        }
        else {
          this.ShowErrormessage(data);
        }
        //this.OnReset(); 
        this.modalRef.hide();
        this.GetFileDetailsKlap();
      });
  }

  ShowErrormessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error ! </span> <span data-notify="message"> ' + data + ' </span></div>',
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


  ShowMessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success ! </span> <span data-notify="message"> ' + data + ' </span></div>',
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

  validation() {

    if (this.PODEntryForm.value.File_No == "" || this.PODEntryForm.value.File_No == null) {

      this.ShowErrormessage("Enter File No");
      return false;
    }

    // alert(this.PODEntryForm.value.document_Id);

    if (this.PODEntryForm.value.document_Id == 0) {

      this.ShowErrormessage("Select Document");
      return false;
    }
    if (this.PODEntryForm.value.query_status == 0) {

      this.ShowErrormessage("Select Query Status");
      return false;
    }
    if (this.PODEntryForm.value.highlight_to_branch == 0) {

      this.ShowErrormessage("Select Highlight to branch");
      return false;
    }

    return true;
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


  OnSave(status: any) {
    this.submitted = true;

    this.AddKlapAuditForm.patchValue({
      status: status
    })

    const apiUrl = this._global.baseAPIUrl + "Klap/updatestatus";
    this._onlineExamService
      .postData(this.AddKlapAuditForm.value, apiUrl)
      // .pipe(first())
      .subscribe((data) => {
        this.ShowMessage(data);

        this.OnReset();

      });


  }

  ViewBranchRemark(template: TemplateRef<any>, row: any) {
    var that = this;

    if (row.document_status != 'POD-Intransit') {

      //console.log("row",row);
      this.PODEntryForm.patchValue({
        documents: row.documents,
        copy_type: row.copy_type,
        File_No: row.File_No,
        query_status: row.query_status,
        highlight_to_branch: row.highlight_to_branch,
        cpu_query_remark: row.cpu_query_remark,
        soft_copy_remark: row.soft_copy_remark,
        physical_copy_remark: row.physical_copy_remark,
        document_Id: row.document_Id,

      })

      this.modalRef = this.modalService.show(template);
    }
    else {
      this.ShowErrormessage("Document is in Intransit");
    }


  }

  hidepopup() {
    // this.modalService.hide;
    this.modalRef.hide();
    //this.modalRef.hide
  }



  SentToBranch(status: any) {
    const that = this;
    const apiUrl = this._global.baseAPIUrl + 'Klap/updatestatus';
    this.AddKlapAuditForm.patchValue({
      status: status
    })
    this._onlineExamService.postData(this.AddKlapAuditForm.value, apiUrl)

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
  }

  onBack() {
    this.router.navigateByUrl('/klap/klap-insertion-pending')

  }


}
