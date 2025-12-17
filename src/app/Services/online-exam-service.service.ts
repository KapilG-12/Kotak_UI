import { Injectable } from '@angular/core';
// import { IGame } from '../Interface/drop-down-list';
import { Listboxclass } from '../Helper/listboxclass';


import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, tap, map, filter } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })//,

  //responseType: 'blob' as 'blob'
};
@Injectable({
  providedIn: 'root'
})
export class OnlineExamServiceService {

  allNotifications: Notification[];
  private rolesChanged = new BehaviorSubject(new Date().getTime());
  isRoleChanged = this.rolesChanged.asObservable();


  constructor(private http: HttpClient,
    private _global: Listboxclass

  ) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(error);
  }

  getAllData(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl).pipe(
      map(this.extractData));
  }

  DLoadFile(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl, httpOptions).pipe(
      map(this.extractData));
  }

  public DownloadFile(): string {
    let ObjectRef: Object = {};
    return 'http://localhost:50819/Temp/';
  }

  getAllDataWithFormValue(data, apiUrl): Observable<any> {
    return this.http.post(apiUrl, data, httpOptions).pipe(
      map(this.extractData));
  }

  getDropDownData(apiUrl: string): Observable<Listboxclass> {
    return this.http.get<Listboxclass>(apiUrl).pipe(map(res => this._global = res));

    //(this.notificationsUrl).pipe(map(res => this.allNotifications = res))
  }

  public getProducts(apiUrl: string): Observable<Listboxclass[]> {
    return this.http.get<Listboxclass[]>(apiUrl);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getDataById(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl).pipe(
      map(this.extractData));
  }

  postData(data, apiUrl): Observable<any> {
    return this.http.post(apiUrl, data, httpOptions)
      .pipe(
        catchError(this.handleError),
        map(this.extractData)
      );
  }

  roleChanged() {
    this.rolesChanged.next(new Date().getTime());
  }

  updateData(data, apiUrl): Observable<any> {
    return this.http.post(apiUrl, data, httpOptions)
      .pipe(
        catchError(this.handleError),
        map(this.extractData)
      );
  }
  deleteData(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl).pipe(
      map(this.extractData));
  }

  public download_test(data, apiUrl: string): Observable<Blob> {

    const headers = new HttpHeaders().set('content-type', 'multipart/form-data');

    return this.http.post(apiUrl, data, { headers, responseType: 'blob' });
  }

  public downloadDoc(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl, { responseType: "blob" });
  }

  DownloadpostData(data, apiUrl): Observable<any> {
    return this.http.get(apiUrl, { responseType: "blob" });
  }
  
  public BulkDownload(data, apiUrl): Observable<any> {
    return this.http.post(apiUrl, data, { responseType: "blob" })

  }

  downloadExcelFile(url: string, fileName: any): void {
    this.http.get(url, { responseType: 'blob' })
      .subscribe((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName + 'Barcode.xlsx';
        link.click();
      });
  }
}
