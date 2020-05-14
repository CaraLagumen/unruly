import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { AuthService } from "../../auth.service";

@Component({
  selector: "app-employee-register",
  templateUrl: "./employee-register.component.html",
  styleUrls: ["./employee-register.component.scss"],
})
export class EmployeeRegisterComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;

  isLoaded = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getEmployeeAuthStatusListener()
      .subscribe((authStatus) => (this.isLoaded = false));
  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoaded = true;

    this.authService.register(
      `employee`,
      form.value.firstName,
      form.value.lastName,
      form.value.email,
      form.value.password,
      form.value.passwordConfirm
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
