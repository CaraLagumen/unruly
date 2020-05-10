import { TestBed } from '@angular/core/testing';

import { WeeklyScheduledService } from './weekly-scheduled.service';

describe('WeeklyScheduledService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeeklyScheduledService = TestBed.get(WeeklyScheduledService);
    expect(service).toBeTruthy();
  });
});
