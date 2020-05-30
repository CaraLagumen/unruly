import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";

import { Vacation } from "../../../shared/models/shift/vacation.model";
import { Scheduler } from "../../../shared/models/users/scheduler.model";

@Component({
  selector: "app-editor-vacations-item",
  templateUrl: "./editor-vacations-item.component.html",
  styleUrls: ["./editor-vacations-item.component.scss"],
})
export class EditorVacationsItemComponent implements OnInit {
  @Input() vacations: Vacation[];
  @Input() selectedVacation: Vacation;
  @Input() selectedVacationApproved: boolean;
  @Input() selectedVacationScheduler: Scheduler;
  @Input() day: moment.Moment;

  @Output() editorVacationsEmitter = new EventEmitter<Vacation>();

  vacationsOfTheDay: Vacation[];

  constructor() {}

  ngOnInit() {
    this.getVacationsOfTheDay();
  }

  getVacationsOfTheDay() {
    this.vacationsOfTheDay = this.vacations.filter(
      (vacation: Vacation) =>
        moment(vacation.date).format("LL") === this.day.format("LL")
    );
  }

  onSelectVacation(vacation: Vacation) {
    this.editorVacationsEmitter.emit(vacation);
  }

  isVacationApproved(vacation: Vacation) {
    if (this.selectedVacation) {
      if (vacation.id === this.selectedVacation.id) {
        return this.selectedVacationApproved;
      }
    }

    return vacation.approved;
  }

  isVacationDenied(vacation: Vacation) {
    if (this.selectedVacation) {
      if (vacation.id === this.selectedVacation.id) {
        return !this.selectedVacationApproved && this.selectedVacationScheduler;
      }
    }

    return !vacation.approved && vacation.scheduler;
  }
}
