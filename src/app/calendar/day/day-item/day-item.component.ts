import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";

import { Shift } from "../../../shared/models/shift/shift.model";
import { Scheduled } from "../../../shared/models/shift/scheduled.model";

@Component({
  selector: "app-day-item",
  templateUrl: "./day-item.component.html",
  styleUrls: ["./day-item.component.scss"],
})
export class DayItemComponent implements OnInit {
  @Input() allShifts: Shift[];
  @Input() allScheduled: Scheduled[];
  @Input() day: moment.Moment;

  scheduled: Scheduled;

  shiftsOfTheDay: Shift[] = [];

  constructor() {}

  ngOnInit() {
    //1. POPULATE SHIFTS OF THE DAY
    this.addShiftsOfTheDay();

    //2. SORT THE SHIFTS FROM SHIFT START
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

  isScheduledShift(shift) {
    //1. GRAB SHIFT ID TO COMPARE WITH SCHEDULED
    //   TO FIND IF SHIFT IS SCHEDULED & GRAB THE SCHEDULED
    const shiftId = shift.id;
    this.scheduled = this.allScheduled.find(
      (el: any) => el.shift.id === shiftId
    );

    //2. SETUP THIS DAY TO A COMPARABLE FORMAT WITH SCHEDULED DAY
    const comparableDay = this.day.format("LL");

    //3. COMPARE THIS DAY ONLY IF THERE IS A SCHEDULED
    if (this.scheduled) {
      const comparableScheduled = moment(this.scheduled.date).format("LL");

      // ENSURE SCHEDULED DAY IS SAME AS THIS DAY
      if (comparableScheduled === comparableDay) {
        return true;
      }
    }

    return false;
  }
}
