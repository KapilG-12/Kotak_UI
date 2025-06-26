import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchInwardComponent } from './dispatch-inward.component';

describe('DispatchInwardComponent', () => {
  let component: DispatchInwardComponent;
  let fixture: ComponentFixture<DispatchInwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchInwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
