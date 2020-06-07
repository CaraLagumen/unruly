import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import * as momentTimezone from "moment-timezone";

import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(private authService: AuthService) {
    this.setDefaultTimezone();
  }

  ngOnInit() {
    this.authService.autoLogin();
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData["animation"]
    );
  }

  setDefaultTimezone() {
    momentTimezone.tz.setDefault("Etc/UTC");
  }
}
