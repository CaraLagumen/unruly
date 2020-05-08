import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { AuthService } from "../../auth.service";

@Component({
  selector: "app-scheduler-register",
  templateUrl: "./scheduler-register.component.html",
  styleUrls: ["./scheduler-register.component.scss"],
})
export class SchedulerRegisterComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;

  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getSchedulerAuthStatusListener()
      .subscribe((authStatus) => (this.isLoading = false));
  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.register(
      `scheduler`,
      form.value.name,
      form.value.email,
      form.value.password,
      form.value.passwordConfirm
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
