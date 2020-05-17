import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { FormGroup, FormControl } from "@angular/forms";

import { EmployeeService } from "../../shared/services/users/employee.service";
import { ShiftService } from "../../shared/services/shift/shift.service";
import { ScheduledService } from "../../shared/services/shift/scheduled.service";
import { Employee } from "../../shared/models/users/employee.model";
import { Shift } from "../../shared/models/shift/shift.model";
import { EditShift, EditShiftEmit } from "../../shared/models/custom-types";
import { ShiftProperties } from "../../shared/tools/custom-classes";
import { ScheduledData } from "../../shared/models/shift/scheduled.model";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private editShiftSub: Subscription;
  private employeeSub: Subscription;

  @Input() employeeIsAuth;
  @Input() schedulerIsAuth;
  @Input() editShiftObs: Observable<any>;

  @Output() schedulerEmitter = new EventEmitter<[string, EditShift]>();

  employees: Employee[];
  editShift: EditShift;
  editShiftId: string;
  editShiftDay: moment.Moment;
  updateShiftForm: FormGroup;
  createScheduledForm: FormGroup;

  editShiftMenu = false;
  updateShiftFormToggle = false;
  createScheduledFormToggle = false;

  //UPDATE SHIFT FORM
  positions = ShiftProperties.positions;
  slots = ShiftProperties.slots;
  locations = ShiftProperties.locations;
  days = ShiftProperties.days;
  shiftHours = ShiftProperties.shiftHours;

  constructor(
    private employeeService: EmployeeService,
    private shiftService: ShiftService,
    private scheduledService: ScheduledService
  ) {}

  ngOnInit() {
    //GRAB EDIT SHIFT INFO FROM PARENT (CALENDAR) OBS
    this.editShiftSub = this.editShiftObs.subscribe(
      (emittedData: EditShiftEmit) => {
        this.editShift = [emittedData[0], emittedData[1]];
        this.editShiftId = emittedData[0].id;
        this.editShiftDay = emittedData[2];
        this.onToggleEditShiftMenu(`open`);
      }
    );
  }

  //TOOLS----------------------------------------------------------

  onSchedulerEmitter(type: `deleteShift` | `deleteScheduled`) {
    const data = this.editShift;

    this.schedulerEmitter.emit([type, data]);

    if (this.editShiftMenu) {
      this.onToggleEditShiftMenu(`close`);
    }
  }

  onToggleEditShiftMenu(type: `open` | `close`) {
    type === `open`
      ? (this.editShiftMenu = true)
      : (this.editShiftMenu = false);
  }

  onToggleUpdateShiftForm(type: `open` | `close`) {
    type === `open`
      ? this.initUpdateShiftForm()
      : (this.updateShiftFormToggle = false);
  }

  onToggleCreateScheduledForm(type: `open` | `close`) {
    type === `open`
      ? this.initCreateScheduledForm()
      : (this.createScheduledFormToggle = false);
  }
  //EDIT SHIFT FORM----------------------------------------------------------

  initUpdateShiftForm() {
    //1. INITIALIZE SHIFT FORM
    this.updateShiftForm = new FormGroup({
      positionControl: new FormControl(null),
      slotControl: new FormControl(null),
      locationControl: new FormControl(null),
      dayControl: new FormControl(null),
      shiftStartControl: new FormControl(null),
      shiftEndControl: new FormControl(null),
    });

    //2. EXPOSE SHIFT DATA FOR DISPLAY AND PLUG IN
    //   EXISTING VALUES FOR FORM
    this.updateShiftForm.controls["positionControl"].setValue(
      this.editShift[0].position
    );
    this.updateShiftForm.controls["slotControl"].setValue(
      this.editShift[0].slot
    );
    this.updateShiftForm.controls["locationControl"].setValue(
      this.editShift[0].location
    );
    this.updateShiftForm.controls["dayControl"].setValue(this.editShift[0].day);
    this.updateShiftForm.controls["shiftStartControl"].setValue(
      this.editShift[0].shiftStart[0]
    );
    this.updateShiftForm.controls["shiftEndControl"].setValue(
      this.editShift[0].shiftEnd[0]
    );

    //3. DISPLAY FORM
    this.updateShiftFormToggle = true;
  }

  onUpdateShift() {
    if (this.updateShiftForm.invalid) return;

    const shiftData: Shift = {
      position: this.updateShiftForm.value.positionControl,
      slot: this.updateShiftForm.value.slotControl,
      location: this.updateShiftForm.value.locationControl,
      day: this.updateShiftForm.value.dayControl,
      shiftStart: [this.updateShiftForm.value.shiftStartControl, 0],
      shiftEnd: [this.updateShiftForm.value.shiftEndControl, 0],
    };

    this.shiftService
      .updateShift(this.editShiftId, shiftData)
      .subscribe(() => location.reload());
  }

  //CREATE SCHEDULED FORM----------------------------------------------------------

  getEmployees() {
    this.employeeSub = this.employeeService
      .getAllEmployees()
      .subscribe((employees: Employee[]) => (this.employees = employees));
  }

  initCreateScheduledForm() {
    this.getEmployees();

    //1. INITIALIZE SCHEDULED FORM
    this.createScheduledForm = new FormGroup({
      employeeControl: new FormControl(null),
    });

    //2. EXPOSE SCHEDULED DATA IF ANY FOR DISPLAY AND PLUG IN
    //   EXISTING VALUES FOR FORM
    if (this.editShift[1] !== null)
      this.createScheduledForm.controls["employeeControl"].setValue(
        this.editShift[1].employee.id
      );

    //3. DISPLAY FORM
    this.createScheduledFormToggle = true;
  }

  onCreateScheduled() {
    if (this.createScheduledForm.invalid) return;

    const scheduledData: ScheduledData = {
      shift: this.editShiftId,
      employee: this.createScheduledForm.value.employeeControl,
      date: this.editShiftDay.toISOString(),
    };

    this.scheduledService
      .createScheduled(scheduledData)
      .subscribe(() => location.reload());
  }

  ngOnDestroy() {
    if (this.editShiftSub) this.editShiftSub.unsubscribe();
    if (this.employeeSub) this.employeeSub.unsubscribe();
  }
}
