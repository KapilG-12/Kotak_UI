import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlapInsertionPendingComponent } from './klap-insertion-pending.component';

describe('KlapInsertionPendingComponent', () => {
  let component: KlapInsertionPendingComponent;
  let fixture: ComponentFixture<KlapInsertionPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlapInsertionPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KlapInsertionPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
