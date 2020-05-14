import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { AuthService } from "../../auth.service";

@Component({
  selector: "app-employee-login",
  templateUrl: "./employee-login.component.html",
  styleUrls: ["./employee-login.component.scss"],
})
export class EmployeeLoginComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;

  isLoaded = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getEmployeeAuthStatusListener()
      .subscribe((authStatus) => (this.isLoaded = false));
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoaded = true;
    this.authService.login(`employee`, form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
