import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";

import { CalendarService } from "../calendar.service";
import { Scheduled } from "../../shared/models/shift/scheduled.model";
import { Shift } from "../../shared/models/shift/shift.model";
import { Preferred } from "../../shared/models/shift/preferred.model";
import { Vacation } from "../../shared/models/shift/vacation.model";
import {
  CalendarItemEmit,
  EmployeeOptions,
} from "../../shared/models/custom-types";

@Component({
  selector: "app-calendar-item",
  templateUrl: "./calendar-item.component.html",
  styleUrls: ["./calendar-item.component.scss"],
})
export class CalendarItemComponent implements OnInit {
  @Input() employeeId: string;
  @Input() allShifts: Shift[];
  @Input() allScheduled: Scheduled[];
  @Input() allMyPreferred: Preferred[];
  @Input() allMyVacations: Vacation[];
  @Input() day: moment.Moment;

  @Output() calendarItemEmitter = new EventEmitter<CalendarItemEmit>();
  @Output() employeeOptionsEmitter = new EventEmitter<EmployeeOptions>();

  shiftsOfTheDay: Shift[] = [];
  isMyScheduled = false;

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.addShiftsOfTheDay();
  }

  getFormattedHour(hour: number) {
    return this.calendarService.getFormattedHour(hour);
  }

  getFormattedLocation(location: string) {
    return this.calendarService.getFormattedLocation(location);
  }

  addShiftsOfTheDay() {
    this.shiftsOfTheDay = this.calendarService.addShiftsOfTheDay(
      this.day,
      this.allShifts
    );
  }

  isScheduledShift(shift: Shift): boolean {
    const data = this.calendarService.isScheduledShift(
      shift,
      this.allScheduled,
      this.day
    );

    if (data[1]) {
      if (data[1].employee.id === this.employeeId) {
        this.isMyScheduled = true;
      } else {
        this.isMyScheduled = false;
      }
    }

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
