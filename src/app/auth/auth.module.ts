import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { EmployeeLoginComponent } from "./employee/employee-login/employee-login.component";
import { EmployeeRegisterComponent } from "./employee/employee-register/employee-register.component";
import { EmployeeForgotComponent } from "./employee/employee-forgot/employee-forgot.component";
import { EmployeeResetComponent } from "./employee/employee-reset/employee-reset.component";
import { SchedulerLoginComponent } from "./scheduler/scheduler-login/scheduler-login.component";
import { SchedulerRegisterComponent } from "./scheduler/scheduler-register/scheduler-register.component";
import { SchedulerForgotComponent } from "./scheduler/scheduler-forgot/scheduler-forgot.component";
import { SchedulerResetComponent } from "./scheduler/scheduler-reset/scheduler-reset.component";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [
    EmployeeLoginComponent,
    EmployeeRegisterComponent,
    EmployeeForgotComponent,
    EmployeeResetComponent,
    SchedulerLoginComponent,
    SchedulerRegisterComponent,
    SchedulerForgotComponent,
    SchedulerResetComponent
  ],
  imports: [CommonModule, AuthRoutingModule, FormsModule],
})
export class AuthModule {}
