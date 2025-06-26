import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup,FormControl, FormBuilder, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  UserList: any;
  changepasswordform: FormGroup;
  submitted = false;
  Reset = false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
  _SingleUser: any = [];
  _UserID: any;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants

  ) { }

  ngOnInit(): void {

    this.changepasswordform = this.formBuilder.group({
      currentpwd: ["", Validators.required],
      pwd: ["", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/)]],
      confirmPass: ["", Validators.required],
      // recaptcha: ["", Validators.required],           
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID')

    },{ 
      validator: this.ConfirmedValidator('pwd', 'confirmPass')
    });
     
  
  }
    //Newly added code 
    ConfirmedValidator(controlName: string, matchingControlName: string){
      return (formGroup: FormGroup) => {
          const control = formGroup.controls[controlName];
          const matchingControl = formGroup.controls[matchingControlName];
          if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
              return;
          }
          if (control.value !== matchingControl.value) {
              matchingControl.setErrors({ confirmedValidator: true });
          } else {
              matchingControl.setErrors(null);
          }
      }
  }
  reset(){
    this.changepasswordform.controls['currentpwd'].reset();
    this.changepasswordform.controls['pwd'].reset();
    this.changepasswordform.controls['confirmPass'].reset();
  }
    get f(){
      return this.changepasswordform.controls;
    }

    onSubmit() {
      this.submitted = true;
      //console.log(this.changepasswordform);
      if (this.changepasswordform.invalid) {
        return;
      }
      const apiUrl = this._global.baseAPIUrl + 'UserLogin/Changepassword';
      this._onlineExamService.postData(this.changepasswordform.value,apiUrl).subscribe((data: {}) => {     
    
    this.ShowMessage(data);
    this.reset();
        //   console.log(data);
     //   alert("Password changed successfully");


      //  this.toastr.show(
      //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Password changed successfully</span></div>',
      //   "",
      //   {
      //     timeOut: 3000,
      //     closeButton: true,
      //     enableHtml: true,
      //     tapToDismiss: false,
      //     titleClass: "alert-title",
      //     positionClass: "toast-top-center",
      //     toastClass:
      //       "ngx-toastr alert alert-dismissible alert-success alert-notify"
      //   }
      // );
     
     
      });
  
      //this.studentForm.patchValue({File: formData});
    }


    ShowMessage(msg:any)
    {
  
      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"><h4 class="text-white"> '+msg+' <h4></span></div>',
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


    
    sendMail() {
      this.submitted = true;
      //console.log(this.changepasswordform);
      if (this.changepasswordform.invalid) {
       // alert("Please Fill the Fields");
        return;
      }
      const apiUrl = this._global.baseAPIUrl + 'UserLogin/sendmailtocustomer';
      this._onlineExamService.postData(this.changepasswordform.value,apiUrl).subscribe((data: {}) => {     
    //   console.log(data);
     //   alert("Password changed successfully");

 
     
     
      });
  
      //this.studentForm.patchValue({File: formData});
    }
    
    handleSuccess(data) {
      console.log(data);
    }

}
