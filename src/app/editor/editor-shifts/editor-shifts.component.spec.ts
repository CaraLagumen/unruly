import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorShiftsComponent } from './editor-shifts.component';

describe('EditorShiftsComponent', () => {
  let component: EditorShiftsComponent;
  let fixture: ComponentFixture<EditorShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
