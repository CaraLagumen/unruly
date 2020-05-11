import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { CalendarRoutingModule } from "./calendar-routing.module";
import { CalendarComponent } from "./calendar.component";
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
  imports: [CommonModule, RouterModule, CalendarRoutingModule],
})
export class CalendarModule {}
