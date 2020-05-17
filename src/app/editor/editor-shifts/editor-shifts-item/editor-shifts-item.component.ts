import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { Shift } from "../../../shared/models/shift/shift.model";
import { WeeklyShift } from "../../../shared/models/shift/weekly-shift.model";

@Component({
  selector: "app-editor-shifts-item",
  templateUrl: "./editor-shifts-item.component.html",
  styleUrls: ["./editor-shifts-item.component.scss"],
})
export class EditorShiftsItemComponent implements OnInit {
  @Input() shifts: Shift[];
  @Input() weeklyShifts: WeeklyShift[];
  @Input() days: number[];
  @Input() selectedShiftDayNumber: 1 | 2 | 3 | 4 | 5;

  @Output() editorShiftsEmitter = new EventEmitter<
    [Shift | WeeklyShift, string]
  >();

  constructor() {}

  ngOnInit() {}

  onSelectShift(shift: Shift) {
    this.editorShiftsEmitter.emit([shift, `onSelectShift`]);
  }

  onDeleteShift(shift: Shift) {
    this.editorShiftsEmitter.emit([shift, `onDeleteShift`]);
  }

  onDeleteWeeklyShift(weeklyShift: WeeklyShift) {
    this.editorShiftsEmitter.emit([weeklyShift, `onDeleteWeeklyShift`]);
  }
}
