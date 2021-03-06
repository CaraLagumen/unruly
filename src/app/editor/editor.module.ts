import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';

import { EditorRoutingModule } from "./editor-routing.module";
import { EditorShiftsComponent } from "./editor-shifts/editor-shifts.component";
import { EditorShiftsItemComponent } from './editor-shifts/editor-shifts-item/editor-shifts-item.component';
import { EditorScheduledComponent } from "./editor-scheduled/editor-scheduled.component";
import { EditorScheduledItemComponent } from './editor-scheduled/editor-scheduled-item/editor-scheduled-item.component';
import { EditorVacationsComponent } from './editor-vacations/editor-vacations.component';
import { EditorVacationsItemComponent } from './editor-vacations/editor-vacations-item/editor-vacations-item.component';

@NgModule({
  declarations: [
    EditorShiftsComponent,
    EditorShiftsItemComponent,
    EditorScheduledComponent,
    EditorScheduledItemComponent,
    EditorVacationsComponent,
    EditorVacationsItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    EditorRoutingModule,
    ReactiveFormsModule,
  ],
})
export class EditorModule {}
