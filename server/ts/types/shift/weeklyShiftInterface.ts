import { Document } from "mongoose";

interface IWeeklyShift extends Document {
  name: string;
  position: string;
  slot: [string];
  location: [string];
  shiftDay1: string;
  shiftDay2: string;
  shiftDay3: string;
  shiftDay4: string;
  shiftDay5: string;
}

export default IWeeklyShift;
