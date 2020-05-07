import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerResetComponent } from './scheduler-reset.component';

describe('SchedulerResetComponent', () => {
  let component: SchedulerResetComponent;
  let fixture: ComponentFixture<SchedulerResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
