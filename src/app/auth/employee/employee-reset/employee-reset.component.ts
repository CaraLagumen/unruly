import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, public authService: AuthService) {
    //FETCH TOKEN FROM ROUTE
    this.route.params.subscribe((param) => (this.token = param["token"]));
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getEmployeeAuthStatusListener()
      .subscribe();
  }

  onReset(form: NgForm) {
    if (form.invalid) {
      return;
    }

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
