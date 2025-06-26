import { Routes } from "@angular/router";
  
import { QuicksearchComponent } from './Quicksearch/Quicksearch.component';
import { KlapSearchComponent } from './klap-search/klap-search.component';

//DataUploadComponent
 
 
export const searchRoutes: Routes = [
  {
    path: "",
    children: [      
      
      {
        path: "quick-search",
       component: QuicksearchComponent
      },
      {
        path: "Klap-search",
       component: KlapSearchComponent
      }
      
    //search/Klap-search
      
            
    ]
  }
];
