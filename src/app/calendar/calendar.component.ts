import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import * as moment from "moment";

import { AuthService } from "../auth/auth.service";
import { UserType } from "../shared/models/custom-types";
import { ShiftService } from "../shared/services/shift/shift.service";
import { ScheduledService } from "../shared/services/shift/scheduled.service";
import { WeeklyScheduledService } from "../shared/services/shift/weekly-scheduled.service";
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
  private shiftSub: Subscription;
  private scheduledSub: Subscription;

  userType: UserType;
  daysArr: moment.Moment[];
  day: moment.Moment;
  allShifts: Shift[];
  allScheduled: Scheduled[];

  employeeIsAuth = false;
  schedulerIsAuth = false;
  date = moment();
  isLoaded = [false, false];

  constructor(
    private authService: AuthService,
    private shiftService: ShiftService,
    private scheduledService: ScheduledService,
    private weeklyScheduledService: WeeklyScheduledService
  ) {}

  ngOnInit() {
    //1. INTIALIZE CALENDAR
    this.daysArr = this.createCalendar(this.date);

    //2. CHECK IF USER
    this.userFeature();

    //3. GRAB DATA
    this.shiftSub = this.shiftService
      .getRawAllShifts()
      .subscribe((shift: any) => {
        this.allShifts = shift;
        this.isLoaded[0] = true;
      });

    this.scheduledSub = this.scheduledService
      .getRawAllScheduled()
      .subscribe((scheduled: any) => {
        this.allScheduled = scheduled;
        this.isLoaded[1] = true;
      });
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

  isToday(day) {
    if (!day) {
      return false;
    }

    return moment().format("L") === day.format("L");
  }

  isNotThisMonth(day) {
    let firstDay = moment(this.date).startOf("M");
    const lastDay = moment(this.date).endOf("M");

    if (day < firstDay || day > lastDay) {
      return true;
    }

    return false;
  }

  //MAIN----------------------------------------------------------

  createCalendar(month) {
    //1. SETUP VARS
    let firstDay = moment(month).startOf("M");
    const lastDay = moment(month).endOf("M");
    let daysShown;
    let counter = 0;

    //2. CREATE ARR OF DAYS
    let days = Array.apply(null, { length: month.daysInMonth() })
      //COUNT UP NUMBERS
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
    this.employeeIsAuth = this.authService.getEmployeeIsAuth();
    this.employeeAuthListenerSub = this.authService
      .getEmployeeAuthStatusListener()
      .subscribe((isAuth) => {
        this.employeeIsAuth = isAuth;
        this.userType = `employee`;
      });

    this.schedulerIsAuth = this.authService.getSchedulerIsAuth();
    this.schedulerAuthListenerSub = this.authService
      .getSchedulerAuthStatusListener()
      .subscribe((isAuth) => {
        this.schedulerIsAuth = isAuth;
        this.userType = `scheduler`;
      });
  }

  //DASHBOARD----------------------------------------------------------

  schedulerControl(type) {
    const reloadCalendar = () => {
      this.isLoaded = [false, false];
      this.ngOnInit();
    };

    switch (type) {
      case `populateAllToScheduled`:
        this.weeklyScheduledService.populateAllToScheduled().subscribe(() => {
          reloadCalendar();
        });

      case `deleteLastScheduled`:
        this.scheduledService.deleteLastScheduled().subscribe(() => {
          reloadCalendar();
        });
    }
  }

  ngOnDestroy() {
    this.shiftSub.unsubscribe();
    this.scheduledSub.unsubscribe();
    this.employeeAuthListenerSub.unsubscribe();
    this.schedulerAuthListenerSub.unsubscribe();
  }
}
