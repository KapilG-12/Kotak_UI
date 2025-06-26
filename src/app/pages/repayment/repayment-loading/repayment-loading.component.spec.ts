import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentLoadingComponent } from './repayment-loading.component';

describe('RepaymentLoadingComponent', () => {
  let component: RepaymentLoadingComponent;
  let fixture: ComponentFixture<RepaymentLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepaymentLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
