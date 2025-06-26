import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-forbidden",
  templateUrl: "./forbidden.component.html"
})
export class ForbiddenComponent implements OnInit {
  test: Date = new Date();
  constructor() {}

  ngOnInit() {}
}
