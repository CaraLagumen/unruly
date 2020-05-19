import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";

import { CalendarService } from "../../calendar.service";
import { Scheduled } from "../../../shared/models/shift/scheduled.model";
import { Shift } from "../../../shared/models/shift/shift.model";
import { Preferred } from "../../../shared/models/shift/preferred.model";
import { Vacation } from "../../../shared/models/shift/vacation.model";
import {
  CalendarItemEmit,
  EmployeeOptions,
} from "../../../shared/models/custom-types";

@Component({
  selector: "app-day-item",
  templateUrl: "./day-item.component.html",
  styleUrls: ["./day-item.component.scss"],
})
export class DayItemComponent implements OnInit {
  @Input() allShifts: Shift[];
  @Input() allScheduled: Scheduled[];
  @Input() allMyPreferred: Preferred[];
  @Input() allMyVacations: Vacation[];
  @Input() day: moment.Moment;

  @Output() calendarItemEmitter = new EventEmitter<CalendarItemEmit>();
  @Output() employeeOptionsEmitter = new EventEmitter<EmployeeOptions>();

  scheduled: Scheduled;

  shiftsOfTheDay: Shift[] = [];

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    //1. POPULATE SHIFTS OF THE DAY
    this.addShiftsOfTheDay();

    //2. SORT THE SHIFTS FROM SHIFT START
    this.shiftsOfTheDay.sort(
      (x: Shift, y: Shift) => x.shiftStart[0] - y.shiftStart[0]
    );
  }

  getLocationStyle(shift) {
    switch (shift.location) {
      case `rotunda`:
        return { "grid-column": "1 / 2" };
      case `food court`:
        return { "grid-column": "2 / 3" };
      case `tower 1`:
      case `tower 2`:
      case `breaker`:
        return { "grid-column": "3 / 4" };
      case `pool`:
        return { "grid-column": "4 / 5" };
    }
  }

  addShiftsOfTheDay() {
    this.shiftsOfTheDay = this.calendarService.addShiftsOfTheDay(
      this.day,
      this.allShifts
    );
  }

  isScheduledShift(shift): boolean {
    const data = this.calendarService.isScheduledShift(
      shift,
      this.allScheduled,
      this.day
    );
    this.scheduled = data[1];

    return data[0];
  }

  isMyPreferredShift(shift: Shift): boolean {
    const data = this.calendarService.isMyPreferredShift(
      shift,
      this.allMyPreferred
    );

    return data[0];
  }

  isMyVacationDay() {
    const data = this.calendarService.isMyVacationDay(
      this.allMyVacations,
      this.day
    );

    return data[0];
  }

  onCalendarItemEmitter(shift: Shift) {
    const data = this.calendarService.isScheduledShift(
      shift,
      this.allScheduled,
      this.day
    );

    this.calendarItemEmitter.emit([shift, data[1], data[2]]);
  }

  onEmployeeOptionsEmitter(shift: Shift) {
    //1. GRAB DATA
    const preferred = this.calendarService.isMyPreferredShift(
      shift,
      this.allMyPreferred
    );
    const vacation = this.calendarService.isMyVacationDay(
      this.allMyVacations,
      this.day
    );

    //2. EMIT WITH VACATION IF ANY
    if (vacation[1]) {
      this.employeeOptionsEmitter.emit([preferred[1], vacation[1]]);
    } else {
      //3. EMIT WITH A DUMMY VACATION FOR REQUEST IF WANTED
      this.employeeOptionsEmitter.emit([
        preferred[1],
        { date: this.day.toDate() },
      ]);
    }
  }
}
