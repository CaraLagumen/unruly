import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { EmployeeComponent } from "./employee/employee.component";
import { SchedulerComponent } from "./scheduler/scheduler.component";

const routes: Routes = [
  {
    path: "employee/profile",
    component: EmployeeComponent,
  },
  {
    path: "scheduler/profile",
    component: SchedulerComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
