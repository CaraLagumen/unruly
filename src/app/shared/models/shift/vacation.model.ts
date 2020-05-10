import { Employee } from "../users/employee.model";
import { Scheduler } from "../users/scheduler.model";

export interface Vacation {
  employee: Employee;
  scheduler?: Scheduler; //ADDED ONCE VAC APPROVED
  date: Date;
  approved: Boolean;
  createdAt: Date;
}