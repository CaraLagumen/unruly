import { Document } from "mongoose";

interface IWeeklyShifts extends Document {
  weeklyShifts: [string];
}

export default IWeeklyShifts;
