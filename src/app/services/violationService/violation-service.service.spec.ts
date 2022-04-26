import { TestBed } from '@angular/core/testing';

import { ViolationServiceService } from './violation-service.service';

describe('ViolationServiceService', () => {
  let service: ViolationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViolationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
