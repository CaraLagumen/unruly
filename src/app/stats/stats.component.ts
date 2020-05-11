import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Employee } from "../shared/models/users/employee.model";
import { Scheduler } from "../shared/models/users/scheduler.model";
import { Shift } from "../shared/models/shift/shift.model";
import { EmployeeService } from "../shared/services/users/employee.service";
import { SchedulerService } from "../shared/services/users/scheduler.service";
import { ShiftService } from "../shared/services/shift/shift.service";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"],
})
export class StatsComponent implements OnInit {
  employees$: Observable<Employee[]>;
  schedulers$: Observable<Scheduler[]>;
  shifts$: Observable<Shift[]>;

  constructor(
    private employeeService: EmployeeService,
    private schedulerService: SchedulerService,
    private shiftService: ShiftService
  ) {}

  ngOnInit() {
    this.employees$ = this.employeeService.getAllEmployee();
    this.schedulers$ = this.schedulerService.getAllScheduler();
    this.shifts$ = this.shiftService.getRawAllShifts();
  }
}
