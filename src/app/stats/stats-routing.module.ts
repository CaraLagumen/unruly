import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { StatsComponent } from "./stats.component";
import { RosterComponent } from "./roster/roster.component";
import { ShiftsComponent } from "./shifts/shifts.component";
import { ScheduleComponent } from "./schedule/schedule.component";

const routes: Routes = [
  { path: "", component: StatsComponent },
  { path: "roster", component: RosterComponent },
  { path: "shifts", component: ShiftsComponent },
  { path: "schedule/:date", component: ScheduleComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsRoutingModule {}
