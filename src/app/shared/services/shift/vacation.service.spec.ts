import { TestBed } from '@angular/core/testing';

import { VacationService } from './vacation.service';

describe('VacationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VacationService = TestBed.get(VacationService);
    expect(service).toBeTruthy();
  });
});
