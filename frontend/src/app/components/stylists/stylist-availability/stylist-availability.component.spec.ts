import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylistAvailabilityComponent } from './stylist-availability.component';

describe('StylistAvailabilityComponent', () => {
  let component: StylistAvailabilityComponent;
  let fixture: ComponentFixture<StylistAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylistAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StylistAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
