import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanningDoneComponent } from './scanning-done.component';

describe('ScanningDoneComponent', () => {
  let component: ScanningDoneComponent;
  let fixture: ComponentFixture<ScanningDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanningDoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanningDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
