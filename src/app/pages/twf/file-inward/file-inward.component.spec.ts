import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInwardComponent } from './file-inward.component';

describe('FileInwardComponent', () => {
  let component: FileInwardComponent;
  let fixture: ComponentFixture<FileInwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
