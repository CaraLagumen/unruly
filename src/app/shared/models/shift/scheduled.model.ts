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

export interface ScheduledData {
  id?: string;
  shift: string;
  employee: string;
  scheduler?: string;
  date: any; //FLEXIBLITY FOR SUBMITTING FORMS
  createdAt?: Date;
}
