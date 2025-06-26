import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedByNachTeamComponent } from './received-by-nach-team.component';

describe('ReceivedByNachTeamComponent', () => {
  let component: ReceivedByNachTeamComponent;
  let fixture: ComponentFixture<ReceivedByNachTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivedByNachTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedByNachTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
