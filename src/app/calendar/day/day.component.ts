import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import * as moment from "moment";

import { AuthService } from "../../auth/auth.service";
import { UserType } from "../../shared/models/custom-types";
import { ShiftService } from "../../shared/services/shift/shift.service";
import { ScheduledService } from "../../shared/services/shift/scheduled.service";
import { WeeklyScheduledService } from "../../shared/services/shift/weekly-scheduled.service";
import { Shift } from "../../shared/models/shift/shift.model";
import { Scheduled } from "../../shared/models/shift/scheduled.model";

@Component({
  selector: "app-day",
  templateUrl: "./day.component.html",
  styleUrls: ["./day.component.scss"],
})
export class DayComponent implements OnInit, OnDestroy {
  private employeeAuthListenerSub: Subscription;
  private schedulerAuthListenerSub: Subscription;
  private shiftSub: Subscription;
  private scheduledSub: Subscription;

  userType: UserType;
  day: moment.Moment;
  allShifts: Shift[];
  allScheduled: Scheduled[];
  scheduled: Scheduled;

  employeeIsAuth = false;
  schedulerIsAuth = false;
  date = moment();
  isLoaded = [false, false];
  shiftsOfTheDay: Shift[] = [];
  scheduledOfTheDay: Scheduled[] = [];
  scheduledHours: number[] = [];

  constructor(
    private authService: AuthService,
    private shiftService: ShiftService,
    private scheduledService: ScheduledService,
    private weeklyScheduledService: WeeklyScheduledService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param) => (this.date = moment(param["date"])));
  }

  ngOnInit() {
    //1. INITIALIZE DAY
    this.day = this.date;

    //2. CHECK IF USER
    this.userFeature();

    //3. GRAB DATA
    this.shiftSub = this.shiftService
      .getRawAllShifts()
      .subscribe((shift: any) => {
        this.allShifts = shift;
        this.addShiftsOfTheDay();
        this.shiftsOfTheDay.sort(
          (x: Shift, y: Shift) => x.shiftStart[0] - y.shiftStart[0]
        );
        this.isLoaded[0] = true;
      });

    this.scheduledSub = this.scheduledService
      .getRawAllScheduled()
      .subscribe((scheduled: any) => {
        this.allScheduled = scheduled;
        this.isScheduledDay();
        this.isLoaded[1] = true;
      });
  }

  //TOOLS----------------------------------------------------------

  currentDay() {
    this.day = moment();
    this.resetData();
    this.ngOnInit();
  }

  previousDay() {
    this.day = this.date.subtract(1, "d");
    this.resetData();
    this.ngOnInit();
  }

  nextDay() {
    this.day = this.date.add(1, "d");
    this.resetData();
    this.ngOnInit();
  }

  isToday(day) {
    if (!day) {
      return false;
    }

    return moment().format("L") === day.format("L");
  }

  isScheduledDay() {
    //COMPARE DATES (EX: MAY 1, 2020 TO MAY 1, 2020)
    const comparableDay = this.date.format("LL");

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

  //MAIN----------------------------------------------------------

  addShiftsOfTheDay() {
    //COMPARE DAYS (EX: 0 TO 0 OR SUNDAY TO SUNDAY)
    const comparableDay = this.date.weekday();

    this.shiftsOfTheDay = this.allShifts.filter(
      (el: any) => comparableDay === el.day
    );
  }

  resetData() {
    this.allShifts = [];
    this.allScheduled = [];
    this.scheduled = null;
    this.shiftsOfTheDay = [];
    this.scheduledOfTheDay = [];
    this.scheduledHours = [];
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
      this.resetData();
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
