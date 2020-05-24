import { Component, OnInit } from "@angular/core";
import { Observable, forkJoin } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";

import { EmployeeService } from "../../shared/services/users/employee.service";
import { ScheduledService } from "../../shared/services/shift/scheduled.service";
import { CalendarService } from "../../calendar/calendar.service";
import { Employee } from "../../shared/models/users/employee.model";
import { Scheduled } from "../../shared/models/shift/scheduled.model";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {
  daysArr: moment.Moment[];
  day: moment.Moment;
  forkAllEmployees: Observable<Employee[]>;
  forkAllScheduled: Observable<Scheduled[]>;
  allEmployees: Employee[];
  allScheduled: Scheduled[];

  date = moment();
  today = moment(); //FOR USE WITH URL - DO NOT ALTER
  isLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private scheduledService: ScheduledService,
    private calendarService: CalendarService
  ) {
    this.route.params.subscribe((param) => {
      if (param) {
        return (this.date = moment(param["date"]));
      }

      return this.date;
    });
  }

  ngOnInit() {
    //1. INITIALIZE WEEK
    this.daysArr = this.createCalendarWeek(this.date);

    this.forkAllEmployees = this.employeeService.getAllEmployees();
    this.forkAllScheduled = this.scheduledService.getRawAllScheduled();

    forkJoin([this.forkAllEmployees, this.forkAllScheduled]).subscribe(
      (result) => {
        this.allEmployees = result[0];
        this.allScheduled = result[1];
        this.isLoaded = true;
      }
    );
  }

  //TOOLS----------------------------------------------------------

  onCurrentWeek() {
    this.date = moment();
    const param = this.date.toISOString();
    this.router.navigate(["/stats/schedule", param]);
    this.daysArr = this.createCalendarWeek(this.date);
  }

  onPreviousWeek() {
    const param = this.date.subtract(1, "w").toISOString();
    this.router.navigate(["/stats/schedule", param]);
    this.daysArr = this.createCalendarWeek(this.date);
  }

  onNextWeek() {
    const param = this.date.add(1, "w").toISOString();
    this.router.navigate(["/stats/schedule", param]);
    this.daysArr = this.createCalendarWeek(this.date);
  }

  isToday(day: moment.Moment): boolean {
    return this.calendarService.isToday(day);
  }

  //MAIN----------------------------------------------------------

  createCalendarWeek(week: moment.Moment): moment.Moment[] {
    //1. SETUP VARS
    let firstDay = moment(week).startOf("w");

    //2. CREATE ARR OF DAYS
    let days = Array.apply(null, { length: 7 })
      //COUNT UP NUMBERS
      .map(Number.call, Number)
      //START FROM WEEK'S FIRST DAY
      .map((el) => moment(firstDay).add(el, "d"));

    //3. RETURN FINISHED ARR OF DAYS
    return days;
  }
}
