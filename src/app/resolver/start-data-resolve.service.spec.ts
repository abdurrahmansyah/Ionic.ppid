import { TestBed } from '@angular/core/testing';

import { StartDataResolveService } from './start-data-resolve.service';

describe('StartDataResolveService', () => {
  let service: StartDataResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartDataResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
