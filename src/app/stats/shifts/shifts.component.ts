import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { ShiftService } from "src/app/shared/services/shift/shift.service";
import { WeeklyShiftService } from "src/app/shared/services/shift/weekly-shift.service";
import { Shift } from "src/app/shared/models/shift/shift.model";
import { WeeklyShift } from "src/app/shared/models/shift/weekly-shift.model";

@Component({
  selector: "app-shifts",
  templateUrl: "./shifts.component.html",
  styleUrls: ["./shifts.component.scss"],
})
export class ShiftsComponent implements OnInit {
  shifts$: Observable<Shift[]>;
  weeklyShifts$: Observable<WeeklyShift[]>;

  constructor(
    private shiftService: ShiftService,
    private weeklyShiftService: WeeklyShiftService
  ) {}

  ngOnInit() {
    this.shifts$ = this.shiftService.getAllShifts();
    this.weeklyShifts$ = this.weeklyShiftService.getAllWeeklyShifts();
  }
}