import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlapInsertionAuditComponent } from './klap-insertion-audit.component';

describe('KlapInsertionAuditComponent', () => {
  let component: KlapInsertionAuditComponent;
  let fixture: ComponentFixture<KlapInsertionAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlapInsertionAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KlapInsertionAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
