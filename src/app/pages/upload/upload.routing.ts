import { Routes } from "@angular/router";
 
//import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { DumpuploadComponent } from "./dumpupload/dumpupload.component";
import { InvuploadComponent } from "./invupload/invupload.component";
import { PaymentUpdateComponent } from "./payment-update/payment-update.component";
//import { BulkUserComponent } from "./bulkuser/bulkuser.component";
 
export const uploadRoutes: Routes = [
  {
    path: "",
    children: [
      // {
      //   path: "file-upload",
      //  component: UploadinwarddataComponent
      // },
      // {
      //   path: "PDCBarcoding",
      //  component: PDCBarcodingComponent
      // },
      // {
      //   path: "Barcoding",
      //  component: BarcodingComponent
      // }
      // ,
      // {
      //   path: "Uploadinwarddata",
      //  component: UploadinwarddataComponent
      // }
      // ,
      // {
      //   path: "MoveToAuditor",
      //  component: MoveToAuditorComponent
      // },
      // {
      //   path: "ReturnFromAuditor",
      //  component: ReturnFromAuditorComponent
      // },
      // {
      //   path: "Storage",
      //  component: StorageComponent
      // }
      // ,

      // {
      //   path: "bulkuser",
      //   component: BulkUserComponent
      // },

      {
        path: "Dumpupload",
       component: DumpuploadComponent
      },
      {
        path: "Payment-Update",
       component: PaymentUpdateComponent
      },
     

      
    ]
  }
];
