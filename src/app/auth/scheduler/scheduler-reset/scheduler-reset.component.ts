import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { AuthService } from "../../auth.service";

@Component({
  selector: "app-scheduler-reset",
  templateUrl: "./scheduler-reset.component.html",
  styleUrls: ["./scheduler-reset.component.scss"],
})
export class SchedulerResetComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;

  token: string;

  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getSchedulerAuthStatusListener()
      .subscribe((authStatus) => (this.isLoading = false));
  }

  onReset(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword(
      `scheduler`,
      this.token,
      form.value.password,
      form.value.passwordConfirm
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
