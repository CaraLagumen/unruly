import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";

import { UsersService } from "../users.service";
import { AuthService } from "../../auth/auth.service";
import { AlertService } from "../../components/alert/alert.service";
import { SchedulerData } from "../users-data.model";
import { Scheduler } from "../../shared/models/users/scheduler.model";

@Component({
  selector: "app-scheduler",
  templateUrl: "./scheduler.component.html",
  styleUrls: ["./scheduler.component.scss"],
})
export class SchedulerComponent implements OnInit, OnDestroy {
  private schedulerSub: Subscription;

  updateSchedulerForm: FormGroup;
  scheduler: Scheduler;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    //1. INITIALIZE SCHEDULER PROFILE FORM
    this.updateSchedulerForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.email],
      }),
    });

    //2. EXPOSE SCHEDULER DATA FOR DISPLAY AND PLUG IN
    //   EXISTING VALUES FOR FORM
    this.schedulerSub = this.usersService
      .getUser(`scheduler`)
      .subscribe((schedulerData: Scheduler) => {
        this.scheduler = schedulerData;

        this.updateSchedulerForm.controls["email"].setValue(
          schedulerData.email
        );
      });
  }

  onUpdateScheduler() {
    if (this.updateSchedulerForm.invalid) return;

    const schedulerData: SchedulerData = {
      email: this.updateSchedulerForm.value.email,
    };

    this.usersService.updateUser(`scheduler`, schedulerData).subscribe(
      () => {
        this.alertService.success(`Successful update email`, {
          autoClose: true,
          keepAfterRouteChange: true,
        });

        this.updateSchedulerForm.reset();
        this.ngOnInit();
      },
      (err) => {
        this.alertService.error(`Unable to update with that email`, {
          autoClose: true,
          keepAfterRouteChange: true,
        });
      }
    );
  }

  onChangePassword(form: NgForm) {
    if (form.invalid) return;

    this.authService.changePassword(
      `scheduler`,
      form.value.passwordCurrent,
      form.value.password,
      form.value.passwordConfirm
    );

    this.updateSchedulerForm.reset();
  }

  ngOnDestroy() {
    this.schedulerSub.unsubscribe();
  }
}
