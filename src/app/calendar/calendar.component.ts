import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Observable, forkJoin, Subject } from "rxjs";
import * as moment from "moment";

import { ShiftService } from "../shared/services/shift/shift.service";
import { ScheduledService } from "../shared/services/shift/scheduled.service";
import { PreferredService } from "../shared/services/shift/preferred.service";
import { VacationService } from "../shared/services/shift/vacation.service";
import { CalendarService } from "./calendar.service";
import { AlertService } from "../components/alert/alert.service";
import {
  UserType,
  CalendarItem,
  CalendarItemEmit,
  EmployeeOptions,
} from "../shared/models/custom-types";
import { Shift } from "../shared/models/shift/shift.model";
import { Scheduled } from "../shared/models/shift/scheduled.model";
import { Preferred } from "../shared/models/shift/preferred.model";
import { Vacation } from "../shared/models/shift/vacation.model";

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
  forkAllMyPreferred: Observable<Preferred[]>;
  forkAllMyVacations: Observable<Vacation[]>;
  allShifts: Shift[];
  allScheduled: Scheduled[];
  allMyPreferred: Preferred[];
  allMyVacations: Vacation[];

  employeeIsAuth = false;
  schedulerIsAuth = false;
  employeeId = ``;
  date = moment();
  today = moment(); //FOR USE WITH URL - DO NOT ALTER
  calendarItemSubject = new Subject();
  employeeOptionsSubject = new Subject();
  isLoaded = false;
  isPopulating = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shiftService: ShiftService,
    private scheduledService: ScheduledService,
    private preferredService: PreferredService,
    private vacationService: VacationService,
    private calendarService: CalendarService,
    private alertService: AlertService
  ) {
    this.route.params.subscribe((param) => {
      if (param) {
        return (this.date = moment(param["date"]));
      }

      return this.date;
    });
  }

  ngOnInit() {
    //1. INTIALIZE CALENDAR
    this.daysArr = this.createCalendar(this.date);

    //2. CHECK IF USER
    this.userFeature();

    //3. GRAB DATA
    this.forkAllShifts = this.shiftService.getRawAllShifts();
    this.forkAllScheduled = this.scheduledService.getRawAllScheduled();

    //4. GRAB EMPLOYEE OPTIONS ONLY IF EMPLOYEE IS AUTH
    if (this.employeeIsAuth) {
      this.forkAllMyPreferred = this.preferredService.getAllMyPreferred();
      this.forkAllMyVacations = this.vacationService.getAllMyVacations();

      forkJoin([
        this.forkAllShifts,
        this.forkAllScheduled,
        this.forkAllMyPreferred,
        this.forkAllMyVacations,
      ]).subscribe((result) => {
        this.allShifts = result[0];
        this.allScheduled = result[1];
        this.allMyPreferred = result[2];
        this.allMyVacations = result[3];
        this.isLoaded = true;
      });
    } else {
      forkJoin([this.forkAllShifts, this.forkAllScheduled]).subscribe(
        (result) => {
          this.allShifts = result[0];
          this.allScheduled = result[1];
          this.allMyPreferred = [];
          this.allMyVacations = [];
          this.isLoaded = true;
        }
      );
    }
  }

  //TOOLS----------------------------------------------------------

  onCurrentMonth() {
    this.date = moment();
    const param = this.date.toISOString();
    this.router.navigate(["/calendar", param]);
    this.daysArr = this.createCalendar(this.date);
  }

  onPreviousMonth() {
    this.date.subtract(1, "M");
    const param = this.date.toISOString();
    this.router.navigate(["/calendar", param]);
    this.daysArr = this.createCalendar(this.date);
  }

  onNextMonth() {
    this.date.add(1, "M");
    const param = this.date.toISOString();
    this.router.navigate(["/calendar", param]);
    this.daysArr = this.createCalendar(this.date);
  }

  isNotThisMonth(day: moment.Moment): boolean {
    return this.calendarService.isNotThisMonth(day, this.date);
  }

  isToday(day: moment.Moment): boolean {
    return this.calendarService.isToday(day);
  }

  updateData(type: `shift` | `scheduled` | `preferred` | `vacation`) {
    switch (type) {
      case `shift`:
        return this.shiftService
          .getRawAllShifts()
          .subscribe((shifts: Shift[]) => (this.allShifts = shifts));
      case `scheduled`:
        return this.scheduledService
          .getRawAllScheduled()
          .subscribe(
            (scheduled: Scheduled[]) => (this.allScheduled = scheduled)
          );
      case `preferred`:
        return this.preferredService
          .getAllMyPreferred()
          .subscribe(
            (preferred: Preferred[]) => (this.allMyPreferred = preferred)
          );
      case `vacation`:
        return this.vacationService
          .getAllMyVacations()
          .subscribe(
            (vacations: Vacation[]) => (this.allMyVacations = vacations)
          );
    }
  }

  //MAIN----------------------------------------------------------

  createCalendar(month: moment.Moment): moment.Moment[] {
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

    if (this.employeeIsAuth) {
      this.employeeId = localStorage.getItem("userId");
    }
  }

  //DASHBOARD----------------------------------------------------------

  //FROM dashboard TO calendar-service
  onFormSubmitEmitter(type: `shift` | `scheduled` | `preferred`) {
    switch (type) {
      case `shift`:
        return this.updateData(`shift`);
      case `scheduled`:
        return this.updateData(`scheduled`);
      case `preferred`:
        return this.updateData(`preferred`);
    }
  }

  //----------------------FOR EMPLOYEE USE
  //FROM dashboard TO calendar-service
  onEmployeeServiceControl(
    emittedData: [string, [CalendarItem, EmployeeOptions]]
  ) {
    this.calendarService.employeeServiceControl(emittedData).subscribe(
      () => {
        this.alertService.success(`Successful ${emittedData[0]}`, {
          autoClose: true,
          keepAfterRouteChange: true,
          parseService: true,
        });

        switch (emittedData[0]) {
          case `deletePreferred`:
            return this.updateData(`preferred`);
          case `requestVacation`:
          case `deleteVacation`:
            return this.updateData(`vacation`);
        }
      },
      (err) => {
        this.alertService.error(err.error, {
          autoClose: true,
          keepAfterRouteChange: true,
          parseError: true,
        });
        console.log(err);
      }
    );
  }

  //----------------------FOR EMPLOYEE USE
  //FROM [calendar-item | week-item | day-item] TO dashboard
  onEmployeeOptionsEmitControl(emittedData: EmployeeOptions) {
    this.employeeOptionsSubject.next(emittedData);
  }

  //----------------------FOR SCHEDULER USE
  //FROM dashboard TO calendar-service
  onSchedulerServiceControl(emittedData: [string, CalendarItem]) {
    if (
      emittedData[0] === `populateAllToScheduled` ||
      emittedData[0] === `populateSteadyExtra`
    )
      this.isPopulating = true;

    this.calendarService.schedulerServiceControl(emittedData).subscribe(
      () => {
        this.alertService.success(`Successful ${emittedData[0]}`, {
          autoClose: true,
          keepAfterRouteChange: true,
          parseService: true,
        });

        switch (emittedData[0]) {
          case `populateAllToScheduled`:
          case `populateSteadyExtra`:
          case `deleteLastScheduled`:
          case `deleteScheduled`:
            this.isPopulating = false;
            return this.updateData(`scheduled`);
          case `deleteShift`:
            return this.updateData(`shift`);
        }
      },
      (err) => {
        this.alertService.error(err.error, {
          autoClose: true,
          keepAfterRouteChange: true,
          parseError: true,
        });
      }
    );
  }

  //----------------------FOR SCHEDULER USE
  //FROM [calendar-item | week-item | day-item] TO dashboard
  onCalendarItemEmitControl(emittedData: CalendarItemEmit) {
    this.calendarItemSubject.next(emittedData);
  }

  ngOnDestroy() {
    this.employeeAuthListenerSub.unsubscribe();
    this.schedulerAuthListenerSub.unsubscribe();
  }
}
