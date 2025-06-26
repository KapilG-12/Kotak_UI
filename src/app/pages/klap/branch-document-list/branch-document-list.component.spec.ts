import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchDocumentListComponent } from './branch-document-list.component';

describe('BranchDocumentListComponent', () => {
  let component: BranchDocumentListComponent;
  let fixture: ComponentFixture<BranchDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchDocumentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
