import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { CalendarRoutingModule } from "./calendar-routing.module";
import { CalendarComponent } from "./calendar.component";
import { CalendarItemComponent } from "./calendar-item/calendar-item.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { DayComponent } from "./day/day.component";
import { WeekComponent } from "./week/week.component";
import { WeekItemComponent } from './week/week-item/week-item.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarItemComponent,
    DashboardComponent,
    DayComponent,
    WeekComponent,
    WeekItemComponent,
  ],
  imports: [CommonModule, RouterModule, CalendarRoutingModule],
})
export class CalendarModule {}
