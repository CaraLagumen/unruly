import { TestBed } from '@angular/core/testing';

import { PreferredService } from './preferred.service';

describe('PreferredService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreferredService = TestBed.get(PreferredService);
    expect(service).toBeTruthy();
  });
});
