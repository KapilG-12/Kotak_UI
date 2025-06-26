import { Routes } from "@angular/router";
import { RetrievalreportComponent } from "./retrieval-report/retrieval-report.component";
import { RefillingreportComponent } from "./refilling-report/refilling-report.component";
import { OutreportComponent } from "./out-report/out-report.component";
import { DumpreportComponent } from "./dump-report/dump-report.component";
import { LogRepotsComponent } from "./log-repots/log-repots.component";


export const reportRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "retrieval-report",
        component: RetrievalreportComponent
      },
      {
        path: "refilling-report",
        component: RefillingreportComponent
      }
      ,
      {
        path: "out-report",
        component: OutreportComponent
      }
      ,
      {
        path: "dump-report",
        component: DumpreportComponent
      }
      ,
      {
        path: "log-repots",
        component: LogRepotsComponent
      }
    ]
  }
];
