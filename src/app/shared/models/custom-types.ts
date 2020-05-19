import { Shift } from "./shift/shift.model";
import { Scheduled } from "./shift/scheduled.model";
import { Preferred } from './shift/preferred.model';
import { Vacation } from './shift/vacation.model';

export type UserType = `employee` | `scheduler`;
export type ShiftEvent = `shiftStart` | `shiftEnd`;
export type CalendarItem = [Shift, Scheduled | null];
export type CalendarItemEmit = [Shift, Scheduled | null, moment.Moment];
export type EmployeeOptions = [Preferred | null, Vacation | null];