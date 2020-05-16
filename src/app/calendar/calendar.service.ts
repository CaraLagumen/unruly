import { Injectable } from "@angular/core";
import * as moment from "moment";

import { AuthService } from "../auth/auth.service";
import { ShiftService } from "../shared/services/shift/shift.service";
import { ScheduledService } from "../shared/services/shift/scheduled.service";
import { WeeklyScheduledService } from "../shared/services/shift/weekly-scheduled.service";
import { UserType } from "../shared/models/custom-types";
import { Shift } from "../shared/models/shift/shift.model";
import { Scheduled } from "../shared/models/shift/scheduled.model";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  constructor(
    private authService: AuthService,
    private shiftService: ShiftService,
    private scheduledService: ScheduledService,
    private weeklyScheduledService: WeeklyScheduledService
  ) {}

  //TOOLS----------------------------------------------------------

  addShiftsOfTheDay(day: moment.Moment, allShifts: Shift[]) {
    //COMPARE DAYS (EX: 0 TO 0 OR SUNDAY TO SUNDAY)
    const comparableDay = day.weekday();

    const shiftsOfTheDay = allShifts.filter(
      (el: any) => comparableDay === el.day
    );

    return shiftsOfTheDay;
  }

  //CAN GRAB SCHEDULED FROM SHIFT
  isScheduledShift(
    shift: Shift,
    allScheduled: Scheduled[],
    day: moment.Moment
  ): [boolean, Scheduled | null, moment.Moment] {
    //1. GRAB SHIFT ID TO COMPARE WITH SCHEDULED
    //   TO FIND IF SHIFT IS SCHEDULED
    const shiftId = shift.id;
    const scheduled = allScheduled.find((el: any) => el.shift.id === shiftId);

    //2. SETUP THIS DAY TO A COMPARABLE FORMAT WITH SCHEDULED DAY
    const comparableDay = day.format("YYYY-MM-DD");

    //3. COMPARE THIS DAY ONLY IF THERE IS A SCHEDULED
    if (scheduled) {
      const comparableScheduled = moment(scheduled.date).format("YYYY-MM-DD");

      // AND PASS SCHEDULED DATA PLUS DAY FOR EDITOR
      if (comparableScheduled == comparableDay) {
        return [true, scheduled, day];
      }
    }

    //4. RETURN FALSE AND NULL IF NOT A SCHEDULED SHIFT
    //   BUT STILL PASS THE DAY FOR EDITOR
    return [false, null, day];
  }

  isNotThisMonth(day: moment.Moment, date: moment.Moment) {
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
      .subscribe((isAuth: boolean) => {
        employeeIsAuth = isAuth;
        userType = `employee`;
      });

    let schedulerIsAuth = this.authService.getSchedulerIsAuth();
    let schedulerAuthListenerSub = this.authService
      .getSchedulerAuthStatusListener()
      .subscribe((isAuth: boolean) => {
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

  schedulerServiceControl(emittedData) {
    const [type, data] = emittedData;

    //data = [SHIFT, SCHEDULED]
    switch (type) {
      //MAIN
      case `populateAllToScheduled`:
        return this.weeklyScheduledService.populateAllToScheduled();
      case `deleteLastScheduled`:
        return this.scheduledService.deleteLastScheduled();

      // //EDIT SHIFT
      // // case `updateShift`:
      // //   return this.shiftService.updateShift();
      // // case `updateScheduled`:
      // //   return this.scheduledService.updateScheduled();
      case `deleteShift`:
        const shiftId: string = data[0].id;
        return this.shiftService.deleteShift(shiftId);
      case `deleteScheduled`:
        const scheduledId: string = data[1].id;
        return this.scheduledService.deleteScheduled(scheduledId);
    }
  }
}
