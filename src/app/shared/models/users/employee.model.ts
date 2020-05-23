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
  position: `general manager` | `assistant manager` | `lead` | `barista`;
  status: `full-time` | `part-time` | `on-call`;
  seniority: number;
  hireDate: Date;
  preferredShiftSlots: `morning` | `day` | `swing` | `graveyard`;
  preferredDaysOff: [number, number];
}
