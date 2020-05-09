import { Shift } from "./shift.model";
import { Employee } from "../users/employee.model";
import { Scheduler } from "../users/scheduler.model";

export interface Scheduled {
  shift: Shift;
  employee: Employee;
  scheduler: Scheduler;
  date: Date;
  createdAt: Date;
}
