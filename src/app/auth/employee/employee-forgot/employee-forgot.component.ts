import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { AuthService } from "../../auth.service";

@Component({
  selector: "app-employee-forgot",
  templateUrl: "./employee-forgot.component.html",
  styleUrls: ["./employee-forgot.component.scss"],
})
export class EmployeeForgotComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;

  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getEmployeeAuthStatusListener()
      .subscribe((authStatus) => (this.isLoading = false));
  }

  onForgot(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword(`employee`, form.value.email);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
