import { TestBed } from '@angular/core/testing';

import { WeeklyShiftService } from './weekly-shift.service';

describe('WeeklyShiftService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeeklyShiftService = TestBed.get(WeeklyShiftService);
    expect(service).toBeTruthy();
  });
});
