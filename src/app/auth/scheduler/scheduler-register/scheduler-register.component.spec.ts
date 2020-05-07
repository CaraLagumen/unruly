import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerRegisterComponent } from './scheduler-register.component';

describe('SchedulerRegisterComponent', () => {
  let component: SchedulerRegisterComponent;
  let fixture: ComponentFixture<SchedulerRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
