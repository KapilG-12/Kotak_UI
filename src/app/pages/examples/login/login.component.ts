import { Component, OnInit } from "@angular/core";
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import {AuthenticationService} from '../../../Services/authentication.service';
@Component({
  selector: "app-login",
  templateUrl: "login.component.html"
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;

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
    private httpService: HttpClient  
  ) {}

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });
  }

  onSubmit() {

    this.submitted = true;
     // stop here if form is invalid
     if (this.loginForm.invalid) {
      return;
  }  
  const apiUrl = this._global.baseAPIUrl + 'UserLogin/Create';
    this.authService.userLogin(this.loginForm.value,apiUrl)
    // .pipe(first())

    .subscribe( data => {

      this.router.navigate(['/app-sidenav']);
      if(data!=null)
      {
        this.router.navigate(['/app-sidenav']);
      }
    else
    {
      alert("User or password not correct.");     
    }

  });
  }

}
