export interface AuthData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  passwordConfirm?: string;
}

export interface AuthUpdateData {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResetData {
  password: string;
  passwordConfirm: string;
}
