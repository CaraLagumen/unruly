import { Document } from "mongoose";

import IShift from "./shiftInterface";
import IEmployee from "../users/employeeInterface";
import IScheduler from "../users/schedulerInterface";

export interface IScheduled extends Document {
  id?: string;
  shift: IShift;
  employee: IEmployee | string; //STRING FOR GRABBING EMPLOYEE SCHEDULE
  scheduler: IScheduler;
  date: Date;
  createdAt?: Date;
}

export interface IScheduledData {
  id?: string;
  shift: string;
  employee: string;
  scheduler: string;
  date: Date;
  createdAt?: Date;
}
