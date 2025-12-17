import { Component, OnInit, TemplateRef } from "@angular/core";
import { Globalconstants } from "../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../Services/online-exam-service.service";

import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import { AuthenticationService } from '../../Services/authentication.service';
import { DxiConstantLineModule } from "devextreme-angular/ui/nested";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { CommonService } from "src/app/Services/common.service";

@Component({
  selector: 'app-login-new',
  templateUrl: './login-new.component.html',
  styleUrls: ['./login-new.component.scss']
})
export class LoginNewComponent implements OnInit {

  loginForm: FormGroup;
  loginFormSSO: FormGroup;
  submitted = false;
  showPassword = false;
  sessionId: string = '';
  _LogData: any;
  fieldTextType: boolean;
  modalRef: BsModalRef;
  otp: string[] = ['', '', '', ''];
  timer: number = 60;
  interval: any;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;
  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  config = {
    class: 'modal-dialog-centered'
  }
  showotpTemplate = false;
  constructor(

    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private http: HttpClient,
    private _commonService: CommonService,
    private httpService: HttpClient
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required]), Validators.maxLength(50)],
      password: ['', Validators.required],
    });

    this.loginFormSSO = this.formBuilder.group({
      Email: [''],
      nameId: [''],
      sessionId: ['']
    });

    this.route.queryParams.subscribe(params => {
      this.sessionId = params['sessionId'] || '';
      if (this.sessionId) {
        this.onSubmitSSOLogin(this.sessionId);
      }
    });

    localStorage.clear();
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  closeTemplate() {
    this.showotpTemplate = false;
  }

  onOtp(template: TemplateRef<any>) {
    this.startTimer();
    this.modalRef = this.modalService.show(template, this.config);
  }

  submitOtp() {
    const otpValue = this.otp.join('');
    console.log('Entered OTP:', otpValue);
  }

  proceedToPassword() {
    if (this.loginForm.get("username").value == "" || this.loginForm.get("username").value == null) {
      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"> Please enter User ID </span></div>',
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
      return;
    }
    this.loginForm.get("password").setValue('');
    this.fieldTextType = false;
    this.showPassword = true;
  }

  backToUserId() {
    this.loginForm.get("password").setValue('');
    this.fieldTextType = false;
    this.showPassword = false;
  }

  resendOtp() {
    this.otp = ['', '', '', ''];
    this.startTimer();
  }

  focusNext(event: any, index: number) {
    if (event.target.value && index < 3) {
      const nextInput = document.querySelectorAll('input')[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  startTimer() {
    this.timer = 60;
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loginForm.patchValue({
      password: this._commonService.encryptData(this.loginForm.controls['password'].value),
    });

    const apiUrl = this._global.baseAPIUrl + 'UserLogin/Create';
    this._onlineExamService.postData(this.loginForm.value, apiUrl).subscribe(data => {

      if (data.length > 0 && data[0].id != 0) {
        var that = this;
        that._LogData = data[0];

        if (that._LogData.Days <= 15) {
          var mess = " Your password expires in  " + that._LogData.Days + "  days. Change the password as soon as possible to prevent login problems"
          this.showSuccessToast(mess);
        }
        localStorage.setItem('User_email', that._LogData.email);
        localStorage.setItem('UserName', this.loginForm.get("username").value);
        localStorage.setItem('PW', this.loginForm.get("password").value);

        if (this.loginForm.get("username").value == "admin") {
          this.router.navigate(['/otp']);
        }
        else if (this.loginForm.get("username").value == "upload") {
          this.router.navigate(['/otp']);
        } else {
          this.router.navigate(['/otp']);
        }
      }
      else {
        this.ErrorMessage(data[0].userid);
      }

    });
  }

  login() {
    // window.location.href = 'https://dmstest.crownims.com/KotakAPI/Account/Login' //Testing SSO URL
    window.location.href = 'https://kotakprime.crownims.com/KotakDartAPI/Account/Login' //Live SSO URL
  }

  onSubmitSSOLogin(sessionId: any) {
    this.submitted = true;

    if (!sessionId) {
      this.ErrorMessage("Invalid SSO session. Please try again.");
      return;
    }

    this.loginFormSSO.patchValue({
      sessionId: sessionId
    });

    const apiUrl = this._global.baseAPIUrl + 'UserLogin/UserLoginSSO';
    this._onlineExamService.postData(this.loginFormSSO.value, apiUrl).subscribe(data => {

      if (data.length > 0 && data[0].id != 0) {
        var that = this;
        that._LogData = data[0];

        if (that._LogData.Days <= 15) {
          var mess = " Your password expires in  " + that._LogData.Days + "  days. Change the password as soon as possible to prevent login problems"
          this.showSuccessToast(mess);
        }
        localStorage.setItem('User_email', that._LogData.email);
        localStorage.setItem('UserName', this._commonService.decryptdata(that._LogData.username));
        localStorage.setItem('PW', that._LogData.PW);

        if (this.loginForm.get("username").value == "admin") {
          this.router.navigate(['/otp']);
        }
        else if (this.loginForm.get("username").value == "upload") {
          this.router.navigate(['/otp']);
        }
        else {
          this.router.navigate(['/otp']);
        }
      }
      else {
        this.ErrorMessage(data[0].userid);
      }

    });
  }

  get f() {
    return this.loginForm.controls;
  }

  ErrorMessage(msg: any) {

    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"> ' + msg + ' </span></div>',
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

  showSuccessToast(msg: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success ! </span> <span data-notify="message"> ' + msg + ' </span></div>',
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