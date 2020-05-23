import { Document } from "mongoose";

interface IEmployee extends Document {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  passwordConfirm?: string | undefined;
  passwordChangedAt?: any;
  passwordResetToken?: any;
  passwordResetExpires?: any;
  active?: boolean;
  position: `general manager` | `assistant manager` | `lead` | `barista`;
  status: `full-time` | `part-time` | `on-call`;
  seniority: number;
  hireDate: Date;
  preferredShiftSlots: `morning` | `day` | `swing` | `graveyard`;
  preferredDaysOff: [number, number];

  correctPassword(password: string, passwordConfirm: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): Promise<boolean>;
  createPasswordResetToken(): string;
}

export default IEmployee;
