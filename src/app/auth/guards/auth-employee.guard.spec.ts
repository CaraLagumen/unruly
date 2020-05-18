import { TestBed, async, inject } from '@angular/core/testing';

import { AuthEmployeeGuard } from './auth-employee.guard';

describe('AuthEmployeeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthEmployeeGuard]
    });
  });

  it('should ...', inject([AuthEmployeeGuard], (guard: AuthEmployeeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
