import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierAckComponent } from './courier-ack.component';

describe('CourierAckComponent', () => {
  let component: CourierAckComponent;
  let fixture: ComponentFixture<CourierAckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierAckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierAckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
