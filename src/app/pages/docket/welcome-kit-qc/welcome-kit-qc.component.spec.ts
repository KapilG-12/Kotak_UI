import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeKitQCComponent } from './welcome-kit-qc.component';

describe('WelcomeKitQCComponent', () => {
  let component: WelcomeKitQCComponent;
  let fixture: ComponentFixture<WelcomeKitQCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeKitQCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeKitQCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
