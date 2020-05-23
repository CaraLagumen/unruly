import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorVacationsComponent } from './editor-vacations.component';

describe('EditorVacationsComponent', () => {
  let component: EditorVacationsComponent;
  let fixture: ComponentFixture<EditorVacationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorVacationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorVacationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
