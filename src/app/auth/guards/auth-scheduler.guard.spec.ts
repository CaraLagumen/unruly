import { TestBed, async, inject } from '@angular/core/testing';

import { AuthSchedulerGuard } from './auth-scheduler.guard';

describe('AuthSchedulerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthSchedulerGuard]
    });
  });

  it('should ...', inject([AuthSchedulerGuard], (guard: AuthSchedulerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
