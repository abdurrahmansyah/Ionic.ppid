import { TestBed } from '@angular/core/testing';

import { ApprovalDataResolveService } from './approval-data-resolve.service';

describe('ApprovalDataResolveService', () => {
  let service: ApprovalDataResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovalDataResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
