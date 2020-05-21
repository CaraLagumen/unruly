import { Document } from "mongoose";

interface IShift extends Document {
  id?: string;
  position: "general manager" | "assistant manager" | "lead" | "barista";
  slot: "morning" | "day" | "swing" | "graveyard";
  location:
    | "rotunda"
    | "food court"
    | "tower 1"
    | "tower 2"
    | "pool"
    | "breaker";
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  shiftStart: any; //ALLOW ANY FOR URL QUERIES
  shiftEnd: any; //ALLOW ANY FOR URL QUERIES
}

export default IShift;
