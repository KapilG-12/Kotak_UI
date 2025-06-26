import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalMakerComponent } from './proposal-maker.component';

describe('ProposalMakerComponent', () => {
  let component: ProposalMakerComponent;
  let fixture: ComponentFixture<ProposalMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalMakerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
