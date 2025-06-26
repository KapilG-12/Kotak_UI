import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileAcknowledgeComponent } from './file-acknowledge.component';

describe('FileAcknowledgeComponent', () => {
  let component: FileAcknowledgeComponent;
  let fixture: ComponentFixture<FileAcknowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileAcknowledgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileAcknowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
