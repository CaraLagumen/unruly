import { Shift } from "./shift.model";

export interface WeeklyShift {
  name: string;
  position: string;
  slot: string[];
  location: string[];
  shiftDay1: Shift;
  shiftDay2: Shift;
  shiftDay3: Shift;
  shiftDay4: Shift;
  shiftDay5: Shift;
}
