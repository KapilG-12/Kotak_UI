
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { saveAs } from 'file-saver';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-print-barcode',
  templateUrl: './print-barcode.component.html',
  styleUrls: ['./print-barcode.component.scss']
})
export class PrintBarcodeComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  isReadonly = true;
  _IndexList: any;
  UserID: any;
  PODAckForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = '';
  _FileNo: any = "";
  first: any = 0;
  rows: any = 0;
  _IndexPendingListFile: any;
  _FilteredListFile: any;


  // _Replacestr:any="D:/WW/14-Jully-2020/UI/src/assets";

  _TotalPages: any = 0;
  _FileList: any;
  _FilteredList: any;
  _IndexPendingList: any;
  bsValue = new Date();

  constructor(private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,) { }

  ngOnInit(): void {
    document.body.classList.add('data-entry');

    this.PODAckForm = this.formBuilder.group({
      pod_no: ['', Validators.required],
      new_pod_no: ['', Validators.required],
      courier_name: [0, Validators.required],
      batch_no: ['', Validators.required],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
    });

    this.GetPODDetails();
    this.PODAckForm.controls['courier_name'].setValue(0);
    this.UserID = localStorage.getItem('UserID');
  }

  downloadLC(_File: any) {
    const data = [_File.batch_no];
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetExcelBarcodeFileUrl?&batch_no=' + _File.batch_no + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe((data) => {
      // Create Blob for Excel file
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Create download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = _File.batch_no + '_' + 'Barcode.xlsx';
      link.click();
      // Clean up
      window.URL.revokeObjectURL(link.href);
    });
  }

  GetPODDetails() {
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/PrintBarcode?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._IndexPendingList = data;
      this._FilteredList = data;
      this.prepareTableData(this._FilteredList, this._IndexPendingList);
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
      { field: 'batch_no', header: 'BATCHID', index: 2 },
      { field: 'pod_no', header: 'AWB STATUS', index: 3 },
    ];

    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'batch_no': el.batch_no,
        'pod_no': el.status,
      });
    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }

  searchTable($event) {
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
    this.PODAckForm.reset();
    this.isReadonly = false;

  }

  Print(row: any) {
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/DownloadFile?BatchNo=' + row.batch_no + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {

        const pdf = new Blob([res], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(pdf);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (!this.validation()) {
      return;
    }

    const that = this;
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/PODAckdetailsEntry';
    this._onlineExamService.postData(this.PODAckForm.value, apiUrl)
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
        this.modalRef.hide();
        that.GetPODDetails();
      });
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

  hidepopup() {
    this.modalRef.hide();
  }

  Editinward(template: TemplateRef<any>, row: any) {
    var that = this;

    if (row.Status == "POD Acknowledge" && localStorage.getItem('UserID') != '1') {
      this.showmessage("You can not modify POD ");
      return;
    }

    this.PODAckForm.patchValue({
      batch_no: row.batch_no,
      pod_no: row.pod_no,
      courier_name: row.CourierID,
      new_pod_no: row.new_pod_no,
    })

    this.modalRef = this.modalService.show(template);
    this.GetBatchDetails();
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

  validation() {

    var var_PODNo = this.PODAckForm.get('pod_no').value;

    if (var_PODNo.trim() == "") {
      this.showmessage("Please Enter POD No");
      return false;
    }
    if (this.PODAckForm.get('courier_name').value == 0 || this.PODAckForm.get('courier_name').value == null) {
      this.showmessage("Please Select Courier Name");
      return false;
    }
    if (this.PODAckForm.get('courier_name').value == "0") {
      this.showmessage("Please Select Courier Name");
      return false;
    }

    if (this.PODAckForm.get('batch_no').value == "") {
      this.showmessage("Please Enter Batch No");
      return false;
    }

    return true;

  }


  formattedFileData: any = [];
  headerListFile: any;
  immutableFormattedDataFile: any;
  BindFileDetails(tableData, headerList) {
    let formattedFileData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'batch_no', header: 'BATCHNO', index: 2 },
      //  { field: 'pod_no', header: 'POD NO', index: 3 },
      { field: 'appl', header: 'APPL', index: 4 },
      { field: 'apac', header: 'APAC', index: 5 },

    ];

    tableData.forEach((el, index) => {
      formattedFileData.push({
        'srNo': parseInt(index + 1),
        'batch_no': el.batch_no,
        // 'pod_no': el.pod_no,  
        'appl': el.appl,
        'apac': el.apac,

      });

    });
    this.headerListFile = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
    this.formattedFileData = formattedFileData;
    this.loading = false;
  }


  GetBatchDetails() {

    const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetBatchDetails?BatchNo=' + this.PODAckForm.controls['batch_no'].value + '&USERId=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._IndexPendingListFile = data;
      this._FilteredListFile = data;

      this.BindFileDetails(this._IndexPendingListFile, this._FilteredListFile);

    });
  }


}
