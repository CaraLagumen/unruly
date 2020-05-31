import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { CalendarService } from "../../../calendar/calendar.service";
import { Shift } from "../../../shared/models/shift/shift.model";
import { WeeklyShift } from "../../../shared/models/shift/weekly-shift.model";
import { ShiftProperties } from "../../../shared/tools/custom-classes";

@Component({
  selector: "app-editor-shifts-item",
  templateUrl: "./editor-shifts-item.component.html",
  styleUrls: ["./editor-shifts-item.component.scss"],
})
export class EditorShiftsItemComponent implements OnInit {
  @Input() shifts$: Shift[];
  @Input() weeklyShifts$: WeeklyShift[];
  @Input() days: number[];
  @Input() selectedShiftDayNumber: 1 | 2 | 3 | 4 | 5;
  @Input() selectedShiftDaysArr: string[];

  @Output() editorShiftsEmitter = new EventEmitter<
    [Shift | WeeklyShift, string]
  >();

  daysInWords = ShiftProperties.daysInWords;

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {}

  getFormattedHour(hour: number) {
    return this.calendarService.getFormattedHour(hour);
  }

  getFormattedLocation(location: string) {
    return this.calendarService.getFormattedLocation(location);
  }

  getShiftDayClass(shiftId: string) {
    const indexOfSelectedShiftDay = this.selectedShiftDaysArr.indexOf(shiftId);
    if (indexOfSelectedShiftDay > -1) {
      return `shift-day-${indexOfSelectedShiftDay + 1}`;
    }

    return;
  }

  onSelectShift(shift: Shift) {
    this.editorShiftsEmitter.emit([shift, `onSelectShift`]);
  }

  onDeleteShift(shift: Shift) {
    this.editorShiftsEmitter.emit([shift, `onDeleteShift`]);
  }

  onSelectWeeklyShift(weeklyShift: WeeklyShift) {
    this.editorShiftsEmitter.emit([weeklyShift, `onSelectWeeklyShift`]);
  }

  onDeleteWeeklyShift(weeklyShift: WeeklyShift) {
    this.editorShiftsEmitter.emit([weeklyShift, `onDeleteWeeklyShift`]);
  }
}
