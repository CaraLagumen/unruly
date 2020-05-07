import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { CalendarComponent } from "./calendar.component";
import { DayComponent } from "./day/day.component";
import { MonthComponent } from "./month/month.component";
import { WeekComponent } from "./week/week.component";

const routes: Routes = [
  {
    path: "",
    component: CalendarComponent,
  },
  { path: "day/:id", component: DayComponent },
  { path: "month", component: MonthComponent },
  { path: "week", component: WeekComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
