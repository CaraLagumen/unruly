import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { AuthService } from "../../auth.service";
import { AuthData } from "../../auth.model";

@Component({
  selector: "app-scheduler-register",
  templateUrl: "./scheduler-register.component.html",
  styleUrls: ["./scheduler-register.component.scss"],
})
export class SchedulerRegisterComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;

  isLoaded = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getSchedulerAuthStatusListener()
      .subscribe((authStatus) => (this.isLoaded = false));
  }

  onRegister(form: NgForm) {
    if (form.invalid) return;

    const authData: AuthData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      passwordConfirm: form.value.passwordConfirm,
    };

    this.authService.register(`scheduler`, authData, null);
    this.isLoaded = true;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
