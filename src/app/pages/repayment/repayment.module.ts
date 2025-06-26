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
import { RepaymentRoutingModule } from './repayment-routing.module';
import { SiMandateSendToRcpComponent } from './si-mandate-send-to-rcp/si-mandate-send-to-rcp.component';
import { RepaymentLoadingComponent } from './repayment-loading/repayment-loading.component';
import { RepaymentQcComponent } from './repayment-qc/repayment-qc.component';
import { DispatchToVendorComponent } from './dispatch-to-vendor/dispatch-to-vendor.component';


@NgModule({
  declarations: [
    SiMandateSendToRcpComponent,
    RepaymentLoadingComponent,
    RepaymentQcComponent,
    DispatchToVendorComponent
  ],
  imports: [
    CommonModule,
    RepaymentRoutingModule,
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
export class RepaymentModule { }
