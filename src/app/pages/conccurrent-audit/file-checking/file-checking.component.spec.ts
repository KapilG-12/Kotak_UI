import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileCheckingComponent } from './file-checking.component';

describe('FileCheckingComponent', () => {
  let component: FileCheckingComponent;
  let fixture: ComponentFixture<FileCheckingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileCheckingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
