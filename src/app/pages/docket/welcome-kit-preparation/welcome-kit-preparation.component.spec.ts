import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeKitPreparationComponent } from './welcome-kit-preparation.component';

describe('WelcomeKitPreparationComponent', () => {
  let component: WelcomeKitPreparationComponent;
  let fixture: ComponentFixture<WelcomeKitPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeKitPreparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeKitPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
