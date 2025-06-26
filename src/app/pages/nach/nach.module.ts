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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { NachRoutingModule } from './nach-routing.module';
import { HandedOverToNachTeamComponent } from './handed-over-to-nach-team/handed-over-to-nach-team.component';
import { ReceivedByNachTeamComponent } from './received-by-nach-team/received-by-nach-team.component';
import { SendToBankerComponent } from './send-to-banker/send-to-banker.component';
import { StatusComponent } from './status/status.component';


@NgModule({
  declarations: [
    HandedOverToNachTeamComponent,
    ReceivedByNachTeamComponent,
    SendToBankerComponent,
    StatusComponent
  ],
  imports: [
    CommonModule,
    NachRoutingModule,
    TableModule,
    ProgressbarModule,
    BsDatepickerModule,
    BsDropdownModule,
    PaginationModule,
    TooltipModule,
    NgxDatatableModule,
    ModalModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NachModule { }
