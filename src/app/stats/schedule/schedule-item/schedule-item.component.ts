import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";

import { CalendarService } from "../../../calendar/calendar.service";
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

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.scheduledOfTheDay = this.allScheduled.filter(
      (scheduled: Scheduled) =>
        moment(scheduled.date).format("LL") === this.day.format("LL")
    );
  }

  getFormattedHour(hour: number) {
    return this.calendarService.getFormattedHour(hour);
  }

  getFormattedLocation(location: string) {
    return this.calendarService.getFormattedLocation(location);
  }

  getRowStyle() {
    //CLARIFY NUMBER OF grid-row FROM NUMBER OF EMPLOYEES
    const rows = `repeat(${this.allEmployees.length}, 1fr)`;

    return {
      "grid-template-rows": rows,
    };
  }

  getScheduledStyle(employeeId: string) {
    //grid-row WILL BE BASED ON INDEX OF EMPLOYEE IN THE ARR
    const indexOfEmployee = this.allEmployees.findIndex(
      (employee: Employee) => employee.id === employeeId
    );
    const gridRow = `${indexOfEmployee + 1} / ${indexOfEmployee + 2}`;

    if (gridRow) this.isLoaded = true;

    return {
      "grid-row": gridRow,
    };
  }
}
