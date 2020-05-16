import { Shift } from "./shift.model";

export interface WeeklyShift {
  id?: string;
  name: string;
  position: "general manager" | "assistant manager" | "lead" | "barista";
  slot: "morning" | "day" | "swing" | "graveyard";
  location:
    | "rotunda"
    | "food court"
    | "tower 1"
    | "tower 2"
    | "pool"
    | "breaker";
  shiftDay1: Shift;
  shiftDay2: Shift;
  shiftDay3: Shift;
  shiftDay4: Shift;
  shiftDay5: Shift;
}
