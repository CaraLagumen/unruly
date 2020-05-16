import { Shift } from "./shift/shift.model";
import { Scheduled } from "./shift/scheduled.model";

export type UserType = `employee` | `scheduler`;
export type ShiftEvent = `shiftStart` | `shiftEnd`;
export type EditShift = [Shift, Scheduled | null];
export type EditShiftEmit = [Shift, Scheduled | null, moment.Moment];