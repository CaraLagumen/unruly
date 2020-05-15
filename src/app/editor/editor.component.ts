import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { EmployeeService } from "../shared/services/users/employee.service";
import { SchedulerService } from "../shared/services/users/scheduler.service";
import { ShiftService } from "../shared/services/shift/shift.service";
import { ScheduledService } from "../shared/services/shift/scheduled.service";
import { WeeklyShiftService } from "../shared/services/shift/weekly-shift.service";
import { WeeklyScheduledService } from "../shared/services/shift/weekly-scheduled.service";
import { Employee } from "../shared/models/users/employee.model";
import { Scheduler } from "../shared/models/users/scheduler.model";
import { Shift } from "../shared/models/shift/shift.model";
import { Scheduled } from "../shared/models/shift/scheduled.model";
import { WeeklyShift } from "../shared/models/shift/weekly-shift.model";
import { WeeklyScheduled } from "../shared/models/shift/weekly-scheduled.model";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
  employees$: Observable<Employee[]>;
  schedulers$: Observable<Scheduler[]>;
  shifts$: Observable<Shift[]>;
  scheduled$: Observable<Scheduled[]>;
  weeklyShifts$: Observable<WeeklyShift[]>;
  weeklyScheduled$: Observable<WeeklyScheduled[]>;

  constructor(
    private employeeService: EmployeeService,
    private schedulerService: SchedulerService,
    private shiftService: ShiftService,
    private scheduledService: ScheduledService,
    private weeklyShiftService: WeeklyShiftService,
    private weeklyScheduledService: WeeklyScheduledService
  ) {}

  ngOnInit() {
    this.employees$ = this.employeeService.getAllEmployees();
    this.schedulers$ = this.schedulerService.getAllScheduler();
    this.shifts$ = this.shiftService.getRawAllShifts();
    this.scheduled$ = this.scheduledService.getRawAllScheduled();
    this.weeklyShifts$ = this.weeklyShiftService.getAllWeeklyShifts();
    this.weeklyScheduled$ = this.weeklyScheduledService.getAllWeeklyScheduled();
  }
}
