import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { BsDropdownModule, BsDatepickerModule } from "ngx-bootstrap";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
// import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from "@angular/router";
import { reportRoutes } from "./report.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { TableModule } from 'primeng/table';
import { RetrievalreportComponent } from "./retrieval-report/retrieval-report.component";
import { RefillingreportComponent } from "./refilling-report/refilling-report.component";
import { OutreportComponent } from "./out-report/out-report.component";
import { DumpreportComponent } from "./dump-report/dump-report.component";
import { LogRepotsComponent } from './log-repots/log-repots.component';




@NgModule({
  declarations: [RetrievalreportComponent,RefillingreportComponent,OutreportComponent,DumpreportComponent, LogRepotsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(reportRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    // NgxPrintModule,
    TableModule,
  ]
})
export class ReportModule {}
