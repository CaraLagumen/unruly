import { Shift } from "./shift.model";
import { Employee } from "../users/employee.model";
import { Scheduler } from "../users/scheduler.model";

export interface Scheduled {
  id?: string;
  shift: Shift;
  employee: Employee;
  scheduler: Scheduler;
  date: Date;
  createdAt: Date;
}

//FOR FORMS ONLY
export interface ScheduledData {
  id?: string;
  shiftId: string;
  employeeId: string;
  schedulerId?: string;
  date: any;
  createdAt?: Date;
}
