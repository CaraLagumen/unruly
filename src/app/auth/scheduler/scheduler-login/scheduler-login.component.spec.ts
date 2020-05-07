import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerLoginComponent } from './scheduler-login.component';

describe('SchedulerLoginComponent', () => {
  let component: SchedulerLoginComponent;
  let fixture: ComponentFixture<SchedulerLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
