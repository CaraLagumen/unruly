import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";

import { Scheduled } from "src/app/shared/models/shift/scheduled.model";

@Component({
  selector: "app-calendar-item",
  templateUrl: "./calendar-item.component.html",
  styleUrls: ["./calendar-item.component.scss"],
})
export class CalendarItemComponent implements OnInit {
  @Input() allScheduled: Scheduled[];
  @Input() day: moment.Moment;

  scheduled: Scheduled;

  isScheduled = false;

  constructor() {}

  ngOnInit() {
    this.checkIsScheduledDay();
  }

  checkIsScheduledDay() {
    const comparableDay = this.day.format("LL");

    this.allScheduled.forEach((el: any) => {
      const comparableSchedule = moment(el.date).format("LL");

      if (comparableDay === comparableSchedule) {
        this.scheduled = el;
        return (this.isScheduled = true);
      }
    });
  }
}
