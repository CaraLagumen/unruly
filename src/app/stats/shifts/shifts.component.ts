import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

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
  shiftsRT$: Observable<Shift[]>;
  shiftsFC$: Observable<Shift[]>;
  shiftsEtc$: Observable<Shift[]>;
  weeklyShifts$: Observable<WeeklyShift[]>;

  days = ShiftProperties.daysInWords;

  constructor(
    private shiftService: ShiftService,
    private weeklyShiftService: WeeklyShiftService,
    private calendarService: CalendarService
  ) {}

  ngOnInit() {
    this.weeklyShifts$ = this.weeklyShiftService.getAllWeeklyShifts();

    this.shiftsRT$ = this.shiftService
      .getRawAllShifts()
      .pipe(
        map((shifts: Shift[]) =>
          shifts.filter((shift: Shift) => shift.location === `rotunda`)
        )
      );

    this.shiftsFC$ = this.shiftService
      .getRawAllShifts()
      .pipe(
        map((shifts: Shift[]) =>
          shifts.filter((shift: Shift) => shift.location === `food court`)
        )
      );

    this.shiftsEtc$ = this.shiftService
      .getRawAllShifts()
      .pipe(
        map((shifts: Shift[]) =>
          shifts.filter(
            (shift: Shift) =>
              shift.location === `tower 1` ||
              shift.location === `tower 2` ||
              shift.location === `pool` ||
              shift.location === `breaker`
          )
        )
      );
  }

  getFormattedHour(hour: number) {
    return this.calendarService.getFormattedHour(hour);
  }

  getFormattedLocation(location: string) {
    return this.calendarService.getFormattedLocation(location);
  }
}
