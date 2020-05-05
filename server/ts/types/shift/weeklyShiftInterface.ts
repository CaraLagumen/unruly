import { Document } from "mongoose";

import IShift from "./shiftInterface";

interface IWeeklyShift extends Document {
  name: string;
  position: string;
  slot: [string];
  location: [string];
  shiftDay1: IShift;
  shiftDay2: IShift;
  shiftDay3: IShift;
  shiftDay4: IShift;
  shiftDay5: IShift;
}

export default IWeeklyShift;
