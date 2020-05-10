import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { CalendarComponent } from "./calendar.component";
import { CalendarRoutingModule } from "./calendar-routing.module";
import { CalendarItemComponent } from "./calendar-item/calendar-item.component";
import { DayComponent } from "./day/day.component";
import { WeekComponent } from "./week/week.component";

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarItemComponent,
    DayComponent,
    WeekComponent,
  ],
  imports: [CalendarRoutingModule, RouterModule, CommonModule],
})
export class CalendarModule {}
