import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiMandateSendToRcpComponent } from './si-mandate-send-to-rcp.component';

describe('SiMandateSendToRcpComponent', () => {
  let component: SiMandateSendToRcpComponent;
  let fixture: ComponentFixture<SiMandateSendToRcpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiMandateSendToRcpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiMandateSendToRcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
