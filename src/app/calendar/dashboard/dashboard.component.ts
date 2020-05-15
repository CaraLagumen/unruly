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

import { Shift } from "../../shared/models/shift/shift.model";
import { Scheduled } from "../../shared/models/shift/scheduled.model";
import { ShiftService } from "src/app/shared/services/shift/shift.service";

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

  @Output() schedulerEmitter = new EventEmitter<[string, any | null]>();

  editShift: [Shift, Scheduled | null];
  editShiftId: string;
  updateShiftForm: FormGroup;

  editShiftMenu = false;
  editShiftForm = false;
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
    this.editShiftSub = this.editShiftObs.subscribe(
      (emittedData: [Shift, Scheduled | null]) => {
        this.editShift = emittedData;
        this.toggleEditShiftMenu(`open`);
      }
    );
  }

  schedulerEmitterButton(type: string) {
    const data = this.editShift;

    this.schedulerEmitter.emit([type, data]);

    if (this.editShiftMenu) {
      this.toggleEditShiftMenu(`close`);
    }
  }

  toggleEditShiftMenu(type: `open` | `close`) {
    type === `open`
      ? (this.editShiftMenu = true)
      : (this.editShiftMenu = false);
  }

  toggleEditShiftForm(type: `open` | `close`) {
    if (type === `open`) {
      this.initEditShiftForm();
    }

    this.editShiftForm = false;
  }

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
    this.editShiftId = this.editShift[0].id;
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

    this.shiftService.updateShift(this.editShiftId, shiftData);
    
    this.updateShiftForm.reset();
  }

  ngOnDestroy() {
    this.editShiftSub.unsubscribe();
    if (this.shiftSub) this.shiftSub.unsubscribe();
  }
}
