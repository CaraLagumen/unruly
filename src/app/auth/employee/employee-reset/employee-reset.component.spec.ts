import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeResetComponent } from './employee-reset.component';

describe('EmployeeResetComponent', () => {
  let component: EmployeeResetComponent;
  let fixture: ComponentFixture<EmployeeResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
