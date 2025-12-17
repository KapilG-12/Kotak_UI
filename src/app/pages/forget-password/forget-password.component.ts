import { Component, OnInit } from "@angular/core";
import { Globalconstants } from "../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import { AuthenticationService } from '../../Services/authentication.service';
import { DxiConstantLineModule } from "devextreme-angular/ui/nested";
import { cos } from "@amcharts/amcharts4/.internal/core/utils/Math";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  ForgotPasswordForm: FormGroup;
  submitted = false;
  disableButton = false;
  _LogData: any;

  constructor(
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private http: HttpClient,
    private httpService: HttpClient
  ) { }

  ngOnInit(): void {
    this.ForgotPasswordForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])]
    });
    localStorage.clear();
  }

  onSubmit() {
    this.submitted = true;
    if (this.ForgotPasswordForm.invalid) {
      return;
    }

    // --- Check localStorage attempts ---
    const attemptsData = JSON.parse(localStorage.getItem('forgotAttempts') || '{}');
    const now = new Date().getTime();
    const oneHour = 60 * 60 * 1000;

    if (attemptsData.timestamp && now - attemptsData.timestamp < oneHour && attemptsData.count >= 3) {
      this.toastr.error("Too many password reset attempts. Try again after 1 hour.");
      this.disableButton = true;
      return;
    }

    const apiUrl = this._global.baseAPIUrl + 'UserLogin/Forgotpassword';
    this.authService.userLogin(this.ForgotPasswordForm.value, apiUrl).subscribe(data => {
      if (data === 'Password send on mail please check.') {
        alert(data);
        this.OnReset();

        // --- Update attempts only if success ---
        if (!attemptsData.timestamp || now - attemptsData.timestamp > oneHour) {
          // reset counter after 1 hr
          localStorage.setItem('forgotAttempts', JSON.stringify({ count: 1, timestamp: now }));
        } else {
          attemptsData.count = (attemptsData.count || 0) + 1;
          attemptsData.timestamp = now;
          localStorage.setItem('forgotAttempts', JSON.stringify(attemptsData));
        }

        // Disable if reached limit
        if (attemptsData.count > 3) {
          this.disableButton = true;
          this.ErrorMessage("Too many password reset attempts. Try again after 1 hour.");
        }
      }
      else {
        this.ErrorMessage(data.Message);
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
    return this.ForgotPasswordForm.controls;
  }

  OnReset() {
    this.ForgotPasswordForm.reset();
  }
}
