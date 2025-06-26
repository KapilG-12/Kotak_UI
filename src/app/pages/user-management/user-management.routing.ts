import { Routes } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { RoleComponent } from "./role/role.component";
import { AddRoleComponent } from "./addrole/addrole.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { DocumentListComponent } from "./document-list/document-list.component";
import { CheckerComponent } from "./checker/checker.component";
import { CheckerRolesComponent } from "./checker-roles/checker-roles.component";
import { AddcheckerRolesComponent } from "./addchecker-roles/addchecker-roles.component";

export const UsersRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "users",
        component: UsersComponent
      },
      {
        path: "checker",
        component: CheckerComponent
      },
      {
        path: "roles",
        component: RoleComponent
      },
      {
        path: "change-password",
        component: ChangePasswordComponent
      },
      {
        path: "addrole",
        component: AddRoleComponent
      },
      {
        path: "document-list",
        component: DocumentListComponent
      },
      {
        path: "checker-roles",
        component: CheckerRolesComponent
      },
      {
        path: "addchecker-roles",
        component: AddcheckerRolesComponent
      }
      
    ]
  }
];
