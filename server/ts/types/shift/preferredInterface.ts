import { Document } from "mongoose";

import IShift from "./shiftInterface";
import IEmployee from "../users/employeeInterface";

interface IPreferred extends Document {
  shift: IShift;
  employee: IEmployee;
  rank: number;
  createdAt: Date;
}

export default IPreferred;
