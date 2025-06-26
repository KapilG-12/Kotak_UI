import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileCheckingComponent } from './file-checking/file-checking.component';
import { QueryUpdationComponent } from './query-updation/query-updation.component';
import { QueryClosureComponent } from './query-closure/query-closure.component';
const routes: Routes = [{
  path: "",
  children: [
    {
      path: "File-Checking",
      component: FileCheckingComponent
    },
    {
      path: "Query-Updation",
      component: QueryUpdationComponent
    },
    {
      path: "Query-Closure",
      component: QueryClosureComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConccurrentAuditRoutingModule { }
