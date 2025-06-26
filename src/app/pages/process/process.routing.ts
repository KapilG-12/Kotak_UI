import { Routes } from "@angular/router";
import { PODEntryComponent } from './PODEntry/PODEntry.component';
import { PODAcknowledgeComponent } from './PODAcknowledge/PODAcknowledge.component';
// import { InwardACKComponent } from './InwardACK/InwardACK.component';
// import { FileAcknowledgeComponent } from "./file-acknowledge/file-acknowledge.component";
import { FileAckComponent } from './file-ack/file-ack.component';
import { BranchInwardComponent } from './branch-inward/branch-inward.component';
import { PodAckComponent } from './pod-Ack/pod-Ack.component';
import { FileinwardComponent } from './file-inward/file-inward.component';
 import{PrintBarcodeComponent} from'./print-barcode/print-barcode.component';
import { ProposalMakerComponent } from "../docket/proposal-maker/proposal-maker.component";

export const DepartmentRoutes: Routes = [
  {
    path: "",
    children: [
      // {
      //   path: "Retrivalrequest",
      //   component: RetrivalrequestComponent
      // } 
      // ,
      
      {
        path: "branch-inward",
        component: BranchInwardComponent
      },
      {
        path: "pod-entry",
        component: PODEntryComponent
      }  
      ,
      {
        path: "pod-ack",
        component: PodAckComponent
      },
  
      {
        path: "FileAck",
        component: FileAckComponent
      },
      {
        path: "file-inward",
        component: FileinwardComponent
      } ,
      {
        path: "PODAcknowledge",
        component: PODAcknowledgeComponent
      },
      {
        
          path: "printbarcode",
          component: PrintBarcodeComponent
         
      },
      {
        path:"proposal-maker",
        component:ProposalMakerComponent
      }, 
     
      
    ]
  }
];
