import { TestBed } from '@angular/core/testing';

import { BodyMeasurementsService } from './body-measurements.service';

describe('BodyMeasurementsService', () => {
  let service: BodyMeasurementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodyMeasurementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
