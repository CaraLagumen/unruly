import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable, forkJoin, Subject } from "rxjs";
import * as moment from "moment";

import { ShiftService } from "../shared/services/shift/shift.service";
import { ScheduledService } from "../shared/services/shift/scheduled.service";
import { CalendarService } from "./calendar.service";
import { UserType } from "../shared/models/custom-types";
import { Shift } from "../shared/models/shift/shift.model";
import { Scheduled } from "../shared/models/shift/scheduled.model";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit, OnDestroy {
  private employeeAuthListenerSub: Subscription;
  private schedulerAuthListenerSub: Subscription;

  userType: UserType;
  daysArr: moment.Moment[];
  day: moment.Moment;
  forkAllShifts: Observable<Shift[]>;
  forkAllScheduled: Observable<Scheduled[]>;
  allShifts: Shift[];
  allScheduled: Scheduled[];

  employeeIsAuth = false;
  schedulerIsAuth = false;
  date = moment();
  isLoaded = false;
  editShiftSubject = new Subject();

  constructor(
    private shiftService: ShiftService,
    private scheduledService: ScheduledService,
    private calendarService: CalendarService
  ) {}

  ngOnInit() {
    //1. INTIALIZE CALENDAR
    this.daysArr = this.createCalendar(this.date);

    //2. CHECK IF USER
    this.userFeature();

    //3. GRAB DATA
    this.forkAllShifts = this.shiftService.getRawAllShifts();
    this.forkAllScheduled = this.scheduledService.getRawAllScheduled();

    forkJoin([this.forkAllShifts, this.forkAllScheduled]).subscribe(
      (result) => {
        this.allShifts = result[0];
        this.allScheduled = result[1];
        this.isLoaded = true;
      }
    );
  }

  //TOOLS----------------------------------------------------------

  currentMonth() {
    this.date = moment();
    this.daysArr = this.createCalendar(this.date);
  }

  previousMonth() {
    this.date.subtract(1, "M");
    this.daysArr = this.createCalendar(this.date);
  }

  nextMonth() {
    this.date.add(1, "M");
    this.daysArr = this.createCalendar(this.date);
  }

  isNotThisMonth(day) {
    this.calendarService.isNotThisMonth(day, this.date);
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

  createCalendar(month: moment.Moment) {
    //1. SETUP VARS
    let firstDay = moment(month).startOf("M");
    const lastDay = moment(month).endOf("M");
    let daysShown;
    let counter = 0;

    //2. CREATE ARR OF DAYS
    //   START WITH AN EMPTY ARRAY WITH A LENGTH OF THE DAYS OF THE MONTH
    let days = Array.apply(null, { length: month.daysInMonth() })
      //COUNT UP NUMBERS AND FILL THEM
      .map(Number.call, Number)
      //START FROM MONTH'S FIRST DAY
      .map((el) => moment(firstDay).add(el, "d"));

    //3. LOOP THROUGH DAYS BEFORE FIRST DAY'S DAY
    //   FOR FIRST DAY TO FALL INTO CORRECT DAY
    for (let i = 0; i < firstDay.weekday(); i++) {
      //SUBTRACT FROM FIRST DAY OF MONTH TO FIND PREVIOUS MONTH'S LAST DAYS
      days.unshift(firstDay.clone().subtract(i + 1, "d"));
    }

    //4. ADD MORE DAYS TO FINISH THE LAST WEEK
    //   FIND TOTAL NUMBER OF DAYS THAT CAN FIT CALENDAR
    //   BY COMPARING THE ARR'S LENGTH SO FAR TO TARGET LENGTH
    days.length <= 35 ? (daysShown = 35) : (daysShown = 42);

    //LOOP THROUGH DAYS AFTER UNTIL LAST WEEK DAY MET
    for (let i = days.length; i < daysShown; i++) {
      counter++;
      //ADD FROM LAST DAY OF MONTH TO FIND NEXT MONTH'S FIRST DAYS
      days.push(lastDay.clone().add(counter, "d"));
    }

    //5. RETURN FINISHED ARR OF DAYS
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

  //FROM dashboard TO calendar-service
  schedulerServiceControl(emittedData) {
    this.calendarService
      .schedulerServiceControl(emittedData)
      .subscribe(() => this.resetData());
  }

  //FROM calendar-item | week-item | day-item TO dashboard
  editShiftEmitControl(emittedData: [Shift, Scheduled | null, moment.Moment]) {
    this.editShiftSubject.next(emittedData);
  }

  ngOnDestroy() {
    this.employeeAuthListenerSub.unsubscribe();
    this.schedulerAuthListenerSub.unsubscribe();
  }
}
