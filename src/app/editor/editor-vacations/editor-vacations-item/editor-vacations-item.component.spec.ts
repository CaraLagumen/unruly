import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorVacationsItemComponent } from './editor-vacations-item.component';

describe('EditorVacationsItemComponent', () => {
  let component: EditorVacationsItemComponent;
  let fixture: ComponentFixture<EditorVacationsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorVacationsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorVacationsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
