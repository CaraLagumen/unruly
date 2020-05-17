import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { Employee } from "../../../shared/models/users/employee.model";
import { Shift } from "../../../shared/models/shift/shift.model";
import { WeeklyShift } from "../../../shared/models/shift/weekly-shift.model";

@Component({
  selector: "app-editor-scheduled-item",
  templateUrl: "./editor-scheduled-item.component.html",
  styleUrls: ["./editor-scheduled-item.component.scss"],
})
export class EditorScheduledItemComponent implements OnInit {
  @Input() employees: Employee[];
  @Input() shifts: Shift[];
  @Input() weeklyShifts: WeeklyShift[];
  @Input() days: number[];

  @Output() editorScheduledEmitter = new EventEmitter<
    [Shift | WeeklyShift | Employee, string]
  >();

  constructor() {}

  ngOnInit() {}

  onSelectShift(shift: Shift) {
    this.editorScheduledEmitter.emit([shift, `onSelectShift`]);
  }

  onSelectWeeklyShift(weeklyShift: WeeklyShift) {
    this.editorScheduledEmitter.emit([weeklyShift, `onSelectWeeklyShift`]);
  }

  onSelectEmployee(employee: Employee) {
    this.editorScheduledEmitter.emit([employee, `onSelectEmployee`]);
  }
}
