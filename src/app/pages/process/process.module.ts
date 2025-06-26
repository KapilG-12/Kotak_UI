import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
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
import { DepartmentRoutes } from "./process.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileAcknowledgeComponent } from "./file-acknowledge/file-acknowledge.component";
import { PODEntryComponent } from './PODEntry/PODEntry.component';

import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { PODAcknowledgeComponent } from './PODAcknowledge/PODAcknowledge.component';

import { FileAckComponent } from './file-ack/file-ack.component';
import { BranchInwardComponent } from './branch-inward/branch-inward.component';
import { PodAckComponent } from './pod-Ack/pod-Ack.component';

import { FileinwardComponent } from './file-inward/file-inward.component';

import{ PrintBarcodeComponent }from './print-barcode/print-barcode.component';


@NgModule({
  declarations:  [BranchInwardComponent,FileinwardComponent,FileAckComponent, PODAcknowledgeComponent,PODEntryComponent,FileAcknowledgeComponent,PodAckComponent,PrintBarcodeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DepartmentRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    CheckboxModule,
    TableModule,
   
  ],
 })
export class ProcessModule {}
