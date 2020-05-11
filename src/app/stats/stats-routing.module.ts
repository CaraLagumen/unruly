import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { StatsComponent } from './stats.component';
import { RosterComponent } from "./roster/roster.component";
import { ShiftsComponent } from "./shifts/shifts.component";

const routes: Routes = [
  { path: "stats", component: StatsComponent },
  { path: "stats/roster", component: RosterComponent },
  { path: "stats/shifts", component: ShiftsComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsRoutingModule {}
