import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogRepotsComponent } from './log-repots.component';

describe('LogRepotsComponent', () => {
  let component: LogRepotsComponent;
  let fixture: ComponentFixture<LogRepotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogRepotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogRepotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
