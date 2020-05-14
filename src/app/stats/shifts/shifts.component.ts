import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { ShiftService } from "../../shared/services/shift/shift.service";
import { WeeklyShiftService } from "../../shared/services/shift/weekly-shift.service";
import { Shift } from "../../shared/models/shift/shift.model";
import { WeeklyShift } from "../../shared/models/shift/weekly-shift.model";

@Component({
  selector: "app-shifts",
  templateUrl: "./shifts.component.html",
  styleUrls: ["./shifts.component.scss"],
})
export class ShiftsComponent implements OnInit {
  shifts$: Observable<Shift[]>;
  weeklyShifts$: Observable<WeeklyShift[]>;

  days = [
    `sunday`,
    `monday`,
    `tuesday`,
    `wednesday`,
    `thursday`,
    `friday`,
    `saturday`,
  ];

  constructor(
    private shiftService: ShiftService,
    private weeklyShiftService: WeeklyShiftService
  ) {}

  ngOnInit() {
    this.shifts$ = this.shiftService.getRawAllShifts();
    this.weeklyShifts$ = this.weeklyShiftService.getAllWeeklyShifts();
  }
}
