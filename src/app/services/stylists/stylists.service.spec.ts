import { TestBed } from '@angular/core/testing';

import { StylistsService } from './stylists.service';

describe('StylistsService', () => {
  let service: StylistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StylistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
