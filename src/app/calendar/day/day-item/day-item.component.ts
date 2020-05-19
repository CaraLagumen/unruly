import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";

import { CalendarService } from "../../calendar.service";
import { Shift } from "../../../shared/models/shift/shift.model";
import { Scheduled } from "../../../shared/models/shift/scheduled.model";
import { CalendarItemEmit } from "../../../shared/models/custom-types";

@Component({
  selector: "app-day-item",
  templateUrl: "./day-item.component.html",
  styleUrls: ["./day-item.component.scss"],
})
export class DayItemComponent implements OnInit {
  @Input() allShifts: Shift[];
  @Input() allScheduled: Scheduled[];
  @Input() day: moment.Moment;

  @Output() calendarItemEmitter = new EventEmitter<CalendarItemEmit>();

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

  onCalendarItemEmitter(shift: Shift) {
    const data = this.calendarService.isScheduledShift(
      shift,
      this.allScheduled,
      this.day
    );

    this.calendarItemEmitter.emit([shift, data[1], data[2]]);
  }
}
