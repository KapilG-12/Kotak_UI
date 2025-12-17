import { Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Globalconstants } from "../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../Services/online-exam-service.service";

import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import { AuthenticationService } from '../../Services/authentication.service';
import { DxiConstantLineModule } from "devextreme-angular/ui/nested";
//
import { MessageService } from 'primeng/api';
import { CommonService } from "src/app/Services/common.service";
import { LoadingService } from "src/app/Services/loading.service";
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  loginForm: FormGroup;
  submitted = false;
  _LogData: any;
  fieldTextType: boolean;
  otp: string[] = ['', '', '', '', '', ''];
  timer: number = 60;
  interval: any;
  RoleName: any;
  timers: number = 180;
  msgs: any[] = [];
  intervals: any;
  otpNumber: any;
  setSubmit = 0;
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';

  constructor(


    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private http: HttpClient,
    private httpService: HttpClient,
    private messageService: MessageService,
    private _commonService: CommonService,
    private loadingService: LoadingService

  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: localStorage.getItem("UserName"),
      email: localStorage.getItem("User_email"),
      password: localStorage.getItem("PW"),
      OTP: ['', Validators.required],
    });
    this.startTimer();
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  
  handleOtpChange(otp: string): void {
    this.otpNumber = otp;
  }
  
  onInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;
    if (value && index < this.otp.length - 1) {
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  onBackspace(event: any, index: number) {
    if (!this.otp[index] && index > 0) {
      this.otpInputs.get(index - 1)?.nativeElement.focus();
    }
  }
  
  startTimer() {
    this.timer = 60;
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.interval);
        this.setSubmit = 1;
        this.endTimer();
      }
    }, 1000);
  }
  
  endTimer() {  
    this.timers = 180;
    this.intervals = setInterval(() => {
      if (this.timers > 0) {
        this.timers--;
      } else {
        clearInterval(this.intervals);
      }
    }, 1000);
  }

  focusNext(event: any, index: number) {
    if (event.target.value && index < 5) {
      const nextInput = document.querySelectorAll('input')[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  resendOtp() {
    this.startTimer();
    this.setSubmit = 0;
    this.ResendOtp();
  }

  ResendOtp() {
    this.submitted = true;

    this.loginForm.patchValue({
        OTP: '',
        password: this.loginForm.controls['password'].value,
      });

    const apiUrl = this._global.baseAPIUrl + 'UserLogin/Create';
    // this.authService.userLogin(this.loginForm.value, apiUrl).subscribe(data => {
    this._onlineExamService.postData(this.loginForm.value, apiUrl).subscribe(data => {

      if (data.length > 0 && data[0].id != 0) {
        var that = this;
        that._LogData = data[0];
      }
    });
  }

  VerifyOTP() {
    if(this.otpNumber === '' || this.otpNumber === null || this.otpNumber === undefined) {
      this.ErrorMessage("Please enter OTP.");
      return;
    }
    this.loginForm.patchValue({
      OTP: this._commonService.encryptData(this.otpNumber),
    });
    this.submitted = true;
    const apiUrl = this._global.baseAPIUrl + 'UserLogin/VerifyOTP';
    this._onlineExamService.postData(this.loginForm.value, apiUrl).subscribe({
      next: (data) => {
        this.showSuccessToast(data);
        this.SignIn();
      },
      error: (errorResponse) => {
        const errorMessage = errorResponse.error.Message;
        this.ErrorMessage(errorMessage);
      }
    });
  }

  SignIn() {
    this.submitted = true;
    const apiUrl = this._global.baseAPIUrl + 'UserLogin/UserSignIn';
    this.authService.userLogin(this.loginForm.value, apiUrl).subscribe({
      next: (data) => {

        this.loadingService.manualLoading(true);

        if (data.length > 0 && data[0].id != 0) {
          var that = this;
          that._LogData = data[0];

          if (that._LogData.Days <= 15) {
            var mess = " Your password expires in  " + that._LogData.Days + "  days. Change the password as soon as possible to prevent login problems"
            this.showSuccessToast(mess);
          }

          localStorage.setItem('UserID', that._LogData.id);
          localStorage.setItem('currentUser', that._LogData.id);
          localStorage.setItem('sysRoleID', that._LogData.sysRoleID);
          localStorage.setItem('User_Token', that._LogData.User_Token);
          localStorage.setItem('Usertype', that._LogData.Usertype);
          localStorage.setItem('UserName', this.loginForm.get("username").value);
          localStorage.removeItem('PW');

          this.RoleName = that._LogData.roleName;

          if (this.RoleName == "Admin") {
            this.router.navigate(['search/quick-search']).finally(() => {
              clearInterval(this.intervals);
              this.loadingService.manualLoading(false);
            });
          } else if (this.RoleName == "Checker") {
            this.router.navigate(['usermanagement/checker']).finally(() => {
              clearInterval(this.intervals);
              this.loadingService.manualLoading(false);
            });
          } else if (this.RoleName == "Maker") {
            this.router.navigate(['usermanagement/users']).finally(() => {
              clearInterval(this.intervals);
              this.loadingService.manualLoading(false);
            });
          } else {
            this.router.navigate(['search/quick-search']).finally(() => {
              clearInterval(this.intervals);
              this.loadingService.manualLoading(false);
            });
          }
        }
        else if (data[0].userid === null || data[0].userid === '') {
          this.ErrorMessage("Wrong UserID and Password.");
          this.loadingService.manualLoading(false);
        }
        else {
          this.ErrorMessage(data[0].userid)
          this.loadingService.manualLoading(false);
        }
      },
      error: () => {
        this.loadingService.manualLoading(false);
      }
    });
  }


  ErrorMessage(msg: any) {
    this.toastr.show(
      `<div class="alert-text"> <span class="alert-title" data-notify="title"></span> <span data-notify="message"> ${msg} </span> </div>`, 
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify"
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

  get f() {
    return this.loginForm.controls;
  }
}
