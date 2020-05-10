import { Shift } from "./shift.model";
import { Employee } from "../users/employee.model";

export interface Preferred {
  shift: Shift;
  employee: Employee;
  rank: number;
  createdAt: Date;
}
