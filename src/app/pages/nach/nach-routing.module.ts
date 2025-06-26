import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HandedOverToNachTeamComponent } from './handed-over-to-nach-team/handed-over-to-nach-team.component';
import { ReceivedByNachTeamComponent } from './received-by-nach-team/received-by-nach-team.component';
import { SendToBankerComponent } from './send-to-banker/send-to-banker.component';
import { StatusComponent } from './status/status.component';


const routes: Routes = [{
  path: "",
  children: [
    {
      path: "Handed-Over-To-Natch-Team",
      component:HandedOverToNachTeamComponent
    },
    {
      path: "Received-By-Natch-Team",
      component:ReceivedByNachTeamComponent
    },
    {
      path: "Send-To-Banker",
      component:SendToBankerComponent
    },
    {
      path: "Status",
      component:StatusComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NachRoutingModule { }
