import { Component, OnInit } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
  daysArr: any[];

  date = moment();

  constructor() {}

  ngOnInit() {
    this.daysArr = this.createCalendar(this.date);
  }

  checkToday(day) {
    if (!day) {
      return false;
    }

    return moment().format("L") === day.format("L");
  }

  createCalendar(month) {
    //1. SETUP FIRST DAY OF MONTH
    let firstDay = moment(month).startOf(`M`);

    //2. CREATE ARR OF DAYS
    let days = Array.apply(null, { length: month.daysInMonth() })
      //MAP INTO NUMBERS
      .map(Number.call, Number)
      //MAP DAYS FROM MONTH'S FIRST DAY
      .map((el) => moment(firstDay).add(el, "d"));

    //3. LOOP THROUGH DAYS BEFORE FIRST DAY'S DAY
    //   FOR FIRST DAY TO FALL INTO CORRECT DAY
    for (let i = 0; i < firstDay.weekday(); i++) {
      days.unshift(null);
    }

    return days;
  }

  previousMonth() {
    this.date.subtract(1, "M");
    this.daysArr = this.createCalendar(this.date);
  }

  nextMonth() {
    this.date.add(1, "M");
    this.daysArr = this.createCalendar(this.date);
  }
}
