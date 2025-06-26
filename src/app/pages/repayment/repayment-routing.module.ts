import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiMandateSendToRcpComponent } from './si-mandate-send-to-rcp/si-mandate-send-to-rcp.component';
import { RepaymentLoadingComponent } from './repayment-loading/repayment-loading.component';
import { RepaymentQcComponent } from './repayment-qc/repayment-qc.component';
import { DispatchToVendorComponent } from './dispatch-to-vendor/dispatch-to-vendor.component';

const routes: Routes = [{
  path: "",
  children: [
    {
      path: "SI-Mandate-Send-To-RCP",
      component: SiMandateSendToRcpComponent
    },
    {
      path: "Repayment-Loading",
      component: RepaymentLoadingComponent
    },
    {
      path: "Repayment-QC",
      component: RepaymentQcComponent
    },
    {
      path: "Dispatch-To-Vendor",
      component: DispatchToVendorComponent
    },
   
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepaymentRoutingModule { }
