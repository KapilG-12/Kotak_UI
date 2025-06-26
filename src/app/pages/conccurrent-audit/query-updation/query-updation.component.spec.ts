import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryUpdationComponent } from './query-updation.component';

describe('QueryUpdationComponent', () => {
  let component: QueryUpdationComponent;
  let fixture: ComponentFixture<QueryUpdationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryUpdationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryUpdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
