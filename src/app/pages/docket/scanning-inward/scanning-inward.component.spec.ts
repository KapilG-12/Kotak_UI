import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanningInwardComponent } from './scanning-inward.component';

describe('ScanningInwardComponent', () => {
  let component: ScanningInwardComponent;
  let fixture: ComponentFixture<ScanningInwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanningInwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanningInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
