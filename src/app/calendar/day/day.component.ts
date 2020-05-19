import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Observable, forkJoin, Subject } from "rxjs";
import * as moment from "moment";

import { CalendarService } from "../calendar.service";
import { ShiftService } from "../../shared/services/shift/shift.service";
import { ScheduledService } from "../../shared/services/shift/scheduled.service";
import { UserType, CalendarItemEmit } from "../../shared/models/custom-types";
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

  userType: UserType;
  day: moment.Moment; //LIKE daysArr FROM OTHER COMPONENTS
  getAllShifts: Observable<Shift[]>;
  getAllScheduled: Observable<Scheduled[]>;
  allShifts: Shift[];
  allScheduled: Scheduled[];

  employeeIsAuth = false;
  schedulerIsAuth = false;
  date = moment();
  today = moment(); //FOR USE WITH URL - DO NOT ALTER
  calendarItemSubject = new Subject();
  isLoaded = false;

  constructor(
    private shiftService: ShiftService,
    private scheduledService: ScheduledService,
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((param) => {
      if (param) {
        return (this.date = moment(param["date"]));
      }

      return this.date;
    });
  }

  ngOnInit() {
    //1. INITIALIZE DAY
    this.day = this.date;

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

  onCurrentDay() {
    this.date = moment();
    const param = this.date.toISOString();
    this.router.navigate(["/day", param]);
    this.resetData();
  }

  onPreviousDay() {
    this.date.subtract(1, "d");
    const param = this.date.toISOString();
    this.router.navigate(["/day", param]);
    this.resetData();
  }

  onNextDay() {
    this.date.add(1, "d");
    const param = this.date.toISOString();
    this.router.navigate(["/day", param]);
    this.resetData();
  }

  isToday(day: moment.Moment): boolean {
    return this.calendarService.isToday(day);
  }

  resetData() {
    this.allShifts = [];
    this.allScheduled = [];
    this.isLoaded = false;
    this.ngOnInit();
  }

  //MAIN----------------------------------------------------------

  userFeature() {
    const userAuthData = this.calendarService.userFeature();

    this.userType = userAuthData.userType;
    this.employeeIsAuth = userAuthData.employeeIsAuth;
    this.employeeAuthListenerSub = userAuthData.employeeAuthListenerSub;
    this.schedulerIsAuth = userAuthData.schedulerIsAuth;
    this.schedulerAuthListenerSub = userAuthData.schedulerAuthListenerSub;
  }

  //DASHBOARD----------------------------------------------------------

  onSchedulerServiceControl(emittedData) {
    this.calendarService
      .schedulerServiceControl(emittedData)
      .subscribe(() => this.resetData());
  }

  //FROM [calendar-item | week-item | day-item] TO dashboard
  onCalendarItemEmitControl(emittedData: CalendarItemEmit) {
    this.calendarItemSubject.next(emittedData);
  }

  ngOnDestroy() {
    this.employeeAuthListenerSub.unsubscribe();
    this.schedulerAuthListenerSub.unsubscribe();
  }
}
