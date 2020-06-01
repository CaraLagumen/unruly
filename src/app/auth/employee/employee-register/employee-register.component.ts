import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { map } from "rxjs/operators";

import { AuthService } from "../../auth.service";
import { EmployeeService } from "../../../shared/services/users/employee.service";
import { AuthData } from "../../auth.model";
import { Employee } from "../../../shared/models/users/employee.model";
import { ShiftProperties } from "../../../shared/tools/custom-classes";

@Component({
  selector: "app-employee-register",
  templateUrl: "./employee-register.component.html",
  styleUrls: ["./employee-register.component.scss"],
})
export class EmployeeRegisterComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  private employeeSub: Subscription;

  employeeSeniorities: number[];

  isLoaded = false;
  shiftSlots = ShiftProperties.slots;
  days = ShiftProperties.days;

  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getEmployeeAuthStatusListener()
      .subscribe((authStatus) => (this.isLoaded = false));

    this.getEmployeeSeniorities();
  }

  //QUICK REGISTER (TEMPORARY)----------------------------------------------------------

  getEmployeeSeniorities() {
    this.employeeSub = this.employeeService
      .getAllEmployees()
      .pipe(
        map((employees: Employee[]) => {
          return employees.map((employee: Employee) => {
            return employee.seniority;
          });
        })
      )
      .subscribe((seniorities: number[]) => {
        this.employeeSeniorities = seniorities;
      });
  }

  getRandomDate() {
    const startDate = new Date(2020, 1, 1).getTime();
    const endDate = new Date(Date.now()).getTime();

    const randomDate = new Date(
      startDate + Math.random() * (endDate - startDate)
    );

    return randomDate.toISOString();
  }

  getRandomShiftSlots() {
    let newShiftSlots = [...this.shiftSlots].sort(() => 0.5 - Math.random());
    newShiftSlots.pop();
    return newShiftSlots;
  }

  getRandomDaysOff() {
    let newDaysOff = [...this.days].sort(() => 0.5 - Math.random());
    newDaysOff = newDaysOff.slice(0, 2);
    return newDaysOff;
  }

  //MAIN----------------------------------------------------------

  onRegister(form: NgForm) {
    if (form.invalid) return;

    //FOR TESTING ONLY
    const employeeData = {
      position: `barista`,
      status: `on-call`,
      seniority: Math.max(...this.employeeSeniorities) + 1,
      hireDate: this.getRandomDate(),
      preferredShiftSlots: this.getRandomShiftSlots(),
      preferredDaysOff: this.getRandomDaysOff(),
    };

    const authData: AuthData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      passwordConfirm: form.value.passwordConfirm,
    };

    this.authService.register(`employee`, authData, employeeData);
    this.isLoaded = true;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.employeeSub.unsubscribe();
  }
}
