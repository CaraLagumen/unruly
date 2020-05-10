import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { EmployeeComponent } from "./employee/employee.component";
import { SchedulerComponent } from "./scheduler/scheduler.component";
import { UsersRoutingModule } from "./users-routing.module";

@NgModule({
  declarations: [EmployeeComponent, SchedulerComponent],
  imports: [CommonModule, UsersRoutingModule, FormsModule, ReactiveFormsModule],
})
export class UsersModule {}
