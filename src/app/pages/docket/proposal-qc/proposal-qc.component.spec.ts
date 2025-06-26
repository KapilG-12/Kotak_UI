import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalQCComponent } from './proposal-qc.component';

describe('ProposalQCComponent', () => {
  let component: ProposalQCComponent;
  let fixture: ComponentFixture<ProposalQCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalQCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalQCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
