import { Component, Inject, OnInit, NgZone, PLATFORM_ID, ViewChild, TemplateRef } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
 import { Globalconstants } from "../../../Helper/globalconstants";
  import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
 import { FormGroup, FormBuilder, Validators } from "@angular/forms";

// Themes begin
am4core.useTheme(dataviz);
am4core.useTheme(am4themes_animated);
// Themes end


import { AxisRenderer } from '@amcharts/amcharts4/charts';

 

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.css"]
})




export class DashboardComponent implements OnInit {
  readonly DEFAULT_SLICE_STROKE_WIDTH: number = 0;
  readonly DEFAULT_SLICE_OPACITY: number = 1;
  readonly DEFAULT_ANIMATION_START_ANGLE: number = -90;
  readonly DEFAULT_ANIMATION_END_ANGLE: number = -90;
  private chart: am4charts.XYChart;
  downloadCount: any;
  displayStyle: string;
  type: any;
  constructor(
     private formBuilder: FormBuilder,
     private _onlineExamService: OnlineExamServiceService,
     private _global: Globalconstants,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId,
  ) {
     am4core.useTheme(am4themes_animated);}

     Checker:any;
     Deleted:any;
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
     _FilteredList:any;
     _IndexPendingList:any;
     first = 0;
  rows = 10;
  MakerUploaded:any;

     ngOnInit() {
   
  }
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
 

 

  closePopup() {
    this.displayStyle = "none";
  }

 

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
}



