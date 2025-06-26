import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourierAckComponent } from './courier-ack/courier-ack.component';
import { FileInwardComponent } from './file-inward/file-inward.component';
import { CVTeamComponent } from './cvteam/cvteam.component';
const routes: Routes = [{
  path: "",
  children: [
    // {
    //   path: "Courier-Ack",
    //   component: CourierAckComponent
    // },
    // {
    //   path: "File-Inward",
    //   component: FileInwardComponent
    // },
    {
      path: "CV-Team",
      component: CVTeamComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TWFRoutingModule { }
