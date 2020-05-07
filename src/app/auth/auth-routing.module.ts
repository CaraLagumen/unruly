import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { EmployeeLoginComponent } from "./employee/employee-login/employee-login.component";
import { EmployeeRegisterComponent } from "./employee/employee-register/employee-register.component";
import { EmployeeForgotComponent } from "./employee/employee-forgot/employee-forgot.component";
import { EmployeeResetComponent } from "./employee/employee-reset/employee-reset.component";
import { SchedulerLoginComponent } from "./scheduler/scheduler-login/scheduler-login.component";
import { SchedulerRegisterComponent } from "./scheduler/scheduler-register/scheduler-register.component";
import { SchedulerForgotComponent } from "./scheduler/scheduler-forgot/scheduler-forgot.component";
import { SchedulerResetComponent } from "./scheduler/scheduler-reset/scheduler-reset.component";

const routes: Routes = [
  {
    // path: "login/:state",
    path: "employee/login",
    component: EmployeeLoginComponent,
  },
  {
    path: "employee/register",
    component: EmployeeRegisterComponent,
  },
  {
    // path: "forgot/:state",
    path: "employee/forgot",
    component: EmployeeForgotComponent,
  },
  {
    path: "employee/reset/:token",
    component: EmployeeResetComponent,
  },
  {
    // path: "login/:state",
    path: "scheduler/login",
    component: SchedulerLoginComponent,
  },
  {
    path: "scheduler/register",
    component: SchedulerRegisterComponent,
  },
  {
    // path: "forgot/:state",
    path: "scheduler/forgot",
    component: SchedulerForgotComponent,
  },
  {
    path: "scheduler/reset/:token",
    component: SchedulerResetComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
