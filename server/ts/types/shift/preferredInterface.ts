import { Document } from "mongoose";

import IShift from "./shiftInterface";
import IEmployee from "../users/employeeInterface";

export interface IPreferred extends Document {
  shift: IShift;
  employee: IEmployee;
  rank: number;
  createdAt: Date;
}

export interface IPreferredData {
  shift: string;
  employee: string;
  rank: number;
  createdAt?: Date;
}