import { Document } from "mongoose";

interface IScheduler extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  passwordConfirm?: string | undefined;
  passwordChangedAt?: any;
  passwordResetToken?: any;
  passwordResetExpires?: any;
  active: boolean;
}

export default IScheduler;
