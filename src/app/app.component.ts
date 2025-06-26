import { Component } from "@angular/core";
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { LoadingService } from './Services/loading.service';
import {delay} from 'rxjs/operators';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {

  title = 'angular-boilerplate';
  loading: boolean = false;


  constructor(private router: Router,
    private _loading: LoadingService) {

     this.router.events.subscribe((event: Event) => {
         if (event instanceof NavigationStart) {
             // Show loading indicator
             window.scrollTo(0,0);
         }

         if (event instanceof NavigationEnd) {
             // Hide loading indicator
         }

         if (event instanceof NavigationError) {
             // Hide loading indicator

             // Present error to user
             console.log(event.error);
         }
     });
   }

   ngOnInit() {
    this.listenToLoading();
   }

   /**
   * Listen to the loadingSub property in the LoadingService class. This drives the
   * display of the loading spinner.
   */
  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
