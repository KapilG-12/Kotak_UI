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
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TWFRoutingModule } from './twf-routing.module';
import { CourierAckComponent } from './courier-ack/courier-ack.component';
import { FileInwardComponent } from './file-inward/file-inward.component';
import { CVTeamComponent } from './cvteam/cvteam.component';


@NgModule({
  declarations: [
    CourierAckComponent,
    FileInwardComponent,
    CVTeamComponent
  ],
  imports: [
    CommonModule,
    TWFRoutingModule,
    TableModule,
    NgxDatatableModule,
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
export class TWFModule { }
