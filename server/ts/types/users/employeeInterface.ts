import { Document } from "mongoose";

interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm?: string | undefined;
  passwordChangedAt?: any;
  passwordResetToken?: any;
  passwordResetExpires?: any;
  active: boolean;
  position: string;
  status: string;
  seniority: number;
  hireDate: Date;
  preferredShiftSlots: string[];
}

export default IEmployee;
