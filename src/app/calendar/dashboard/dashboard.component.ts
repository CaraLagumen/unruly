import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @Input() employeeIsAuth;
  @Input() schedulerIsAuth;

  @Output() schedulerEmitter = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  schedulerEmitterButton(type) {
    this.schedulerEmitter.emit(type);
  }
}
