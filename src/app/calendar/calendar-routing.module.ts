import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { CalendarComponent } from "./calendar.component";
import { DayComponent } from "./day/day.component";
import { WeekComponent } from "./week/week.component";

const routes: Routes = [
  {
    path: "",
    component: CalendarComponent,
  },
  { path: "day/:date", component: DayComponent },
  { path: "week", component: WeekComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
