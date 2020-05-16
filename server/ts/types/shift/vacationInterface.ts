import { Document } from "mongoose";

import IEmployee from "../users/employeeInterface";
import IScheduler from "../users/schedulerInterface";

interface IVacation extends Document {
  employee: IEmployee;
  scheduler?: IScheduler; //ADDED ONCE VAC APPROVED
  date: Date;
  approved: Boolean;
  createdAt: Date;
}

export default IVacation;
