import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { FormGroup, FormControl } from "@angular/forms";

import { UsersService } from "../../users/users.service";
import { EmployeeService } from "../../shared/services/users/employee.service";
import { SchedulerService } from "../../shared/services/users/scheduler.service";
import { ShiftService } from "../../shared/services/shift/shift.service";
import { ScheduledService } from "../../shared/services/shift/scheduled.service";
import { WeeklyShiftService } from "../../shared/services/shift/weekly-shift.service";
import { WeeklyScheduledService } from "../../shared/services/shift/weekly-scheduled.service";
import { Employee } from "../../shared/models/users/employee.model";
import { Scheduler } from "../../shared/models/users/scheduler.model";
import { Shift } from "../../shared/models/shift/shift.model";
import { Scheduled } from "../../shared/models/shift/scheduled.model";
import { WeeklyShift } from "../../shared/models/shift/weekly-shift.model";
import { WeeklyScheduled } from "../../shared/models/shift/weekly-scheduled.model";
import { ShiftProperties } from "../../shared/tools/custom-classes";

@Component({
  selector: "app-editor-shifts",
  templateUrl: "./editor-shifts.component.html",
  styleUrls: ["./editor-shifts.component.scss"],
})
export class EditorShiftsComponent implements OnInit, OnDestroy {
  private schedulerSub: Subscription;

  scheduler: Scheduler;
  employees$: Observable<Employee[]>;
  schedulers$: Observable<Scheduler[]>;
  shifts$: Observable<Shift[]>;
  scheduled$: Observable<Scheduled[]>;
  weeklyShifts$: Observable<WeeklyShift[]>;
  weeklyScheduled$: Observable<WeeklyScheduled[]>;
  createShiftForm: FormGroup;

  positions = ShiftProperties.positions;
  slots = ShiftProperties.slots;
  locations = ShiftProperties.locations;
  days = ShiftProperties.days;
  shiftHours = ShiftProperties.shiftHours;

  constructor(
    private usersService: UsersService,
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

    this.schedulerSub = this.usersService
      .getUser(`scheduler`)
      .subscribe((schedulerData: Scheduler) => {
        this.scheduler = schedulerData;
      });

    this.initCreateShiftForm();
  }

  initCreateShiftForm() {
    //1. INITIALIZE SHIFT FORM
    this.createShiftForm = new FormGroup({
      positionControl: new FormControl(null),
      slotControl: new FormControl(null),
      locationControl: new FormControl(null),
      dayControl: new FormControl(null),
      shiftStartControl: new FormControl(null),
      shiftEndControl: new FormControl(null),
    });
  }

  onCreateShift() {
    if (this.createShiftForm.invalid) return;

    const shiftData: Shift = {
      position: this.createShiftForm.value.positionControl,
      slot: this.createShiftForm.value.slotControl,
      location: this.createShiftForm.value.locationControl,
      day: this.createShiftForm.value.dayControl,
      shiftStart: [this.createShiftForm.value.shiftStartControl, 0],
      shiftEnd: [this.createShiftForm.value.shiftEndControl, 0],
    };

    this.shiftService
      .createShift(shiftData)
      .subscribe(() => this.createShiftForm.reset());
  }

  ngOnDestroy() {
    if (this.schedulerSub) this.schedulerSub.unsubscribe();
  }
}
