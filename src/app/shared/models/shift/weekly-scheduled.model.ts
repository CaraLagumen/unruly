import { Employee } from "../users/employee.model";
import { Scheduler } from "../users/scheduler.model";
import { WeeklyShift } from "./weekly-shift.model";

export interface WeeklyScheduled {
  employee: Employee;
  scheduler: Scheduler;
  weeklyShift: WeeklyShift;
  startDate: Date;
}

export interface WeeklyScheduledData {
  employee: string;
  scheduler?: string;
  weeklyShift: string;
  startDate: any;
}
