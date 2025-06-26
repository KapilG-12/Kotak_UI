// src/app/Services/ip-guard.service.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Globalconstants } from '../Helper/globalconstants';

@Injectable({
  providedIn: 'root'
})
export class IpGuardService implements CanActivate {

  constructor(private http: HttpClient, private router: Router, private _global: Globalconstants) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const apiUrl = this._global.baseAPIUrl + 'UserLogin/CheckIP';

    return this.http.get(apiUrl).pipe(
      map(() => true), // IP allowed
      catchError(err => {
        if (err.status === 403) {
          this.router.navigate(['/unauthorized']);
        }
        return of(false);
      })
    );
  }
}
