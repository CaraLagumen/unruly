import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { CalendarService } from "../../../calendar/calendar.service";
import { Employee } from "../../../shared/models/users/employee.model";
import { Shift } from "../../../shared/models/shift/shift.model";
import { WeeklyShift } from "../../../shared/models/shift/weekly-shift.model";
import { WeeklyScheduled } from "../../../shared/models/shift/weekly-scheduled.model";
import { ShiftProperties } from "../../../shared/tools/custom-classes";

@Component({
  selector: "app-editor-scheduled-item",
  templateUrl: "./editor-scheduled-item.component.html",
  styleUrls: ["./editor-scheduled-item.component.scss"],
})
export class EditorScheduledItemComponent implements OnInit {
  @Input() employees$: Employee[];
  @Input() shifts$: Shift[];
  @Input() weeklyShifts$: WeeklyShift[];
  @Input() weeklyScheduled$: WeeklyScheduled[];
  @Input() selectedEmployee: string;
  @Input() selectedShift: string;
  @Input() selectedWeeklyShift: string;
  @Input() selectedWeeklyScheduled: string;
  @Input() days: number[];

  @Output() editorScheduledEmitter = new EventEmitter<
    [Shift | WeeklyShift | WeeklyScheduled | Employee, string]
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

  getSelectedClass(
    type: `shift` | `weeklyShift` | `weeklyScheduled` | `employee`,
    id: string
  ) {
    if (type === `shift` && id === this.selectedShift) return true;
    if (type === `weeklyShift` && id === this.selectedWeeklyShift) return true;
    if (type === `weeklyScheduled` && id === this.selectedWeeklyScheduled)
      return true;
    if (type === `employee` && id === this.selectedEmployee) return true;

    return false;
  }

  onSelectShift(shift: Shift) {
    this.editorScheduledEmitter.emit([shift, `onSelectShift`]);
  }

  onSelectWeeklyShift(weeklyShift: WeeklyShift) {
    this.editorScheduledEmitter.emit([weeklyShift, `onSelectWeeklyShift`]);
  }

  onSelectWeeklyScheduled(weeklyScheduled: WeeklyScheduled) {
    this.editorScheduledEmitter.emit([
      weeklyScheduled,
      `onSelectWeeklyScheduled`,
    ]);
  }

  onDeleteWeeklyScheduled(weeklyScheduled: WeeklyScheduled) {
    this.editorScheduledEmitter.emit([
      weeklyScheduled,
      `onDeleteWeeklyScheduled`,
    ]);
  }

  onSelectEmployee(employee: Employee) {
    this.editorScheduledEmitter.emit([employee, `onSelectEmployee`]);
  }
}
