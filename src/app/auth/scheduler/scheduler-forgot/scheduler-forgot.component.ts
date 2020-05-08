import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { AuthService } from "../../auth.service";

@Component({
  selector: "app-scheduler-forgot",
  templateUrl: "./scheduler-forgot.component.html",
  styleUrls: ["./scheduler-forgot.component.scss"],
})
export class SchedulerForgotComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;

  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getSchedulerAuthStatusListener()
      .subscribe((authStatus) => (this.isLoading = false));
  }

  onForgot(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword(`scheduler`, form.value.email);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
