import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocketRoutingModule } from './docket-routing.module';
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
import{ProposalQCComponent} from './proposal-qc/proposal-qc.component'
import{ProposalMakerComponent} from './proposal-maker/proposal-maker.component'
import { WelcomeKitPreparationComponent } from './welcome-kit-preparation/welcome-kit-preparation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WelcomeKitQCComponent } from './welcome-kit-qc/welcome-kit-qc.component';
import { DispatchInwardComponent } from './dispatch-inward/dispatch-inward.component';
import { DispatchToVendorComponent } from './dispatch-to-vendor/dispatch-to-vendor.component';
import { ScanningDoneComponent } from './scanning-done/scanning-done.component';
import { ScanningInwardComponent } from './scanning-inward/scanning-inward.component'; 

@NgModule({
  declarations: [ProposalQCComponent,ProposalMakerComponent, WelcomeKitPreparationComponent, WelcomeKitQCComponent, DispatchInwardComponent, DispatchToVendorComponent, ScanningDoneComponent, ScanningInwardComponent],
  imports: [
    CommonModule,
    DocketRoutingModule,
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
export class DocketModule { }
