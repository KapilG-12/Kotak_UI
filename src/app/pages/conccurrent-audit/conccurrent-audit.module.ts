import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ModalModule } from 'ngx-bootstrap/modal';
import {MatExpansionModule} from '@angular/material/expansion';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConccurrentAuditRoutingModule } from './conccurrent-audit-routing.module';
import { FileCheckingComponent } from './file-checking/file-checking.component';
import { QueryUpdationComponent } from './query-updation/query-updation.component';
import { QueryClosureComponent } from './query-closure/query-closure.component';


@NgModule({
  declarations: [
    FileCheckingComponent,
    QueryUpdationComponent,
    QueryClosureComponent
  ],
  imports: [
    CommonModule,
    ConccurrentAuditRoutingModule,
    TableModule,
    NgxDatatableModule,
    //MatExpansionModule,
    ReactiveFormsModule,
    RouterModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule
  ]
})
export class ConccurrentAuditModule { }
