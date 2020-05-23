import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import * as moment from "moment";

import { UsersService } from "../../users/users.service";
import { EmployeeService } from "../../shared/services/users/employee.service";
import { VacationService } from "../../shared/services/shift/vacation.service";
import { Employee } from "../../shared/models/users/employee.model";
import { Scheduler } from "../../shared/models/users/scheduler.model";
import { Vacation } from "../../shared/models/shift/vacation.model";

@Component({
  selector: "app-editor-vacations",
  templateUrl: "./editor-vacations.component.html",
  styleUrls: ["./editor-vacations.component.scss"],
})
export class EditorVacationsComponent implements OnInit, OnDestroy {
  private schedulerSub: Subscription;

  scheduler: Scheduler;
  employees$: Observable<Employee[]>;
  vacations$: Observable<Vacation[]>;

  constructor(
    private usersService: UsersService,
    private employeeService: EmployeeService,
    private vacationService: VacationService
  ) {}

  ngOnInit() {
    //1. GRAB DATA
    this.employees$ = this.employeeService.getAllEmployees();
    this.vacations$ = this.getVacations();

    //2. GRAB SCHEDULER ID
    this.schedulerSub = this.usersService
      .getUser(`scheduler`)
      .subscribe((schedulerData: Scheduler) => {
        this.scheduler = schedulerData;
      });
  }

  getVacations() {
    return this.vacationService
      .getRawAllVacations()
      .pipe(
        filter(
          (vacations: Vacation[], i) => moment(vacations[i].date) > moment()
        )
      );
  }

  onEditorVacationsControl(emittedData: [Vacation, string]) {
    switch (emittedData[1]) {
      case `onAproveVacation`:
        this.onAproveVacation(emittedData[0] as Vacation);
        break;
      case `onDenyVacation`:
        this.onDenyVacation(emittedData[0] as Vacation);
        break;
    }
  }

  updateData() {
    this.vacations$ = this.getVacations();
  }

  onAproveVacation(vacation: Vacation) {
    this.vacationService
      .updateVacation(vacation.id, {
        scheduler: this.scheduler.id,
        approved: true,
      })
      .subscribe(() => this.updateData());
  }

  onDenyVacation(vacation: Vacation) {
    this.vacationService
      .updateVacation(vacation.id, {
        scheduler: this.scheduler.id,
        approved: false,
      })
      .subscribe(() => this.updateData());
  }

  ngOnDestroy() {
    if (this.schedulerSub) this.schedulerSub.unsubscribe();
  }
}
