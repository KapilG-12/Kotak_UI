import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandedOverToNachTeamComponent } from './handed-over-to-nach-team.component';

describe('HandedOverToNachTeamComponent', () => {
  let component: HandedOverToNachTeamComponent;
  let fixture: ComponentFixture<HandedOverToNachTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandedOverToNachTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandedOverToNachTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
