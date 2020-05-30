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

  date = moment();
  isLoaded = false;

  constructor(
    private cd: ChangeDetectorRef,
    private usersService: UsersService,
    private vacationService: VacationService,
    private calendarService: CalendarService
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
    this.selectedVacationApproved = emittedData.approved as boolean;
    this.selectedVacationScheduler = emittedData.scheduler;
  }

  onAproveVacation(vacation: Vacation) {
    return this.vacationService
      .updateVacation(vacation.id, {
        scheduler: this.scheduler.id,
        approved: true,
      })
      .subscribe(() => {
        this.selectedVacationApproved = true;
        this.updateData();
        this.cd.markForCheck();
      });
  }

  onDenyVacation(vacation: Vacation) {
    return this.vacationService
      .updateVacation(vacation.id, {
        scheduler: this.scheduler.id,
        approved: false,
      })
      .subscribe(() => {
        this.selectedVacationApproved = false;
        this.updateData();
        this.cd.markForCheck();
      });
  }

  updateData() {
    return this.vacationService
      .getRawAllVacations()
      .subscribe((vacations: Vacation[]) => {
        this.vacations = vacations.filter(
          (vacation: Vacation) => moment(vacation.date) > moment()
        );
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
