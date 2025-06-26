import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KlapauditComponent } from "./klap-audit/klap-audit.component";
import { KlapBranchPendingComponent } from './klap-branch-pending/klap-branch-pending.component';
import { BranchDocumentListComponent } from './branch-document-list/branch-document-list.component';
import { AuditpendingComponent } from './Klap-audit-pending/audit-pending.component';
import { KlapInsertionAuditComponent } from './klap-insertion-audit/klap-insertion-audit.component';
import { KlapInsertionPendingComponent } from './klap-insertion-pending/klap-insertion-pending.component';
import { KlapAuditCompleteComponent } from './klap-audit-complete/klap-audit-complete.component'


//export class KlapRoutingModule { }


export const KlapRoutingModule: Routes = [
  {
    path: "",
    children: [
      // {
      //   path: "Retrivalrequest",
      //   component: RetrivalrequestComponent
      // } 
      // ,

      {
        path: "klap-audit",
        component: KlapauditComponent
      },
      {
        path: "Klap-Branch-Pending",
        component:KlapBranchPendingComponent
      },
      {
        path : "Branch-Document-List",
        component:BranchDocumentListComponent
      },
      {
        path: "Klap-audit-Pending",
        component: AuditpendingComponent
      },
      {
        path:"Klap-insertion-audit",
        component: KlapInsertionAuditComponent
      },
      {
        path:"klap-insertion-pending",
        component: KlapInsertionPendingComponent 
      },
      
      {
        path:"klap-Audit-Complete",
        component: KlapAuditCompleteComponent 
      }
    ]
  }
]

