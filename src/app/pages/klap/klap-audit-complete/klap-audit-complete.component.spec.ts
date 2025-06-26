import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlapAuditCompleteComponent } from './klap-audit-complete.component';

describe('KlapAuditCompleteComponent', () => {
  let component: KlapAuditCompleteComponent;
  let fixture: ComponentFixture<KlapAuditCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlapAuditCompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KlapAuditCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
