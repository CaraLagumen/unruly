import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { EmployeeService } from "../../shared/services/users/employee.service";
import { SchedulerService } from "../../shared/services/users/scheduler.service";
import { Employee } from "../../shared/models/users/employee.model";
import { Scheduler } from "../../shared/models/users/scheduler.model";
import { ShiftProperties } from "../../shared/tools/custom-classes";

@Component({
  selector: "app-roster",
  templateUrl: "./roster.component.html",
  styleUrls: ["./roster.component.scss"],
})
export class RosterComponent implements OnInit {
  employees$: Observable<Employee[]>;
  schedulers$: Observable<Scheduler[]>;

  days = ShiftProperties.daysInWords;
  employeeId = ``;

  constructor(
    private employeeService: EmployeeService,
    private schedulerService: SchedulerService
  ) {}

  ngOnInit() {
    //1. GRAB DATA
    this.employees$ = this.employeeService.getAllEmployees();
    this.schedulers$ = this.schedulerService.getAllScheduler();

    //2. SETUP HIGHLIGHTED EMPLOYEE IF LOGGED IN
    if (localStorage.getItem(`userType`) === `employee`)
      this.employeeId = localStorage.getItem(`userId`);
  }

  getEmployeeLoggedInStyle(employeeId: string, type: `item` | `guide`) {
    if (this.employeeId === employeeId && type === `item`)
      return {
        position: "relative",
        "z-index": 1000,
        "background-color": "var(--color-white)",
        color: "var(--color-blue)",
      };

    if (this.employeeId === employeeId && type === `guide`)
      return {
        position: "absolute",
        left: 0,
        transform: "translateY(-2rem)",
        height: "2rem",
        width: "100%",
        "background-color": "var(--color-white)",
      };
  }
}
