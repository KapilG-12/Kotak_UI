import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendToBankerComponent } from './send-to-banker.component';

describe('SendToBankerComponent', () => {
  let component: SendToBankerComponent;
  let fixture: ComponentFixture<SendToBankerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendToBankerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendToBankerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
