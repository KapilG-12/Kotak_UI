import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlapBranchPendingComponent } from './klap-branch-pending.component';

describe('KlapBranchPendingComponent', () => {
  let component: KlapBranchPendingComponent;
  let fixture: ComponentFixture<KlapBranchPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlapBranchPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KlapBranchPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
