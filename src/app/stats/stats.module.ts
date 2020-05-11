import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StatsRoutingModule } from "./stats-routing.module";
import { StatsComponent } from "./stats.component";
import { RosterComponent } from "./roster/roster.component";
import { ShiftsComponent } from "./shifts/shifts.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [StatsComponent, RosterComponent, ShiftsComponent],
  imports: [CommonModule, RouterModule, StatsRoutingModule],
})
export class StatsModule {}
