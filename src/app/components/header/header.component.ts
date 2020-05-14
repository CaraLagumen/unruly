import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../../auth/auth.service";
import { UserType } from "../../shared/models/custom-types";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private employeeAuthListenerSub: Subscription;
  private schedulerAuthListenerSub: Subscription;

  userType: UserType;

  employeeIsAuth = false;
  schedulerIsAuth = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.employeeIsAuth = this.authService.getEmployeeIsAuth();
    this.employeeAuthListenerSub = this.authService
      .getEmployeeAuthStatusListener()
      .subscribe((isAuth) => {
        this.employeeIsAuth = isAuth;
        this.userType = `employee`;
      });

    this.schedulerIsAuth = this.authService.getSchedulerIsAuth();
    this.schedulerAuthListenerSub = this.authService
      .getSchedulerAuthStatusListener()
      .subscribe((isAuth) => {
        this.schedulerIsAuth = isAuth;
        this.userType = `scheduler`;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.employeeAuthListenerSub.unsubscribe();
    this.schedulerAuthListenerSub.unsubscribe();
  }
}
