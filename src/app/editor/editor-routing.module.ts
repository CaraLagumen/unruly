import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { EditorShiftsComponent } from "./editor-shifts/editor-shifts.component";
import { EditorScheduledComponent } from "./editor-scheduled/editor-scheduled.component";

const routes: Routes = [
  { path: "shifts", component: EditorShiftsComponent },
  {
    path: "scheduled",
    component: EditorScheduledComponent,
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorRoutingModule {}
