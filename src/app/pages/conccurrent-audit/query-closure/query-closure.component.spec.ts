import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryClosureComponent } from './query-closure.component';

describe('QueryClosureComponent', () => {
  let component: QueryClosureComponent;
  let fixture: ComponentFixture<QueryClosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryClosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
