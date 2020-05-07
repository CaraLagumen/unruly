import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./auth/auth.component";
import { EmployeeComponent } from "./auth/employee/employee.component";
import { SchedulerComponent } from "./auth/scheduler/scheduler.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AlertComponent } from "./components/alert/alert.component";
import { CalendarModule } from "./calendar/calendar.module";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    EmployeeComponent,
    SchedulerComponent,
    HeaderComponent,
    FooterComponent,
    AlertComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, CalendarModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
