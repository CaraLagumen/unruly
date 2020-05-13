import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekItemComponent } from './week-item.component';

describe('WeekItemComponent', () => {
  let component: WeekItemComponent;
  let fixture: ComponentFixture<WeekItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
