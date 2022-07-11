import { TestBed } from '@angular/core/testing';

import { StandardImplementsGuard } from './standard--implements.guard';

describe('StandardImplementsGuard', () => {
  let guard: StandardImplementsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StandardImplementsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
