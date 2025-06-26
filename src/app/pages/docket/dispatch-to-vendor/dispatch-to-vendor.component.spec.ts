import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchToVendorComponent } from './dispatch-to-vendor.component';

describe('DispatchToVendorComponent', () => {
  let component: DispatchToVendorComponent;
  let fixture: ComponentFixture<DispatchToVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchToVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchToVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
