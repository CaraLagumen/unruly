import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";

import { UsersService } from "../users.service";
import { AuthService } from "../../auth/auth.service";
import { EmployeeData } from "../users-data.model";
import { Employee } from "../../shared/models/users/employee.model";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.scss"],
})
export class EmployeeComponent implements OnInit, OnDestroy {
  private employeeSub: Subscription;

  updateEmployeeForm: FormGroup;
  employee: Employee;

  shiftSlots = [`morning`, `day`, `swing`, `graveyard`];
  daysOff = [
    `sunday`,
    `monday`,
    `tuesday`,
    `wednesday`,
    `thursday`,
    `friday`,
    `saturday`,
  ];

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    //1. INITIALIZE EMPLOYEE PROFILE FORM
    this.updateEmployeeForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.email],
      }),
      preferredShiftSlots1: new FormControl(null),
      preferredShiftSlots2: new FormControl(null),
      preferredShiftSlots3: new FormControl(null),
      preferredDaysOff1: new FormControl(null),
      preferredDaysOff2: new FormControl(null),
    });

    //2. EXPOSE EMPLOYEE DATA FOR DISPLAY AND PLUG IN
    //   EXISTING VALUES FOR FORM
    this.employeeSub = this.usersService
      .getUser(`employee`)
      .subscribe((employeeData: Employee) => {
        this.employee = employeeData;

        //CONVERT NUMBER TO STRING FOR DAYS OFF
        const dayOff1 = employeeData.preferredDaysOff[0];
        const dayOff2 = employeeData.preferredDaysOff[1];

        this.updateEmployeeForm.controls["email"].setValue(employeeData.email);
        this.updateEmployeeForm.controls["preferredShiftSlots1"].setValue(
          employeeData.preferredShiftSlots[0]
        );
        this.updateEmployeeForm.controls["preferredShiftSlots2"].setValue(
          employeeData.preferredShiftSlots[1]
        );
        this.updateEmployeeForm.controls["preferredShiftSlots3"].setValue(
          employeeData.preferredShiftSlots[2]
        );
        this.updateEmployeeForm.controls["preferredDaysOff1"].setValue(
          this.daysOff[dayOff1]
        );
        this.updateEmployeeForm.controls["preferredDaysOff2"].setValue(
          this.daysOff[dayOff2]
        );
      });
  }

  onUpdateEmployee() {
    if (this.updateEmployeeForm.invalid) return;

    //CONVERT STRING TO NUMBER FOR SUBMISSION TO API
    const dayOff1 = this.daysOff.indexOf(
      this.updateEmployeeForm.value.preferredDaysOff1
    );
    const dayOff2 = this.daysOff.indexOf(
      this.updateEmployeeForm.value.preferredDaysOff2
    );

    const employeeData: EmployeeData = {
      email: this.updateEmployeeForm.value.email,
      preferredShiftSlots: [
        this.updateEmployeeForm.value.preferredShiftSlots1,
        this.updateEmployeeForm.value.preferredShiftSlots2,
        this.updateEmployeeForm.value.preferredShiftSlots3,
      ],
      preferredDaysOff: [dayOff1, dayOff2],
    };

    this.usersService
      .updateUser(`employee`, employeeData)
      .subscribe(() => this.updateEmployeeForm.reset());
  }

  onChangePassword(form: NgForm) {
    if (form.invalid) return;

    this.authService.changePassword(
      `employee`,
      form.value.passwordCurrent,
      form.value.password,
      form.value.passwordConfirm
    );

    this.updateEmployeeForm.reset();
  }

  ngOnDestroy() {
    this.employeeSub.unsubscribe();
  }
}
