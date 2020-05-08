import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { AuthService } from "../../auth.service";

@Component({
  selector: "app-employee-reset",
  templateUrl: "./employee-reset.component.html",
  styleUrls: ["./employee-reset.component.scss"],
})
export class EmployeeResetComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;

  token: string;

  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getEmployeeAuthStatusListener()
      .subscribe((authStatus) => (this.isLoading = false));
  }

  onReset(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword(
      `employee`,
      this.token,
      form.value.password,
      form.value.passwordConfirm
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
