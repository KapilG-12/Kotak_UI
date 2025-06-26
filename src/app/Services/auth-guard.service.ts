import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd, Route } from '@angular/router';
import {AuthenticationService} from '../Services/authentication.service';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router,public auth: AuthenticationService, private commonService: CommonService) { }
  // canActivate(): boolean {
  //   return this.auth.isAuthenticated();
  // }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    //     let moduleAccessFlag = false;
    //     if(this.router.url.indexOf('/Login') > -1) {
    //       moduleAccessFlag = true;
    //       return true;
    //     }
    //     this.router.events.subscribe((_: NavigationEnd) => {
    //       this.commonService.getMenuAccess().subscribe(res => {
    //         const currentRoute = _.url;
    //         if(res && currentRoute && currentRoute !== '/' && currentRoute !== '/Login') {
    //           const moduleName = currentRoute.split('/')[1];
    //           const subModuleName = currentRoute.split('/')[2];
    //           res.forEach(module => {
    //             if(module.path === '/' + moduleName) {
    //               module.children.forEach(subModule => {
    //                 if(subModule.path === subModuleName) {
    //                   moduleAccessFlag = true;
    //                   return true;
    //                 }
    //               });
    //             }
    //           });
    //         }
    //       });
    //       // logged in so return true
    //       console.log('status=>'+moduleAccessFlag);
    //       return moduleAccessFlag;
    //     });
        
    // } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['./Login'], { queryParams: { returnUrl: state.url }});
      return false;
  }
}
