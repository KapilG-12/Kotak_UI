import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckerRolesComponent } from './checker-roles.component';

describe('CheckerRolesComponent', () => {
  let component: CheckerRolesComponent;
  let fixture: ComponentFixture<CheckerRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckerRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckerRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
