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
import {
  WeeklyScheduled,
  WeeklyScheduledData,
} from "../../shared/models/shift/weekly-scheduled.model";
import { ShiftProperties } from "../../shared/tools/custom-classes";

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
  createWeeklyScheduledForm: FormGroup;

  selectedFormForEmployee: `scheduled` | `weeklyScheduled` = `scheduled`;

  shiftId = "";
  shiftDate = moment().format("YYYY-MM-DD");
  days = ShiftProperties.days;

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
    //1. GRAB DATA
    this.employees$ = this.employeeService.getAllEmployees();
    this.schedulers$ = this.schedulerService.getAllScheduler();
    this.shifts$ = this.shiftService.getRawAllShifts();
    this.scheduled$ = this.scheduledService.getRawAllScheduled();
    this.weeklyShifts$ = this.weeklyShiftService.getAllWeeklyShifts();
    this.weeklyScheduled$ = this.weeklyScheduledService.getAllWeeklyScheduled();

    //2. GRAB SCHEDULER ID
    this.schedulerSub = this.usersService
      .getUser(`scheduler`)
      .subscribe((schedulerData: Scheduler) => {
        this.scheduler = schedulerData;
      });

    //3. GRAB SHIFT ID IF REROUTED FROM dashboard
    this.shiftId = this.route.snapshot.paramMap.get("shiftId");
    this.shiftDate = moment(
      this.route.snapshot.paramMap.get("shiftDate")
    ).format("YYYY-MM-DD");

    //2. INIT FORMS
    this.initCreateScheduledForm();
    this.initCreateWeeklyScheduledForm();
  }

  //TOOLS----------------------------------------------------------

  onEditorScheduledControl(
    emittedData: [Shift | WeeklyShift | Employee, string]
  ) {
    switch (emittedData[1]) {
      case `onSelectShift`:
        this.onSelectShift(emittedData[0] as Shift);
        break;
      case `onSelectWeeklyShift`:
        this.onSelectWeeklyShift(emittedData[0] as WeeklyShift);
        break;
      case `onSelectEmployee`:
        this.onSelectEmployee(emittedData[0] as Employee);
        break;
    }
  }

  updateData(type: `scheduled` | `weeklyScheduled`) {
    if (type === `scheduled`)
      this.scheduled$ = this.scheduledService.getRawAllScheduled();
    if (type === `weeklyScheduled`)
      this.weeklyScheduled$ = this.weeklyScheduledService.getAllWeeklyScheduled();
  }

  onSelectShift(shift: Shift) {
    this.createScheduledForm.controls["shiftControl"].setValue(shift.id);
  }

  onSelectWeeklyShift(weeklyShift: WeeklyShift) {
    this.createWeeklyScheduledForm.controls["weeklyShiftControl"].setValue(
      weeklyShift.id
    );
  }

  onSelectEmployee(employee: Employee) {
    switch (this.selectedFormForEmployee) {
      case `scheduled`:
        this.createScheduledForm.controls["employeeControl"].setValue(
          employee.id
        );
        break;
      case `weeklyScheduled`:
        this.createWeeklyScheduledForm.controls["employeeControl"].setValue(
          employee.id
        );
        break;
    }
  }

  onSelectFormForEmployee(form: `scheduled` | `weeklyScheduled`) {
    this.selectedFormForEmployee = form;
  }

  //SCHEDULED FORM----------------------------------------------------------

  initCreateScheduledForm() {
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
      shift: this.createScheduledForm.value.shiftControl,
      employee: this.createScheduledForm.value.employeeControl,
      date: parsedDate,
    };

    this.scheduledService.createScheduled(scheduledData).subscribe(() => {
      this.createScheduledForm.reset();
      this.updateData(`scheduled`);
    });
  }

  //WEEKLY SCHEDULED FORM----------------------------------------------------------

  initCreateWeeklyScheduledForm() {
    //1. INITIALIZE SCHEDULED FORM
    this.createWeeklyScheduledForm = new FormGroup({
      employeeControl: new FormControl(null),
      weeklyShiftControl: new FormControl(null),
      startDateControl: new FormControl(null),
    });
  }

  onCreateWeeklyScheduled() {
    if (this.createWeeklyScheduledForm.invalid) return;

    const parsedDate = moment(
      this.createWeeklyScheduledForm.value.startDateControl
    ).toISOString();

    const weeklyScheduledData: WeeklyScheduledData = {
      employee: this.createWeeklyScheduledForm.value.employeeControl,
      weeklyShift: this.createWeeklyScheduledForm.value.weeklyShiftControl,
      startDate: parsedDate,
    };

    this.weeklyScheduledService
      .createWeeklyScheduled(weeklyScheduledData)
      .subscribe(() => {
        this.createWeeklyScheduledForm.reset();
        this.updateData(`weeklyScheduled`);
      });
  }

  ngOnDestroy() {
    if (this.schedulerSub) this.schedulerSub.unsubscribe();
  }
}
