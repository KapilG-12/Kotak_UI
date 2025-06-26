import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalQCComponent } from './proposal-qc/proposal-qc.component';
import { ProposalMakerComponent } from './proposal-maker/proposal-maker.component';
import { WelcomeKitPreparationComponent } from './welcome-kit-preparation/welcome-kit-preparation.component';
import { WelcomeKitQCComponent } from './welcome-kit-qc/welcome-kit-qc.component';
import { DispatchInwardComponent } from './dispatch-inward/dispatch-inward.component';
import { DispatchToVendorComponent } from './dispatch-to-vendor/dispatch-to-vendor.component';
import { ScanningDoneComponent } from './scanning-done/scanning-done.component';
import { ScanningInwardComponent } from './scanning-inward/scanning-inward.component';
const routes: Routes = [{
  path: "",
  children: [
    {
      path: "proposal-QC",
      component: ProposalQCComponent
    },
    {
      path: "proposal-maker",
      component: ProposalMakerComponent
    },
    {
      path: "Welcome-Kit-Preparation",
      component: WelcomeKitPreparationComponent
    },
    {
      path: "Welcome-Kit-QC",
      component: WelcomeKitQCComponent
    },
    {
      path: "Dispatch-Inward",
      component: DispatchInwardComponent
    },
    {
      path: "Dispatch-To-Vendor",
      component: DispatchToVendorComponent
    },
    {
      path: "Scanning-Done",
      component: ScanningDoneComponent
    },
    {
      path: "Scanning-Inward",
      component: ScanningInwardComponent
    },
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocketRoutingModule { }
