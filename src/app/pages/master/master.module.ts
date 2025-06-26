import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { BsDropdownModule } from "ngx-bootstrap";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
// import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';
import { DepartmentComponent } from "./department/department.component";
import { BranchMappingComponent } from "./branch-mapping/branch-mapping.component";
import { RouterModule } from "@angular/router";''
import { DepartmentRoutes } from "./master.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BranchComponent } from "./branch/branch.component"; 
import { TableModule } from 'primeng/table';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
// import { FileAcknowledgeComponent } from '../process/file-acknowledge/file-acknowledge.component';


@NgModule({
  declarations: [DepartmentComponent,BranchMappingComponent,BranchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DepartmentRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    MatIconModule,
    MatMenuModule,
    // NgxPrintModule,
    TableModule
  ]
})
export class MasterModule {}
