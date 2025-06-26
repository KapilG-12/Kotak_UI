import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcheckerRolesComponent } from './addchecker-roles.component';

describe('AddcheckerRolesComponent', () => {
  let component: AddcheckerRolesComponent;
  let fixture: ComponentFixture<AddcheckerRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcheckerRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcheckerRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
