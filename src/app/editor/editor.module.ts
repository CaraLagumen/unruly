import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from '@angular/forms';

import { EditorRoutingModule } from "./editor-routing.module";
import { EditorComponent } from "./editor.component";
import { EditorShiftsComponent } from "./editor-shifts/editor-shifts.component";
import { EditorScheduledComponent } from "./editor-scheduled/editor-scheduled.component";

@NgModule({
  declarations: [
    EditorComponent,
    EditorShiftsComponent,
    EditorScheduledComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    EditorRoutingModule,
    ReactiveFormsModule,
  ],
})
export class EditorModule {}
