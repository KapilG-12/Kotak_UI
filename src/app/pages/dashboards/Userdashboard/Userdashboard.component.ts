import { Component, OnInit, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

//import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
//import { Label } from 'ng2-charts';

// Themes begin
am4core.useTheme(dataviz);
am4core.useTheme(am4themes_animated);
// Themes end


import { AxisRenderer } from '@amcharts/amcharts4/charts';
import { any } from "@amcharts/amcharts4/.internal/core/utils/Array";

@Component({
  selector: "app-dashboard",
  templateUrl: "Userdashboard.component.html",
  styleUrls: ["Userdashboard.component.css"]
})

export class UserdashboardComponent implements OnInit {
  public datasets: any;
  public data: any;
  public salesChart;

  public clicked: boolean = true;
  public clicked1: boolean = false;
  public chartFirst: any;
  public chartFirstFU: any;
  public chartActivity: any;
  public updateActivityChartInterval;

  first = 0;
  rows = 10;
  _FilteredList:any;
  _IndexPendingList:any;
  activeRow: any;
  UserID:any;
  UserDashboardForm: FormGroup;   
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _StatusList :any; 
  _LogList :any; 
  DatauploadCount:0;
  TaggingCount:0;
  FileUploadCount:0;
  UserCount:0;
  _ActivityList :any;
  activityChartData:any;
  firstChartData:any;
  firstChartDataFU:any;
  _UserL:any;  
  _UploadList:any;
  _ActivityLog:any;
  activitylogChartData:any;
  chartActivityLog:any;
  Checker:any;
  Deleted:any;
  View:any;
  DeleteLastWeek:any;
  DeleteTillDate:any;
  DOCFIles:any;
  EmailNotSent:number=10;
  EmailSent:number=25;
  Favourite:any;
  FileSize:number=45;
  Folder:any;
  JPGFIles:any;
  LoginLastWeek:any;
  LoginTillDate:any;
  Maker:any;
  Email:any;
  Metadata:any;
  OCRFilesInProcess:any;
  OCRFilesConverted:any;
  PageCount:any;
  PDFFIles:any;
  Reject:any;
  Searched:any;
  TotalFiles:any;
  TotalSize:number=200;
  User:any;
  WithData:any;
  Viewed:any;
  WithoutData:any;
  XLSFIles:any;
  displayStyle: string;
  type: any;
  Download:any;
  MakerUploaded:any;
  constructor(
     private formBuilder: FormBuilder,
     private _onlineExamService: OnlineExamServiceService,
     private _global: Globalconstants,
    private zone: NgZone
  ) { }

  ngOnInit() {

     this.UserDashboardForm = this.formBuilder.group({
       BranchName: ['', Validators.required],
      User_Token:localStorage.getItem('User_Token'),
      UserID:[0, Validators.required],
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0]
     });
   //  this.geBranchList();

 

  }
 
  ngOnDestroy() {  

  } 

   paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }




}
