//READ ONLY - ALTERABLE DATA IN USERS FOLDER
export interface Scheduler {
  id?: string;
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
