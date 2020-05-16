import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Employee } from "../../shared/models/users/employee.model";
import { Scheduler } from "../../shared/models/users/scheduler.model";
import { Shift } from "../../shared/models/shift/shift.model";
import { Scheduled } from "../../shared/models/shift/scheduled.model";
import { WeeklyShift } from "../../shared/models/shift/weekly-shift.model";
import { WeeklyScheduled } from "../../shared/models/shift/weekly-scheduled.model";

@Component({
  selector: "app-editor-shifts",
  templateUrl: "./editor-shifts.component.html",
  styleUrls: ["./editor-shifts.component.scss"],
})
export class EditorShiftsComponent implements OnInit {
  @Input() employees: Employee[];
  @Input() schedulers: Scheduler[];
  @Input() shifts: Shift[];
  @Input() scheduled: Scheduled[];
  @Input() weeklyShifts: WeeklyShift[];
  @Input() weeklyScheduled: WeeklyScheduled[];

  shiftId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.shiftId = this.route.snapshot.paramMap.get("shiftId");
  }
}
