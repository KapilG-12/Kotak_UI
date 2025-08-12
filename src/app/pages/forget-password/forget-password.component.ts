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
    // stop here if form is invalid
    if (this.ForgotPasswordForm.invalid) {
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'UserLogin/Forgotpassword';
    this.authService.userLogin(this.ForgotPasswordForm.value, apiUrl).subscribe(data => {
      if (data === 'Password send on mail please check.') {
        alert(data);
        this.OnReset();
      }
      else {
        this.toastr.show(
          '<div class="alert-text"</div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"> ' + data.Message + ' </span></div>',
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

    });
  }

  get f() {
    return this.ForgotPasswordForm.controls;
  }

  OnReset() {
    // this.Reset = true;
    this.ForgotPasswordForm.reset();

    // this.FileStatus="New";

  }

}
