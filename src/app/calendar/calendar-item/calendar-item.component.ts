import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";

import { Scheduled } from "../../shared/models/shift/scheduled.model";
import { Shift } from "../../shared/models/shift/shift.model";

@Component({
  selector: "app-calendar-item",
  templateUrl: "./calendar-item.component.html",
  styleUrls: ["./calendar-item.component.scss"],
})
export class CalendarItemComponent implements OnInit {
  @Input() allShifts: Shift[];
  @Input() allScheduled: Scheduled[];
  @Input() day: moment.Moment;

  shiftsOfTheDay: Shift[];

  scheduledHours: number[] = [];

  constructor() {}

  ngOnInit() {
    this.addShiftsOfTheDay();
    this.isScheduledDay();

    this.shiftsOfTheDay.sort(
      (x: Shift, y: Shift) => x.shiftStart[0] - y.shiftStart[0]
    );
  }

  addShiftsOfTheDay() {
    //COMPARE DAYS (EX: 0 TO 0 OR SUNDAY TO SUNDAY)
    const comparableDay = this.day.weekday();

    this.shiftsOfTheDay = this.allShifts.filter(
      (el: any) => comparableDay === el.day
    );
  }

  isScheduledDay() {
    //COMPARE DATES (EX: MAY 1, 2020 TO MAY 1, 2020)
    const comparableDay = this.day.format("LL");

    this.allScheduled.forEach((el: any) => {
      const comparableSchedule = moment(el.date).format("LL");

      if (comparableDay === comparableSchedule) {
        this.scheduledHours.push(el.shift.shiftStart[0]);
      }
    });
  }

  isScheduledHour(shiftHour) {
    //COMPARE HOURS
    if (this.scheduledHours.indexOf(shiftHour) > -1) {
      return true;
    } else {
      return false;
    }
  }
}
