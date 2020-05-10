//ALTERABLE DATA ONLY - ALL READABLE IN shared/models/users

export interface EmployeeData {
  email?: string;
  preferredShiftSlots?: string[];
  preferredDaysOff?: number[];
}

export interface SchedulerData {
  email?: string;
}
