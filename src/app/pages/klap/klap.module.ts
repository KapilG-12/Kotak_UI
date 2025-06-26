import { NgModule  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
// import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';
import {MatExpansionModule} from '@angular/material/expansion';
import { RouterModule } from "@angular/router";

import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';


import { KlapRoutingModule } from './klap.routing';
import { KlapauditComponent } from "./klap-audit/klap-audit.component";
import { KlapBranchPendingComponent } from './klap-branch-pending/klap-branch-pending.component';
import { BranchDocumentListComponent } from './branch-document-list/branch-document-list.component';
import { AuditpendingComponent } from "./Klap-audit-pending/audit-pending.component";
import { KlapAuditCompleteComponent } from './klap-audit-complete/klap-audit-complete.component';
import { KlapInsertionAuditComponent } from './klap-insertion-audit/klap-insertion-audit.component';
import { KlapInsertionPendingComponent } from './klap-insertion-pending/klap-insertion-pending.component';


@NgModule({
  declarations: [KlapauditComponent,KlapInsertionAuditComponent,AuditpendingComponent, KlapBranchPendingComponent, BranchDocumentListComponent, KlapAuditCompleteComponent, KlapInsertionPendingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(KlapRoutingModule),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    // NgxPrintModule,
    CheckboxModule,
    TableModule,
   // KlapRoutingModule
  ]
})
export class KlapModule { }
