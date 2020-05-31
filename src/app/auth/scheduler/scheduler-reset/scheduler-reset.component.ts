import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, public authService: AuthService) {
    //FETCH TOKEN FROM ROUTE
    this.route.params.subscribe((param) => (this.token = param["token"]));
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getSchedulerAuthStatusListener()
      .subscribe();
  }

  onReset(form: NgForm) {
    if (form.invalid) {
      return;
    }

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
