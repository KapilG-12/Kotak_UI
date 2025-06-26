import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CVTeamComponent } from './cvteam.component';

describe('CVTeamComponent', () => {
  let component: CVTeamComponent;
  let fixture: ComponentFixture<CVTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CVTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CVTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
