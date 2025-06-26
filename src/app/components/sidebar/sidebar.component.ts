import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { OnlineExamServiceService } from 'src/app/Services/online-exam-service.service';
import { Globalconstants } from 'src/app/Helper/globalconstants';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonService } from "src/app/Services/common.service";


var misc: any = {
  sidebar_mini_active: false
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}


export let ROUTES: RouteInfo[] = []
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  AddRoleForm: FormGroup;

  public routes = []
  _PageList = []
  _RList = []
  get roles() {
    return this.AddRoleForm.get("Roles") as FormArray;
  }
  constructor(private router: Router, private _auth: AuthenticationService, private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService, private _global: Globalconstants, private _commonService: CommonService) { }

  ngOnInit() {
    this.AddRoleForm = this.formBuilder.group({
      roleName: ["", Validators.required],
      remarks: ["", Validators.required],
      Roles: this.formBuilder.array([]),
    });
    this.getPageList(this._auth.getUserInfo.tid)
    this.minimizeSidebar();
    this.onMouseLeaveSidenav();
    this.getRightList();
    this._onlineExamService.isRoleChanged.subscribe(res => {
      this.AddRoleForm.get("Roles") as FormArray;
      this.initializeRoutes();
      //console.log("Roles change timestamp: " + res);
    })
  }

  initializeRoutes() {
    this.routes = [];
    this.AddRoleForm.value.Roles.forEach(role => {
      if (role.isChecked || role.subItems.filter(el => el.isChecked).length > 0) {
        let route = this.getRoute(role.page_name);
        if (route && Object.keys(route).length !== 0) {
          route.ParentID = role.ParentID;
          route.ChildID = role.ChildID;
        }
        if (route) {
          role.subItems.forEach(subRoute => {
            if (subRoute.isChecked) {
              let matchedRoute = this.getRoute(subRoute.page_name);
              if (matchedRoute && Object.keys(matchedRoute).length !== 0) {
                matchedRoute.ParentID = subRoute.ParentID;
                matchedRoute.ChildID = subRoute.ChildID;
              }
              if (matchedRoute && route.children)
                route.children.push(matchedRoute);
            }
          });
        }
        this.routes.push(route)
      }
    });
    console.log('Routes', this.routes);
    this.routes.sort((a: any, b: any) => a.ParentID - b.ParentID);
    this.routes.map(route => {
      route.children.sort((a: any, b: any) => a.ChildID - b.ChildID);
    });
    this.menuItems = this.routes.filter(menuItem => menuItem);
    this._commonService.setMenuAccess(this.menuItems);
    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }

  getRoute(routeName: string): any {
    let route: any = {}
    //console.log(routeName);

    switch (routeName) {
      case "Dashboard": {
        route = {
          path: "/dashboards",
          title: "Dashboard",
          type: "sub",
          icontype: "ni-shop text-primary",
          isCollapsed: true,
          children: [
            { path: "dashboard", title: "dashboard", type: "link", ChildID: 0 },

          ]
        }
        break;
      }
      case "Userdashboard": {
        route = { path: "Userdashboard", title: "Userdashboard", type: "link" }
        break;
      }
      case "User Management": {
        route = {
          path: "/usermanagement",
          title: "User Management",
          type: "sub",
          icontype: "fa fa-users text-orange",
          isCollapsed: true,
          children: []
        }
        break;
      }
      case "Add User": {
        route = { path: "users", title: "Maker", type: "link" }
        break;
      }
      case "checker": {
        route = { path: "checker", title: "Checker", type: "link" }
        break;
      }

      case "Add Role": {
        route = { path: "roles", title: "Maker Roles", type: "link" }
        break;
      }
      case "Checker Role": {
        route = { path: "checker-roles", title: "Checker Roles", type: "link" }
        break;
      }
      // case "Change Password": {
      //   route = { path: "change-password", title: "change-password", type: "link" }
      //   break;
      // }

      case "Document list": {
        route = { path: "document-list", title: "Document list", type: "link" }
        break;
      }

      case "Upload": {
        route = {
          path: "/upload",
          title: "Upload",
          type: "sub",
          icontype: "fas fa-file-upload text-danger",
          isCollapsed: true,
          children: []
        }
        break;
      }




      case "Payment-Update": {
        // route.children.push({ path: "file-upload", title: "File Upload", type: "link" })
        route = { path: "Payment-Update", title: "Payment-Update", type: "link" }
        break;
      }
      case "Dumpupload": {
        // route.children.push({ path: "file-upload", title: "File Upload", type: "link" })
        route = { path: "Dumpupload", title: "Dump Upload", type: "link" }
        break;
      }
      case "Invupload": {
        // route.children.push({ path: "file-upload", title: "File Upload", type: "link" })
        route = { path: "Invupload", title: "Inv upload", type: "link" }
        break;
      }
    

      case "Master": {
        route = {
          path: "/master",
          title: "Masters",
          type: "sub",
          icontype: "fa fa-certificate text-danger",
          isCollapsed: true,
          children: [

          ]
        }
        break;
      }
      case "Branch Mapping": {
        route = { path: "folder-mapping", title: "Branch Mapping", type: "link" }
        break;
      }



      case "Docket": {
        route = {
          path: "/docket",
          title: "Docket",
          type: "sub",
          icontype: "fa fa-database text-pink",
          isCollapsed: true,
          children: [
          ]
        }
        break;
      }
      case "proposal-maker": {
        route = { path: "proposal-maker", title: "Proposal-maker", type: "link" }
        break;
      }
      case "Proposal-QC": {
        route = { path: "proposal-QC", title: "proposal-QC", type: "link" }
        break;
      }

      case "Welcome-Kit-Preparation": {
        route = { path: "Welcome-Kit-Preparation", title: "Welcome-Kit-Preparation", type: "link" }
        break;
      }
      case "Welcome-Kit-QC": {
        route = { path: "Welcome-Kit-QC", title: "Welcome-Kit-QC", type: "link" }
        break;
      }
      case "Scanning Inward": {
        route = { path: "Scanning-Inward", title: "Scanning Inward", type: "link" }
        break;
      }
      case "Scanning Done": {
        route = { path: "Scanning-Done", title: "Scanning Done", type: "link" }
        break;
      }
      case "Dispatch Inward": {
        route = { path: "Dispatch-Inward", title: "Dispatch Inward", type: "link" }
        break;
      }
      case "Dispatch To Vendor": {
        route = { path: "Dispatch-To-Vendor", title: "Dispatch To Vendor", type: "link" }
        break;
      }
      
      case "Process": {
        route = {
          path: "/process",
          title: "Process",
          type: "sub",
          icontype: "fa fa-database text-pink",
          isCollapsed: true,
          children: [

            //  {path: "Retrivalrequest", title: "Retrieval Request", type: "link", ChildID: 0 } //,
            //  {path: "HealthCheck", title: "Health Check", type: "link", ChildID: 0 },
            //  {path: "branch-inward", title: "Branch Inward", type: "link", ChildID: 0 }
          ]
        }
        break;
      }



      case "branch-inward": {
        route = { path: "branch-inward", title: "Branch Inward", type: "link" }
        break;
      }

      case "pod-entry": {
        route = { path: "pod-entry", title: "POD Entry", type: "link" }
        break;
      }

      case "pod-ack": {
        route = { path: "pod-ack", title: "POD Ack", type: "link" }
        break;
      }



      case "print-barcode": {
        route = { path: "printbarcode", title: "Print Barcode", type: "link" }
        break;
      }






      case "Ref": {
        route = {
          path: "/process",
          title: "Refilling",
          type: "sub",
          icontype: "fa fa-database text-pink",
          isCollapsed: true,
          children: [

            { path: "Refilling", title: "Refilling", type: "link", ChildID: 0 } //,
            //  {path: "HealthCheck", title: "Health Check", type: "link", ChildID: 0 },
            //  {path: "CheckerACK", title: "Checker", type: "link", ChildID: 0 }
          ]
        }
        break;
      }



      case "Search": {
        route = {
          path: "/search",
          title: "Search",
          type: "sub",
          icontype: "fa fa-search text-green",
          isCollapsed: true,
          children: [
            // { path: "advance-search", title: "Advanced Search", type: "link" },
             { path: "quick-search", title: "Quick Search", type: "link" },
            
          ]
        }
        break;
      }

      case "Report": {
        route = {
          path: "/report",
          title: "Reports",
          type: "sub",
          icontype: "fa fa-book text-default",
          isCollapsed: true,
          children: []
        }
        break;
      }
      // case "dump-report": {
      //   route = { path: "dump-report", title: "Dump Report", type: "link" }
      //   break;
      // }
      case "Log Repots": {
        route = { path: "log-repots", title: "Log Report", type: "link" }
        break;
      }

      case "KLAP": {
        route = {
          path: "/klap",
          title: "KLAP",
          type: "sub",
          icontype: "fa fa-database text-pink",
          isCollapsed: true,
          children: [

            //  {path: "Retrivalrequest", title: "Retrieval Request", type: "link", ChildID: 0 } //,
            //  {path: "HealthCheck", title: "Health Check", type: "link", ChildID: 0 },
            //  {path: "branch-inward", title: "Branch Inward", type: "link", ChildID: 0 }
          ]
        }
        break;
      }

      case "klap-audit":{
        route = { path: "klap-insertion-pending", title: "Klap Insertion Audit", type: "link" }
       break;
      }
//Klap-insertion-audit
      // case "KLAP Inward":{
      //   route = { path: "Klap-inward", title: "KLAP Inward", type: "link" }
      //  break;
      // }

      case "klap-branch-pending": {
        route = { path: "Klap-Branch-Pending", title: "KLAP Branch Pending", type: "link" }
        break;
      }



      case "Klap-audit-Pending": {
        route = { path: "Klap-audit-Pending", title: "Klap Audit Pending", type: "link" }
        break;
      }
      
      case "klap-Complete": {
        route = { path: "klap-Audit-Complete", title: "Klap Audit Complete", type: "link" }
        break;
      }


      case "Concurrent Audit": {
        route = {
          path: "/ConccurrentAudit",
          title: "Concurrent Audit",
          type: "sub",
          icontype: "fa fa-database text-pink",
          isCollapsed: true,
          children: [

            //  {path: "Retrivalrequest", title: "Retrieval Request", type: "link", ChildID: 0 } //,
            //  {path: "HealthCheck", title: "Health Check", type: "link", ChildID: 0 },
            //  {path: "branch-inward", title: "Branch Inward", type: "link", ChildID: 0 }
          ]
        }
        break;
      }

    

      case "File checking": {
        route = { path: "File-Checking", title: "File Checking", type: "link" }
        break;
      }
      case "Query updation": {
        route = { path: "Query-Updation", title: "Query Updation", type: "link" }
        break;
      }
      case "Query Closure": {
        route = { path: "Query-Closure", title: "Query Closure", type: "link" }
        break;
      }


      
      case "TWF": {
        route = {
          path: "/twf",
          title: "TWF",
          type: "sub",
          icontype: "fa fa-database text-pink",
          isCollapsed: true,
          children: [

            //  {path: "Retrivalrequest", title: "Retrieval Request", type: "link", ChildID: 0 } //,
            //  {path: "HealthCheck", title: "Health Check", type: "link", ChildID: 0 },
            //  {path: "branch-inward", title: "Branch Inward", type: "link", ChildID: 0 }
          ]
        }
        break;
      }

    

      case "CV Team": {
        route = { path: "CV-Team", title: "CV Team", type: "link" }
        break;
      }
      case "Repayment": {
        route = {
          path: "/Repayment",
          title: "Repayment",
          type: "sub",
          icontype: "fa fa-database text-pink",
          isCollapsed: true,
          children: [

            //  {path: "Retrivalrequest", title: "Retrieval Request", type: "link", ChildID: 0 } //,
            //  {path: "HealthCheck", title: "Health Check", type: "link", ChildID: 0 },
            //  {path: "branch-inward", title: "Branch Inward", type: "link", ChildID: 0 }
          ]
        }
        break;
      }
      case "SI Mandate send to RPC": {
        route = { path: "SI-Mandate-Send-To-RCP", title: "SI Mandate send to RPC", type: "link" }
        break;
      }
      case "Repayment Loading": {
        route = { path: "Repayment-Loading", title: "Repayment Loading", type: "link" }
        break;
      }
      case "Repayment QC": {
        route = { path: "Repayment-QC", title: "Repayment QC", type: "link" }
        break;
      }
      case "Dispatch to Vendor": {
        route = { path: "Dispatch-To-Vendor", title: "Dispatch to Vendor", type: "link" }
        break;
      }

      case "NACH": {
        route = {
          path: "/Natch",
          title: "Nach",
          type: "sub",
          icontype: "fa fa-database text-pink",
          isCollapsed: true,
          children: []
        }
        break;
      }
      case "Handed over to NACH Team": {
        route = { path: "Handed-Over-To-Natch-Team", title: "Handed Over To Nach Team", type: "link" }
        break;
      }
      case "Received by Nach Team": {
        route = { path: "Received-By-Natch-Team", title: "Received By Nach Team", type: "link" }
        break;
      }
      case "Send to Banker": {
        route = { path: "Send-To-Banker", title: "Send To Banker", type: "link" }
        break;
      }
      case "Status": {
        route = { path: "Status", title: "Status", type: "link" }
        break;
      }
     
      




      default: { route = null }
    }
    return route
  }

  getPageList(TID: number) {
    const apiUrl =
      this._global.baseAPIUrl +
      "Role/GetPageList?ID=" +
      Number(localStorage.getItem('sysRoleID')) +
      "&user_Token=" + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: []) => {

      this._PageList = data;
      this._PageList.forEach((item) => {
        if (item.parent_id == 0) {
          item.subItem = [];
          let fg = this.formBuilder.group({
            page_name: [item.page_name],
            isChecked: [item.isChecked],
            subItems: this.formBuilder.array([]),
            id: [item.id],
            parent_id: [item.parent_id],
            ParentID: [item.ParentID],
            ChildID: [item.ChildID]
          });
          this.roles.push(fg);
        }
      });

      this._PageList.forEach((item) => {
        if (item.parent_id && item.parent_id != 0) {
          let found = this.roles.controls.find(
            (ctrl) => ctrl.get("id").value == item.parent_id
          );
          if (found) {
            let fg = this.formBuilder.group({
              page_name: [item.page_name],
              isChecked: [item.isChecked],
              subItems: [[]],
              id: [item.id],
              parent_id: [item.parent_id],
              ParentID: [item.ParentID],
              ChildID: [item.ChildID]
            });
            let subItems = found.get("subItems") as FormArray;
            subItems.push(fg);
          }
        }
      });
      this.initializeRoutes()
    });
  }

  getRightList() {
    const apiUrl =
      this._global.baseAPIUrl +
      "Role/GetRightList?ID=" +
      Number(localStorage.getItem('sysRoleID')) +
      "&user_Token=" + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: []) => {
      this._RList = data;
      localStorage.setItem('Download', "0");
      localStorage.setItem('Delete', "0");
      localStorage.setItem('Email', "0");
      localStorage.setItem('Link', "0");
      localStorage.setItem('Edit', "0");
      localStorage.setItem('Document View', "0");

      this._RList.forEach((item) => {
        if (item.page_right == "Download") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Download', item.isChecked);
        }
        if (item.page_right == "Delete") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Delete', item.isChecked);
        }
        if (item.page_right == "Link") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Link', item.isChecked);
        }
        if (item.page_right == "Email") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Email', item.isChecked);
        }
        if (item.page_right == "Edit") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Edit', item.isChecked);
        }
        if (item.page_right == "Document View") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Document View', item.isChecked);
        }
      });
      this._commonService.setRightList(this._RList);
    });
  }

  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {

    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }
  minimizeSidebar() {

    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }
}
