import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";

import { Employee } from "../../../shared/models/users/employee.model";
import { Vacation } from "../../../shared/models/shift/vacation.model";

@Component({
  selector: "app-editor-vacations-item",
  templateUrl: "./editor-vacations-item.component.html",
  styleUrls: ["./editor-vacations-item.component.scss"],
})
export class EditorVacationsItemComponent implements OnInit {
  @Input() employees: Employee[];
  @Input() vacations: Vacation[];

  @Output() editorVacationsEmitter = new EventEmitter<[Vacation, string]>();

  constructor() {}

  ngOnInit() {}

  getDayStyle(vacation: Vacation) {
    const parsedDay = moment(vacation.date).day();

    switch (parsedDay) {
      case 0:
        return { "grid-column": "1 / 2" };
      case 1:
        return { "grid-column": "2 / 3" };
      case 2:
        return { "grid-column": "3 / 4" };
      case 3:
        return { "grid-column": "4 / 5" };
      case 4:
        return { "grid-column": "6 / 7" };
      case 5:
        return { "grid-column": "7 / 8" };
      case 6:
        return { "grid-column": "8 / 9" };
    }
  }

  onAproveVacation(vacation: Vacation) {
    this.editorVacationsEmitter.emit([vacation, `onAproveVacation`]);
  }

  onDenyVacation(vacation: Vacation) {
    this.editorVacationsEmitter.emit([vacation, `onDenyVacation`]);
  }
}
