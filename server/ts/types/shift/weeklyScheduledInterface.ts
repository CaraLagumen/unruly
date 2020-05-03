import { Document } from "mongoose";

interface IWeeklyScheduled extends Document {
  employee: string;
  scheduler: string;
  weeklyShifts: [string];
  startDate: Date;
}

export default IWeeklyScheduled;
