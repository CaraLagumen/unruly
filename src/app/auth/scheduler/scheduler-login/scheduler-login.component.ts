import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { AuthService } from "../../auth.service";

@Component({
  selector: "app-scheduler-login",
  templateUrl: "./scheduler-login.component.html",
  styleUrls: ["./scheduler-login.component.scss"],
})
export class SchedulerLoginComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;

  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getSchedulerAuthStatusListener()
      .subscribe((authStatus) => (this.isLoading = false));
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(`scheduler`, form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
