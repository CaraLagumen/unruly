import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, NavigationStart } from "@angular/router";
import * as lodash from "lodash";

import { Alert, AlertType } from "./alert.model";
import { AlertService } from "./alert.service";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.scss"],
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = "default-alert";

  alertListenerSub: Subscription;
  routeSub: Subscription;
  alerts: Alert[] = [];

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    //1. LISTEN FOR NEW ALERTS
    this.alertListenerSub = this.alertService
      .onAlert(this.id)
      .subscribe((alert) => {
        //2. CLEAR ALERTS IF THERE IS NONE
        if (!alert.message) {
          //3. FILTER OUT ALERTS WITH keepAfterRouteChange FLAG
          this.alerts = this.alerts.filter((el) => el.keepAfterRouteChange);

          //4. REMOVE keepAfterRouteChange FLAG ON REMAINDER
          this.alerts.forEach((el) => delete el.keepAfterRouteChange);
          return;
        }

        //5. ADD ALERT TO ARR
        this.alerts.push(alert);

        //6.AUTO CLOSE IF AN OPTION
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 8000);
        }

        //7. PARSE SERVICE IF AN OPTION
        if (alert.parseService) {
          alert.message = lodash.startCase(alert.message);
        }

        //8. PARSE ERROR IF AN OPTION (WORKS ONLY WITH appError IN SERVER utils)
        if (alert.parseError) {
          const indexStart = alert.message.indexOf(`Error:`);
          const indexEnd = alert.message.indexOf(`<br>`);
          alert.message = alert.message.substring(indexStart, indexEnd);
        }
      });

    //9. CLEAR ALERTS ON ROUTE CHANGE
    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter((el) => el !== alert);
  }

  styleClass(alert: Alert) {
    if (!alert) return;

    const classes = ["alert"];

    const alertTypeClass = {
      [AlertType.Success]: "alert__success",
      [AlertType.Info]: "alert__info",
      [AlertType.Warning]: "alert__warning",
      [AlertType.Error]: "alert__danger",
    };

    classes.push(alertTypeClass[alert.type]);

    return classes.join(" ");
  }

  ngOnDestroy() {
    this.alertListenerSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}
