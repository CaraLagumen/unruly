import { Document } from "mongoose";

import IEmployee from "../users/employeeInterface";
import IScheduler from "../users/schedulerInterface";
import IWeeklyShift from "./weeklyShiftInterface";

interface IWeeklyScheduled extends Document {
  employee: IEmployee;
  scheduler: IScheduler;
  weeklyShift: IWeeklyShift;
  startDate: Date;
}

export default IWeeklyScheduled;
