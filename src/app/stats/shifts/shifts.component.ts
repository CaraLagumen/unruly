import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { ShiftService } from "../../shared/services/shift/shift.service";
import { WeeklyShiftService } from "../../shared/services/shift/weekly-shift.service";
import { CalendarService } from "src/app/calendar/calendar.service";
import { Shift } from "../../shared/models/shift/shift.model";
import { WeeklyShift } from "../../shared/models/shift/weekly-shift.model";
import { ShiftProperties } from "../../shared/tools/custom-classes";

@Component({
  selector: "app-shifts",
  templateUrl: "./shifts.component.html",
  styleUrls: ["./shifts.component.scss"],
})
export class ShiftsComponent implements OnInit {
  shifts$: Observable<Shift[]>;
  weeklyShifts$: Observable<WeeklyShift[]>;

  days = ShiftProperties.daysInWords;

  constructor(
    private shiftService: ShiftService,
    private weeklyShiftService: WeeklyShiftService,
    private calendarService: CalendarService
  ) {}

  ngOnInit() {
    this.shifts$ = this.shiftService.getRawAllShifts();
    this.weeklyShifts$ = this.weeklyShiftService.getAllWeeklyShifts();
  }

  getFormattedHour(hour: number) {
    return this.calendarService.getFormattedHour(hour);
  }

  getFormattedLocation(location: string) {
    return this.calendarService.getFormattedLocation(location);
  }
}
