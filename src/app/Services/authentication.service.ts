import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { catchError, tap, map  } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
//import { Platform } from '@ionic/angular';
import { User } from '../Model/user.model';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
//const apiUrl = "http://localhost:58526/api/UserAuthentication/";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);
  currentUser: User;
  loggedInUser = {
    token : localStorage.getItem('User_Token'),
    tid:  Number(localStorage.getItem('sysRoleID')),

    // localStorage.setItem('UserID',that._LogData.id) ;
    // localStorage.setItem('sysRoleID',that._LogData.sysRoleID) ;
    // localStorage.setItem('User_Token',that._LogData.User_Token) ;
  }
  constructor(private http: HttpClient) { 
   // this.plt.ready().then(() => {
     // this.checkToken();
   // });
  }
  checkToken() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
      if (this.currentUser!=null) {
        this.authenticationState.next(true);
      }
    
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        "Backend returned code ${error.status}, " +
        "body was: ${error.error}");
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
  userLogin(data,apiUrl:string ): Observable<any> {
    
    //const url = apiUrl+'GetAllCustomers';
   return this.http.post(apiUrl, data, httpOptions)
   .pipe(map(user => {   
    if (user!=null) {       
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.authenticationState.next(true);
        
    }
    return user;
}));
 }

 get getUserInfo() {
  return this.loggedInUser
}

 logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser'); 
  return null;
}
isAuthenticated() {
  return this.authenticationState.value;
}
}
