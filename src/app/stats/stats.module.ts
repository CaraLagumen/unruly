import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { StatsRoutingModule } from "./stats-routing.module";
import { RosterComponent } from "./roster/roster.component";
import { ShiftsComponent } from "./shifts/shifts.component";
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleItemComponent } from './schedule/schedule-item/schedule-item.component';

@NgModule({
  declarations: [RosterComponent, ShiftsComponent, ScheduleComponent, ScheduleItemComponent],
  imports: [CommonModule, RouterModule, StatsRoutingModule],
})
export class StatsModule {}
