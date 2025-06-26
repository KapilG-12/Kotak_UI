import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentQcComponent } from './repayment-qc.component';

describe('RepaymentQcComponent', () => {
  let component: RepaymentQcComponent;
  let fixture: ComponentFixture<RepaymentQcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepaymentQcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
