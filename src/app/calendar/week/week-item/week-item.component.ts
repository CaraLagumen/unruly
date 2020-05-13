import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";

import { Shift } from "../../../shared/models/shift/shift.model";
import { Scheduled } from "../../../shared/models/shift/scheduled.model";

@Component({
  selector: "app-week-item",
  templateUrl: "./week-item.component.html",
  styleUrls: ["./week-item.component.scss"],
})
export class WeekItemComponent implements OnInit {
  @Input() allShifts: Shift[];
  @Input() allScheduled: Scheduled[];
  @Input() day: moment.Moment;

  scheduled: Scheduled;

  shiftsOfTheDay: Shift[] = [];
  scheduledOfTheDay: Scheduled[] = [];
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
        this.scheduledOfTheDay.push(el);
      }
    });
  }

  isScheduledHour(shift) {
    const shiftHour = shift.shiftStart[0];

    //COMPARE HOURS
    if (this.scheduledHours.indexOf(shiftHour) > -1) {
      return true;
    } else {
      return false;
    }
  }

  getScheduled(shift) {
    const shiftHour = shift.shiftStart[0];
    const scheduledIndex = this.scheduledHours.indexOf(shiftHour);
    this.scheduled = this.scheduledOfTheDay[scheduledIndex];

    return this.scheduled;
  }
}
