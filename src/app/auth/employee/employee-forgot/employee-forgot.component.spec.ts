import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeForgotComponent } from './employee-forgot.component';

describe('EmployeeForgotComponent', () => {
  let component: EmployeeForgotComponent;
  let fixture: ComponentFixture<EmployeeForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeForgotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
