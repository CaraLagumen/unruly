import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { EditorShiftsComponent } from "./editor-shifts/editor-shifts.component";
import { EditorScheduledComponent } from "./editor-scheduled/editor-scheduled.component";
import { EditorVacationsComponent } from "./editor-vacations/editor-vacations.component";

const routes: Routes = [
  { path: "shifts", component: EditorShiftsComponent },
  {
    path: "scheduled",
    component: EditorScheduledComponent,
  },
  {
    path: "vacations",
    component: EditorVacationsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorRoutingModule {}
