import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";

import { CalendarService } from "../calendar.service";
import { Scheduled } from "../../shared/models/shift/scheduled.model";
import { Shift } from "../../shared/models/shift/shift.model";
import { Preferred } from "src/app/shared/models/shift/preferred.model";
import { CalendarItemEmit } from "../../shared/models/custom-types";

@Component({
  selector: "app-calendar-item",
  templateUrl: "./calendar-item.component.html",
  styleUrls: ["./calendar-item.component.scss"],
})
export class CalendarItemComponent implements OnInit {
  @Input() allShifts: Shift[];
  @Input() allScheduled: Scheduled[];
  @Input() allMyPreferred: Preferred[];
  @Input() day: moment.Moment;

  @Output() calendarItemEmitter = new EventEmitter<CalendarItemEmit>();
  @Output() myPreferredEmitter = new EventEmitter<Preferred>();

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

    return data[0];
  }

  isMyPreferredShift(shift: Shift): boolean {
    const data = this.calendarService.isMyPreferredShift(
      shift,
      this.allMyPreferred
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

  onMyPreferredEmitter(shift: Shift) {
    const data = this.calendarService.isMyPreferredShift(
      shift,
      this.allMyPreferred
    );

    this.myPreferredEmitter.emit(data[1]);
  }
}
