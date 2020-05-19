import { Shift } from "./shift/shift.model";
import { Scheduled } from "./shift/scheduled.model";

export type UserType = `employee` | `scheduler`;
export type ShiftEvent = `shiftStart` | `shiftEnd`;
export type CalendarItem = [Shift, Scheduled | null];
export type CalendarItemEmit = [Shift, Scheduled | null, moment.Moment];