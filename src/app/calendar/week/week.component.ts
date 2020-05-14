import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable, forkJoin } from "rxjs";
import * as moment from "moment";

import { ShiftService } from "../../shared/services/shift/shift.service";
import { ScheduledService } from "../../shared/services/shift/scheduled.service";
import { CalendarService } from "../calendar.service";
import { UserType } from "../../shared/models/custom-types";
import { Shift } from "../../shared/models/shift/shift.model";
import { Scheduled } from "../../shared/models/shift/scheduled.model";

@Component({
  selector: "app-week",
  templateUrl: "./week.component.html",
  styleUrls: ["./week.component.scss"],
})
export class WeekComponent implements OnInit, OnDestroy {
  private employeeAuthListenerSub: Subscription;
  private schedulerAuthListenerSub: Subscription;

  userType: UserType;
  daysArr: moment.Moment[];
  day: moment.Moment;
  getAllShifts: Observable<Shift[]>;
  getAllScheduled: Observable<Scheduled[]>;
  allShifts: Shift[];
  allScheduled: Scheduled[];

  employeeIsAuth = false;
  schedulerIsAuth = false;
  date = moment();
  today = moment(); //FOR USE WITH URL - DO NOT ALTER
  isLoaded = false;

  constructor(
    private shiftService: ShiftService,
    private scheduledService: ScheduledService,
    private calendarService: CalendarService
  ) {}

  ngOnInit() {
    //1. INITIALIZE WEEK
    this.daysArr = this.createCalendarWeek(this.date);

    //2. CHECK IF USER
    this.userFeature();

    //3. GRAB DATA
    this.getAllShifts = this.shiftService.getRawAllShifts();
    this.getAllScheduled = this.scheduledService.getRawAllScheduled();

    forkJoin([this.getAllShifts, this.getAllScheduled]).subscribe((result) => {
      this.allShifts = result[0];
      this.allScheduled = result[1];
      this.isLoaded = true;
    });
  }

  //TOOLS----------------------------------------------------------

  currentWeek() {
    this.date = moment();
    this.daysArr = this.createCalendarWeek(this.date);
  }

  previousWeek() {
    this.date.subtract(1, "w");
    this.daysArr = this.createCalendarWeek(this.date);
  }

  nextWeek() {
    this.date.add(1, "w");
    this.daysArr = this.createCalendarWeek(this.date);
  }

  isToday(day) {
    this.calendarService.isToday(day);
  }

  resetData() {
    this.allShifts = [];
    this.allScheduled = [];
    this.isLoaded = false;
    this.ngOnInit();
  }

  //MAIN----------------------------------------------------------

  createCalendarWeek(week) {
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

  userFeature() {
    const userAuthData = this.calendarService.userFeature();

    this.userType = userAuthData.userType;
    this.employeeIsAuth = userAuthData.employeeIsAuth;
    this.employeeAuthListenerSub = userAuthData.employeeAuthListenerSub;
    this.schedulerIsAuth = userAuthData.schedulerIsAuth;
    this.schedulerAuthListenerSub = userAuthData.schedulerAuthListenerSub;
  }

  //DASHBOARD----------------------------------------------------------

  schedulerControl(type) {
    this.calendarService
      .schedulerControl(type)
      .subscribe(() => this.resetData());
  }

  ngOnDestroy() {
    this.employeeAuthListenerSub.unsubscribe();
    this.schedulerAuthListenerSub.unsubscribe();
  }
}
