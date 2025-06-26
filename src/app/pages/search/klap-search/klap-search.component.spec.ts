import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlapSearchComponent } from './klap-search.component';

describe('KlapSearchComponent', () => {
  let component: KlapSearchComponent;
  let fixture: ComponentFixture<KlapSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlapSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KlapSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
