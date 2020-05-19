import { Shift } from "./shift.model";
import { Employee } from "../users/employee.model";

export interface Preferred {
  id?: string;
  shift: Shift;
  employee: Employee;
  rank: number;
  createdAt: Date;
}

export interface PreferredData {
  id?: string;
  shift: string;
  employee?: string;
  rank: number;
  createdAt?: Date;
}
