import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as moment from "moment";

import { AuthService } from "../auth/auth.service";
import { ShiftService } from "../shared/services/shift/shift.service";
import { ScheduledService } from "../shared/services/shift/scheduled.service";
import { WeeklyScheduledService } from "../shared/services/shift/weekly-scheduled.service";
import { PreferredService } from "../shared/services/shift/preferred.service";
import { VacationService } from "../shared/services/shift/vacation.service";
import {
  UserType,
  CalendarItem,
  EmployeeOptions,
} from "../shared/models/custom-types";
import { Shift } from "../shared/models/shift/shift.model";
import { Scheduled } from "../shared/models/shift/scheduled.model";
import { Preferred } from "../shared/models/shift/preferred.model";
import { Vacation } from "../shared/models/shift/vacation.model";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  constructor(
    private authService: AuthService,
    private shiftService: ShiftService,
    private scheduledService: ScheduledService,
    private weeklyScheduledService: WeeklyScheduledService,
    private preferredService: PreferredService,
    private vacationService: VacationService
  ) {}

  //TOOLS----------------------------------------------------------

  getFormattedHour(hour: number) {
    return moment().hour(hour).startOf("h").format("ha");
  }

  getFormattedLocation(location: string) {
    switch (location) {
      case `rotunda`:
        return `RT`;
      case `food court`:
        return `FC`;
      case `tower 1`:
        return `T1`;
      case `tower 2`:
        return `T2`;
      case `pool`:
        return `PL`;
      case `breaker`:
        return `BK`;
    }
  }

  addShiftsOfTheDay(day: moment.Moment, allShifts: Shift[]): Shift[] {
    //COMPARE DAYS (EX: 0 TO 0 OR SUNDAY TO SUNDAY)
    const comparableDay = day.weekday();

    const shiftsOfTheDay = allShifts.filter(
      (el: any) => comparableDay === el.day
    );

    return shiftsOfTheDay;
  }

  //CAN GRAB SCHEDULED FROM SHIFT FOR dashboard AND editor
  isScheduledShift(
    shift: Shift,
    allScheduled: Scheduled[],
    day: moment.Moment
  ): [boolean, Scheduled | null, moment.Moment] {
    //1. GRAB SHIFT ID TO COMPARE WITH SCHEDULED
    //   TO FIND IF SHIFT MIGHT HAVE A SCHEDULED
    const shiftId = shift.id;
    const allMatchedScheduled = allScheduled.filter(
      (scheduled: Scheduled) => scheduled.shift.id === shiftId
    );

    //2. COMPARE THIS DAY ONLY IF THERE ARE MATCHING SCHEDULED
    if (allMatchedScheduled) {
      const comparableDay = day.format("YYYY-MM-DD");

      //3. OF ALL THE POSSIBLE SCHEDULED, FIND THE ONE FOR THAT DAY
      const isScheduledData = allMatchedScheduled.find(
        (scheduled: Scheduled) => {
          const comparableScheduled = moment(scheduled.date).format(
            "YYYY-MM-DD"
          );

          //4. AND PASS SCHEDULED DATA
          if (comparableScheduled === comparableDay) return scheduled;
        }
      );

      //6. RETURN TRUE AND SCHEDULED DATA FOR DASHBOARD AND DAY FOR EDITOR
      if (isScheduledData) return [true, isScheduledData, day];
    }

    //7. RETURN FALSE AND NULL IF NOT A SCHEDULED SHIFT
    //   BUT STILL PASS THE DAY FOR EDITOR
    return [false, null, day];
  }

  isMyPreferredShift(
    shift: Shift,
    allMyPreferred: Preferred[]
  ): [boolean, Preferred | null] {
    const shiftId = shift.id;
    const myPreferred = allMyPreferred.find(
      (preferred: Preferred) => preferred.shift.id === shiftId
    );

    if (myPreferred) return [true, myPreferred];

    return [false, null];
  }

  isMyVacationDay(
    allMyVacations: Vacation[],
    day: moment.Moment
  ): [boolean, Vacation | null] {
    const myVacation = allMyVacations.find(
      (vacation: Vacation) =>
        moment(vacation.date).format("L") === day.format("L")
    );

    if (myVacation) return [true, myVacation];

    return [false, null];
  }

  isNotThisMonth(day: moment.Moment, date: moment.Moment): boolean {
    let firstDay = moment(date).startOf("M");
    const lastDay = moment(date).endOf("M");

    if (day < firstDay || day > lastDay) return true;

    return false;
  }

  isToday(day): boolean {
    if (!day) return false;

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

  employeeServiceControl(
    emittedData: [string, [CalendarItem, EmployeeOptions]]
  ): Observable<any> {
    const [type, data] = emittedData;

    //data = [[SHIFT, SCHEDULED], [PREFERRED, VACATIONS]]
    switch (type) {
      case `deletePreferred`:
        const preferredId = data[1][0].id;
        return this.preferredService.deleteMyPreferred(preferredId);
      case `requestVacation`:
        const vacation = data[1][1];
        return this.vacationService.requestVacation(vacation);
      case `deleteVacation`:
        const vacationId = data[1][1].id;
        return this.vacationService.deleteMyVacation(vacationId);
    }
  }

  schedulerServiceControl(
    emittedData: [string, CalendarItem]
  ): Observable<any> {
    const [type, data] = emittedData;

    //data = [SHIFT, SCHEDULED]
    switch (type) {
      //MAIN
      case `populateAllToScheduled`:
        return this.weeklyScheduledService.populateAllToScheduled();
      case `populateSteadyExtra`:
        return this.scheduledService.populateSteadyExtra();
      case `deleteLastScheduled`:
        return this.scheduledService.deleteLastScheduled();
      //CALENDAR ITEM
      case `deleteShift`:
        const shiftId = data[0].id;
        return this.shiftService.deleteShift(shiftId);
      case `deleteScheduled`:
        const scheduledId = data[1].id;
        return this.scheduledService.deleteScheduled(scheduledId);
    }
  }
}
