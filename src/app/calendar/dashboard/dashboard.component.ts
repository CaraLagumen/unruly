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

import { ShiftService } from "../../shared/services/shift/shift.service";
import { Shift } from "../../shared/models/shift/shift.model";
import { EditShift, EditShiftEmit } from "../../shared/models/custom-types";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private editShiftSub: Subscription;
  private shiftSub: Subscription;

  @Input() employeeIsAuth;
  @Input() schedulerIsAuth;
  @Input() editShiftObs: Observable<any>;

  @Output() schedulerEmitter = new EventEmitter<[string, EditShift]>();

  editShift: EditShift;
  editShiftId: string;
  editShiftDay: moment.Moment;
  updateShiftForm: FormGroup;

  editShiftMenu = false;
  editShiftForm = false;

  //EDIT SHIFT FORM
  positions = ["general manager", "assistant manager", "lead", "barista"];
  slots = ["morning", "day", "swing", "graveyard"];
  locations = [
    "rotunda",
    "food court",
    "tower 1",
    "tower 2",
    "pool",
    "breaker",
  ];
  days = [0, 1, 2, 3, 4, 5, 6];
  shiftHours = Array.apply(null, { length: 24 }).map(Number.call, Number);

  constructor(private shiftService: ShiftService) {}

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

  onSchedulerEmitter(type: string) {
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

  onToggleEditShiftForm(type: `open` | `close`) {
    if (type === `open`) {
      this.initEditShiftForm();
    }

    this.editShiftForm = false;
  }

  //EDIT SHIFT FORM----------------------------------------------------------

  initEditShiftForm() {
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
    this.shiftSub = this.shiftService
      .getShift(this.editShiftId)
      .subscribe((shiftData: Shift) => {
        this.updateShiftForm.controls["positionControl"].setValue(
          shiftData.position
        );
        this.updateShiftForm.controls["slotControl"].setValue(shiftData.slot);
        this.updateShiftForm.controls["locationControl"].setValue(
          shiftData.location
        );
        this.updateShiftForm.controls["dayControl"].setValue(shiftData.day);
        this.updateShiftForm.controls["shiftStartControl"].setValue(
          shiftData.shiftStart[0]
        );
        this.updateShiftForm.controls["shiftEndControl"].setValue(
          shiftData.shiftEnd[0]
        );

        this.editShiftForm = true;
      });
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

  ngOnDestroy() {
    if (this.editShiftSub) this.editShiftSub.unsubscribe();
    if (this.shiftSub) this.shiftSub.unsubscribe();
  }
}
