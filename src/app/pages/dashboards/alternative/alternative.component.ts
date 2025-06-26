import { Component, OnInit, OnDestroy } from "@angular/core";
import Chart from "chart.js";


@Component({
  selector: "app-alternative",
  templateUrl: "alternative.component.html"
})
export class AlternativeComponent implements OnInit, OnDestroy {
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  constructor() {}

  ngOnInit() {
  
  }

  ngOnDestroy() {
    var navbar = document.getElementsByClassName("navbar-top")[0];
    navbar.classList.remove("bg-secondary");
    navbar.classList.remove("navbar-light");
    navbar.classList.add("bg-danger");
    navbar.classList.add("navbar-dark");

    var navbarSearch = document.getElementsByClassName("navbar-search")[0];
    navbarSearch.classList.remove("navbar-search-dark");
    navbarSearch.classList.add("navbar-search-light");
  }
} 
