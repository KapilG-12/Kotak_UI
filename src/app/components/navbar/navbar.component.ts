import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import {AuthenticationService} from '../../Services/authentication.service';
 
import { Globalconstants } from "../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
 
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import { DxiConstantLineModule } from "devextreme-angular/ui/nested";

import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from "@angular/common";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  UserName: any;
  sidenavOpen: boolean = false;

  constructor(
    location: Location,
    private element: ElementRef,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants, 
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.location = location;
    this.router.events.subscribe((event: Event) => {
       if (event instanceof NavigationStart) {
           // Show loading indicator
   
       }
       if (event instanceof NavigationEnd) {
           // Hide loading indicator

           if (window.innerWidth < 1200) {
        
             document.body.classList.remove("g-sidenav-pinned");
             document.body.classList.add("g-sidenav-hidden");
             this.sidenavOpen = false;
           }
       }

       if (event instanceof NavigationError) {
           // Hide loading indicator

           // Present error to user
         //  console.log(event.error);
       }
   });

  }
 

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.UserName= localStorage.getItem('UserName') ;
  }


  

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }

  openSearch() {
    document.body.classList.add("g-navbar-search-showing");
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-showing");
      document.body.classList.add("g-navbar-search-show");
    }, 150);
    setTimeout(function() {
      document.body.classList.add("g-navbar-search-shown");
    }, 300);
  }
  closeSearch() {
    document.body.classList.remove("g-navbar-search-shown");
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-show");
      document.body.classList.add("g-navbar-search-hiding");
    }, 150);
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-hiding");
      document.body.classList.add("g-navbar-search-hidden");
    }, 300);
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-hidden");
    }, 500);
  }
  openSidebar() {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
      this.sidenavOpen = false;
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
      this.sidenavOpen = true;
    }
  }
  toggleSidenav() {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
      this.sidenavOpen = false;
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
      this.sidenavOpen = true;
    }
  }

  Logout()
  { 
    const apiUrl = this._global.baseAPIUrl + 'UserLogin/Logout?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');

    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
       
      localStorage.clear();     
      this.router.navigate(['/Login']);
    });

  
    //this.router.navigateByUrl('/dashboards/dashboard'); 
 
  }
  

}
