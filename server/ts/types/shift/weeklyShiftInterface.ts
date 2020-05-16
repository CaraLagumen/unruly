import { Document } from "mongoose";

import IShift from "./shiftInterface";

interface IWeeklyShift extends Document {
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
  shiftDay1: IShift;
  shiftDay2: IShift;
  shiftDay3: IShift;
  shiftDay4: IShift;
  shiftDay5: IShift;
}

export default IWeeklyShift;
