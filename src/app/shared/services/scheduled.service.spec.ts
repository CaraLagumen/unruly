import { TestBed } from '@angular/core/testing';

import { ScheduledService } from './scheduled.service';

describe('ScheduledService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduledService = TestBed.get(ScheduledService);
    expect(service).toBeTruthy();
  });
});
