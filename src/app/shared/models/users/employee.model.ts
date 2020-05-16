//READ ONLY - ALTERABLE DATA IN USERS FOLDER
export interface Employee {
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
  position: string;
  status: string;
  seniority: number;
  hireDate: Date;
  preferredShiftSlots: string[];
  preferredDaysOff: number[];
}
