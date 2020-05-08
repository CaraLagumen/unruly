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

  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getEmployeeAuthStatusListener()
      .subscribe((authStatus) => (this.isLoading = false));
  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.register(
      `employee`,
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
