import { Injectable } from "@angular/core";
import * as moment from "moment";

import { AuthService } from "../auth/auth.service";
import { ScheduledService } from "../shared/services/shift/scheduled.service";
import { WeeklyScheduledService } from "../shared/services/shift/weekly-scheduled.service";
import { UserType } from "../shared/models/custom-types";
import { Scheduled } from "../shared/models/shift/scheduled.model";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  constructor(
    private authService: AuthService,
    private scheduledService: ScheduledService,
    private weeklyScheduledService: WeeklyScheduledService
  ) {}

  //TOOLS----------------------------------------------------------

  addShiftsOfTheDay(day, allShifts) {
    //COMPARE DAYS (EX: 0 TO 0 OR SUNDAY TO SUNDAY)
    const comparableDay = day.weekday();

    const shiftsOfTheDay = allShifts.filter(
      (el: any) => comparableDay === el.day
    );

    return shiftsOfTheDay;
  }

  isScheduledShift(shift, allScheduled: Scheduled[], day) {
    //1. GRAB SHIFT ID TO COMPARE WITH SCHEDULED
    //   TO FIND IF SHIFT IS SCHEDULED
    const shiftId = shift.id;
    const scheduled = allScheduled.find((el: any) => el.shift.id === shiftId);

    //2. SETUP THIS DAY TO A COMPARABLE FORMAT WITH SCHEDULED DAY
    const comparableDay = day.format("LL");

    //3. COMPARE THIS DAY ONLY IF THERE IS A SCHEDULED
    if (scheduled) {
      const comparableScheduled = moment(scheduled.date).format("LL");

      // ENSURE SCHEDULED DAY IS SAME AS THIS DAY
      if (comparableScheduled === comparableDay) {
        return [true, scheduled];
      }
    }

    return false;
  }

  isNotThisMonth(day, date) {
    let firstDay = moment(date).startOf("M");
    const lastDay = moment(date).endOf("M");

    if (day < firstDay || day > lastDay) {
      return true;
    }

    return false;
  }

  isToday(day) {
    if (!day) {
      return false;
    }

    return moment().format("L") === day.format("L");
  }

  //USER----------------------------------------------------------

  userFeature() {
    let userType: UserType;

    let employeeIsAuth = this.authService.getEmployeeIsAuth();
    let employeeAuthListenerSub = this.authService
      .getEmployeeAuthStatusListener()
      .subscribe((isAuth) => {
        employeeIsAuth = isAuth;
        userType = `employee`;
      });

    let schedulerIsAuth = this.authService.getSchedulerIsAuth();
    let schedulerAuthListenerSub = this.authService
      .getSchedulerAuthStatusListener()
      .subscribe((isAuth) => {
        schedulerIsAuth = isAuth;
        userType = `scheduler`;
      });

    return {
      userType,
      employeeIsAuth,
      employeeAuthListenerSub,
      schedulerIsAuth,
      schedulerAuthListenerSub,
    };
  }

  //DASHBOARD----------------------------------------------------------

  schedulerControl(type: string) {
    switch (type) {
      case `populateAllToScheduled`:
        return this.weeklyScheduledService.populateAllToScheduled();

      case `deleteLastScheduled`:
        return this.scheduledService.deleteLastScheduled();
    }
  }
}
