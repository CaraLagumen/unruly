import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorShiftsItemComponent } from './editor-shifts-item.component';

describe('EditorShiftsItemComponent', () => {
  let component: EditorShiftsItemComponent;
  let fixture: ComponentFixture<EditorShiftsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorShiftsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorShiftsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
