import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";

import { Employee } from "../../../shared/models/users/employee.model";
import { Scheduled } from "../../../shared/models/shift/scheduled.model";

@Component({
  selector: "app-schedule-item",
  templateUrl: "./schedule-item.component.html",
  styleUrls: ["./schedule-item.component.scss"],
})
export class ScheduleItemComponent implements OnInit {
  @Input() allEmployees: Employee[];
  @Input() allScheduled: Scheduled[];
  @Input() day: moment.Moment;

  scheduledOfTheDay: Scheduled[];

  isLoaded = false;

  constructor() {}

  ngOnInit() {
    this.scheduledOfTheDay = this.allScheduled.filter(
      (scheduled: Scheduled) =>
        moment(scheduled.date).format("LL") === this.day.format("LL")
    );
  }

  getRowStyle() {
    const rows = `repeat(${this.allEmployees.length}, 1fr)`;

    return {
      "grid-template-rows": rows,
    };
  }

  getScheduledStyle(employeeId: string) {
    const indexOfEmployee = this.allEmployees.findIndex(
      (employee: Employee) => employee.id === employeeId
    );
    const gridRow = `${indexOfEmployee + 1} / ${indexOfEmployee + 2}`;

    if (gridRow) this.isLoaded = true;

    return {
      "grid-row": gridRow,
    };
  }

  getFormattedHour(hour: number) {
    return moment().hour(hour).startOf("h").format("LT");
  }
}
