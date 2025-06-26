import { Routes } from "@angular/router";
import { DepartmentComponent } from "./department/department.component";
import { BranchMappingComponent } from './branch-mapping/branch-mapping.component';
import { BranchComponent } from "./branch/branch.component";
// import { RetrievalRequestComponent } from "../process/retrieval-request/retrieval-request.component";
// import { ApprovalComponent } from "../process/approval/approval.component";
// import { FileAcknowledgeComponent } from "../process/file-acknowledge/file-acknowledge.component";



export const DepartmentRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "BranchMaster",
        component: DepartmentComponent
      },
      {
        path: "folder-mapping",
        component: BranchMappingComponent
      },
      {
        path: "folder",
        component: BranchComponent
      }
      
      
    ]
  }
];
