import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerForgotComponent } from './scheduler-forgot.component';

describe('SchedulerForgotComponent', () => {
  let component: SchedulerForgotComponent;
  let fixture: ComponentFixture<SchedulerForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerForgotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
