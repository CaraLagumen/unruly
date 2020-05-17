import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import * as moment from "moment";

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
import {
  Scheduled,
  ScheduledData,
} from "../../shared/models/shift/scheduled.model";
import { WeeklyShift } from "../../shared/models/shift/weekly-shift.model";
import { WeeklyScheduled } from "../../shared/models/shift/weekly-scheduled.model";


@Component({
  selector: "app-editor-scheduled",
  templateUrl: "./editor-scheduled.component.html",
  styleUrls: ["./editor-scheduled.component.scss"],
})
export class EditorScheduledComponent implements OnInit, OnDestroy {
  private schedulerSub: Subscription;

  scheduler: Scheduler;
  employees$: Observable<Employee[]>;
  schedulers$: Observable<Scheduler[]>;
  shifts$: Observable<Shift[]>;
  scheduled$: Observable<Scheduled[]>;
  weeklyShifts$: Observable<WeeklyShift[]>;
  weeklyScheduled$: Observable<WeeklyScheduled[]>;
  createScheduledForm: FormGroup;

  shiftId = "";
  shiftDate = moment().format("YYYY-MM-DD");
  days = [
    `sunday`,
    `monday`,
    `tuesday`,
    `wednesday`,
    `thursday`,
    `friday`,
    `saturday`,
  ];

  constructor(
    private route: ActivatedRoute,
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

    this.shiftId = this.route.snapshot.paramMap.get("shiftId");
    this.shiftDate = moment(
      this.route.snapshot.paramMap.get("shiftDate")
    ).format("YYYY-MM-DD");

    this.initEditorScheduledForm();
  }

  initEditorScheduledForm() {
    //1. INITIALIZE SCHEDULED FORM
    this.createScheduledForm = new FormGroup({
      shiftControl: new FormControl(null),
      employeeControl: new FormControl(null),
      dateControl: new FormControl(null),
    });

    //2. EXPOSE SCHEDULED DATA IF ANY FOR DISPLAY AND PLUG IN
    //   EXISTING VALUES FOR FORM
    this.createScheduledForm.controls["shiftControl"].setValue(this.shiftId);
    this.createScheduledForm.controls["dateControl"].setValue(this.shiftDate);
  }

  onCreateScheduled() {
    if (this.createScheduledForm.invalid) return;

    const parsedDate = moment(
      this.createScheduledForm.value.dateControl
    ).toISOString();

    const scheduledData: ScheduledData = {
      shiftId: this.createScheduledForm.value.shiftControl,
      employeeId: this.createScheduledForm.value.employeeControl,
      date: parsedDate,
    };

    this.scheduledService.createScheduled(scheduledData).subscribe(() => {
      this.createScheduledForm.reset();
    });
  }

  onSelectShift(shift: Shift) {
    const selectedShiftId = shift.id;
    this.createScheduledForm.controls["shiftControl"].setValue(selectedShiftId);
  }

  onSelectEmployee(employee: Employee) {
    const selectedEmployeeId = employee.id;
    this.createScheduledForm.controls["employeeControl"].setValue(
      selectedEmployeeId
    );
  }

  ngOnDestroy() {
    if (this.schedulerSub) this.schedulerSub.unsubscribe();
  }
}
