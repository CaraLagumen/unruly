import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { Subscription } from "rxjs";
import * as moment from "moment";

import { UsersService } from "../../users/users.service";
import { VacationService } from "../../shared/services/shift/vacation.service";
import { CalendarService } from "../../calendar/calendar.service";
import { AlertService } from "../../components/alert/alert.service";
import { Scheduler } from "../../shared/models/users/scheduler.model";
import { Vacation } from "../../shared/models/shift/vacation.model";

@Component({
  selector: "app-editor-vacations",
  templateUrl: "./editor-vacations.component.html",
  styleUrls: ["./editor-vacations.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorVacationsComponent implements OnInit, OnDestroy {
  private vacationSub: Subscription;
  private schedulerSub: Subscription;

  daysArr: moment.Moment[];
  day: moment.Moment;
  scheduler: Scheduler;
  vacations: Vacation[];
  selectedVacation: Vacation;
  selectedVacationApproved: boolean;
  selectedVacationScheduler: Scheduler;
  pendingVacations: number;

  date = moment();
  isLoaded = false;

  constructor(
    private cd: ChangeDetectorRef,
    private usersService: UsersService,
    private vacationService: VacationService,
    private calendarService: CalendarService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    //1. INTIALIZE CALENDAR
    this.daysArr = this.createCalendar(this.date);

    //2. GRAB DATA
    this.vacationSub = this.vacationService
      .getRawAllVacations()
      .subscribe((vacations: Vacation[]) => {
        this.vacations = vacations.filter(
          (vacation: Vacation) => moment(vacation.date) > moment()
        );

        this.pendingVacations = this.vacations.filter(
          (vacation: Vacation) => !vacation.scheduler
        ).length;

        this.isLoaded = true;
        this.cd.markForCheck();
      });

    this.schedulerSub = this.usersService
      .getUser(`scheduler`)
      .subscribe(
        (schedulerData: Scheduler) => (this.scheduler = schedulerData)
      );
  }

  //TOOLS----------------------------------------------------------

  onCurrentMonth() {
    this.date = moment();
    this.daysArr = this.createCalendar(this.date);
  }

  onPreviousMonth() {
    this.date.subtract(1, "M");
    this.daysArr = this.createCalendar(this.date);
  }

  onNextMonth() {
    this.date.add(1, "M");
    this.daysArr = this.createCalendar(this.date);
  }

  isNotThisMonth(day: moment.Moment): boolean {
    return this.calendarService.isNotThisMonth(day, this.date);
  }

  isToday(day: moment.Moment): boolean {
    return this.calendarService.isToday(day);
  }

  onEditorVacationsControl(emittedData: Vacation) {
    this.selectedVacation = emittedData;
    this.selectedVacationApproved = emittedData.approved;
    if (emittedData.scheduler) {
      this.selectedVacation.scheduler = emittedData.scheduler;
      this.selectedVacationScheduler = emittedData.scheduler;
    } else {
      this.selectedVacation.scheduler = null;
      this.selectedVacationScheduler = null;
    }
  }

  onAproveVacation(vacation: Vacation) {
    return this.vacationService
      .updateVacation(vacation.id, {
        scheduler: this.scheduler.id,
        approved: true,
      })
      .subscribe(
        () => {
          this.alertService.success(`Successful approve vacation`, {
            autoClose: true,
            keepAfterRouteChange: true,
          });

          this.selectedVacation = vacation;
          this.selectedVacation.scheduler = this.scheduler;
          this.selectedVacationApproved = true;
          this.selectedVacationScheduler = this.scheduler;
          this.updateData();
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

  onDenyVacation(vacation: Vacation) {
    return this.vacationService
      .updateVacation(vacation.id, {
        scheduler: this.scheduler.id,
        approved: false,
      })
      .subscribe(
        () => {
          this.alertService.success(`Successful deny vacation`, {
            autoClose: true,
            keepAfterRouteChange: true,
          });

          this.selectedVacation = vacation;
          this.selectedVacation.scheduler = this.scheduler;
          this.selectedVacationApproved = false;
          this.selectedVacationScheduler = this.scheduler;
          this.updateData();
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

  updateData() {
    return this.vacationService
      .getRawAllVacations()
      .subscribe((vacations: Vacation[]) => {
        this.vacations = vacations.filter(
          (vacation: Vacation) => moment(vacation.date) > moment()
        );

        this.pendingVacations = this.vacations.filter(
          (vacation: Vacation) => !vacation.scheduler
        ).length;

        this.cd.markForCheck();
      });
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

  ngOnDestroy() {
    if (this.schedulerSub) this.schedulerSub.unsubscribe();
    if (this.vacationSub) this.vacationSub.unsubscribe();
  }
}
