import { Document } from "mongoose";

interface IWeeklyScheduled extends Document {
  employee: string;
  scheduler: string;
  weeklyShift: string;
  startDate: Date;
}

export default IWeeklyScheduled;
