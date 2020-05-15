import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { Employee } from "../../shared/models/users/employee.model";
import { Scheduler } from "../../shared/models/users/scheduler.model";
import { EmployeeService } from "../../shared/services/users/employee.service";
import { SchedulerService } from "../../shared/services/users/scheduler.service";

@Component({
  selector: "app-roster",
  templateUrl: "./roster.component.html",
  styleUrls: ["./roster.component.scss"],
})
export class RosterComponent implements OnInit {
  employees$: Observable<Employee[]>;
  schedulers$: Observable<Scheduler[]>;

  constructor(
    private employeeService: EmployeeService,
    private schedulerService: SchedulerService
  ) {}

  ngOnInit() {
    this.employees$ = this.employeeService.getAllEmployees();
    this.schedulers$ = this.schedulerService.getAllScheduler();
  }
}
