import { Employee } from "../users/employee.model";
import { Scheduler } from "../users/scheduler.model";

export interface Vacation {
  id?: string;
  employee?: Employee;
  scheduler?: Scheduler; //ADDED ONCE VAC APPROVED
  date: Date;
  approved?: boolean;
  createdAt?: Date;
}

export interface VacationData {
  id?: string;
  employee?: string;
  scheduler?: string; //ADDED ONCE VAC APPROVED
  date?: Date;
  approved?: boolean;
  createdAt?: Date;
}
