import { TestBed } from '@angular/core/testing';

import { WorkdaysService } from './workdays.service';

describe('WorkdaysService', () => {
  let service: WorkdaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkdaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
