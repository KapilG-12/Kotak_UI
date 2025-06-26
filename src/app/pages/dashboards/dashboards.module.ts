import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UserdashboardComponent } from "./Userdashboard/Userdashboard.component";
import { AlternativeComponent } from "./alternative/alternative.component";
import { RouterModule } from "@angular/router";
import { DashboardsRoutes } from "./dashboards.routing";
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [DashboardComponent, AlternativeComponent,UserdashboardComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forChild(DashboardsRoutes),
    NgxChartsModule,
    TableModule
   // BrowserAnimationsModule
  ],
  exports: [DashboardComponent, AlternativeComponent]
})
export class DashboardsModule {}
