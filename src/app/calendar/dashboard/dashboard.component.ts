import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { Observable, Subscription } from "rxjs";

import { Shift } from "../../shared/models/shift/shift.model";
import { Scheduled } from "../../shared/models/shift/scheduled.model";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private editShiftSub: Subscription;

  @Input() employeeIsAuth;
  @Input() schedulerIsAuth;
  @Input() editShiftObs: Observable<any>;

  @Output() schedulerEmitter = new EventEmitter<[string, any | null]>();

  editShift: [Shift, Scheduled | null];

  editShiftMenu = false;

  constructor() {}

  ngOnInit() {
    this.editShiftSub = this.editShiftObs.subscribe(
      (emittedData: [Shift, Scheduled | null]) => {
        this.editShift = emittedData;
        this.toggleEditShift();
      }
    );
  }

  schedulerEmitterButton(type: string) {
    const data = this.editShift;

    this.schedulerEmitter.emit([type, data]);
  }

  toggleEditShift() {
    this.editShiftMenu = !this.editShiftMenu;
  }

  ngOnDestroy() {
    this.editShiftSub.unsubscribe();
  }
}
