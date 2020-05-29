import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { FormGroup, FormControl } from "@angular/forms";

import { UsersService } from "../../users/users.service";
import { ShiftService } from "../../shared/services/shift/shift.service";
import { WeeklyShiftService } from "../../shared/services/shift/weekly-shift.service";
import { CalendarService } from '../../calendar/calendar.service';
import { Scheduler } from "../../shared/models/users/scheduler.model";
import { Shift } from "../../shared/models/shift/shift.model";
import {
  WeeklyShift,
  WeeklyShiftData,
} from "../../shared/models/shift/weekly-shift.model";
import { ShiftProperties } from "../../shared/tools/custom-classes";

@Component({
  selector: "app-editor-shifts",
  templateUrl: "./editor-shifts.component.html",
  styleUrls: ["./editor-shifts.component.scss"],
})
export class EditorShiftsComponent implements OnInit, OnDestroy {
  private schedulerSub: Subscription;

  scheduler: Scheduler;
  shifts$: Observable<Shift[]>;
  weeklyShifts$: Observable<WeeklyShift[]>;
  createShiftForm: FormGroup;
  createWeeklyShiftForm: FormGroup;

  positions = ShiftProperties.positions;
  slots = ShiftProperties.slots;
  locations = ShiftProperties.locations;
  days = ShiftProperties.days;
  daysInWords = ShiftProperties.daysInWords;
  shiftHours = ShiftProperties.shiftHours;

  selectedShiftDayNumber: 1 | 2 | 3 | 4 | 5 = 1;

  constructor(
    private usersService: UsersService,
    private shiftService: ShiftService,
    private weeklyShiftService: WeeklyShiftService,
    private calendarService: CalendarService
  ) {}

  ngOnInit() {
    //1. GRAB DATA
    this.shifts$ = this.shiftService.getRawAllShifts();
    this.weeklyShifts$ = this.weeklyShiftService.getAllWeeklyShifts();

    //2. GRAB SCHEDULER ID
    this.schedulerSub = this.usersService
      .getUser(`scheduler`)
      .subscribe((schedulerData: Scheduler) => {
        this.scheduler = schedulerData;
      });

    //3. INIT FORMS
    this.initCreateShiftForm();
    this.initCreateWeeklyShiftForm();
  }

  //TOOLS----------------------------------------------------------

  getFormattedHour(hour: number) {
    return this.calendarService.getFormattedHour(hour);
  }

  onEditorShiftsControl(emittedData: [Shift | WeeklyShift, string]) {
    switch (emittedData[1]) {
      case `onSelectShift`:
        this.onSelectShift(emittedData[0] as Shift);
        break;
      case `onDeleteShift`:
        this.onDeleteShift(emittedData[0] as Shift);
        break;
      case `onSelectWeeklyShift`:
        this.onSelectWeeklyShift(emittedData[0] as WeeklyShift);
        break;
      case `onDeleteWeeklyShift`:
        this.onDeleteWeeklyShift(emittedData[0] as WeeklyShift);
        break;
    }
  }

  updateData(type: `shift` | `weeklyShift`) {
    switch (type) {
      case `shift`:
        return (this.shifts$ = this.shiftService.getRawAllShifts());
      case `weeklyShift`:
        return (this.weeklyShifts$ = this.weeklyShiftService.getAllWeeklyShifts());
    }
  }

  onSelectShift(shift: Shift) {
    this.createWeeklyShiftForm.controls[
      `shift${this.selectedShiftDayNumber}Control`
    ].setValue(shift.id);
  }

  onSelectWeeklyShift(weeklyShift: WeeklyShift) {
    this.createWeeklyShiftForm.controls[`nameControl`].setValue(
      weeklyShift.name
    );
    this.createWeeklyShiftForm.controls[`positionControl`].setValue(
      weeklyShift.position
    );
    this.createWeeklyShiftForm.controls[`slotControl`].setValue(
      weeklyShift.slot
    );
    this.createWeeklyShiftForm.controls[`locationControl`].setValue(
      weeklyShift.location
    );
    this.createWeeklyShiftForm.controls[`shift1Control`].setValue(
      weeklyShift.shiftDay1.id
    );
    this.createWeeklyShiftForm.controls[`shift2Control`].setValue(
      weeklyShift.shiftDay2.id
    );
    this.createWeeklyShiftForm.controls[`shift3Control`].setValue(
      weeklyShift.shiftDay3.id
    );
    this.createWeeklyShiftForm.controls[`shift4Control`].setValue(
      weeklyShift.shiftDay4.id
    );
    this.createWeeklyShiftForm.controls[`shift5Control`].setValue(
      weeklyShift.shiftDay5.id
    );
  }

  onDeleteShift(shift: Shift) {
    this.shiftService
      .deleteShift(shift.id)
      .subscribe(() => this.updateData(`shift`));
  }

  onDeleteWeeklyShift(weeklyShift: WeeklyShift) {
    this.weeklyShiftService
      .deleteWeeklyShift(weeklyShift.id)
      .subscribe(() => this.updateData(`weeklyShift`));
  }

  //FOR USE WITH WEEKLY SHIFT FORM
  onSelectShiftDayNumber(selectedNumber: 1 | 2 | 3 | 4 | 5) {
    this.selectedShiftDayNumber = selectedNumber;
  }

  //SINGLE SHIFT FORM----------------------------------------------------------

  initCreateShiftForm() {
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

    this.shiftService.createShift(shiftData).subscribe(() => {
      this.createShiftForm.reset();
      this.updateData(`shift`);
    });
  }

  //WEEKLY SHIFT FORM----------------------------------------------------------

  initCreateWeeklyShiftForm() {
    this.createWeeklyShiftForm = new FormGroup({
      nameControl: new FormControl(null),
      positionControl: new FormControl(null),
      slotControl: new FormControl(null),
      locationControl: new FormControl(null),
      shift1Control: new FormControl(null),
      shift2Control: new FormControl(null),
      shift3Control: new FormControl(null),
      shift4Control: new FormControl(null),
      shift5Control: new FormControl(null),
    });
  }

  onCreateWeeklyShift() {
    if (this.createWeeklyShiftForm.invalid) return;

    const weeklyShiftData: WeeklyShiftData = {
      name: this.createWeeklyShiftForm.value.nameControl,
      position: this.createWeeklyShiftForm.value.positionControl,
      slot: this.createWeeklyShiftForm.value.slotControl,
      location: this.createWeeklyShiftForm.value.locationControl,
      shiftDay1: this.createWeeklyShiftForm.value.shift1Control,
      shiftDay2: this.createWeeklyShiftForm.value.shift2Control,
      shiftDay3: this.createWeeklyShiftForm.value.shift3Control,
      shiftDay4: this.createWeeklyShiftForm.value.shift4Control,
      shiftDay5: this.createWeeklyShiftForm.value.shift5Control,
    };

    this.weeklyShiftService.createWeeklyShift(weeklyShiftData).subscribe(() => {
      this.createWeeklyShiftForm.reset();
      this.updateData(`weeklyShift`);
    });
  }

  ngOnDestroy() {
    if (this.schedulerSub) this.schedulerSub.unsubscribe();
  }
}
