import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorScheduledComponent } from './editor-scheduled.component';

describe('EditorScheduledComponent', () => {
  let component: EditorScheduledComponent;
  let fixture: ComponentFixture<EditorScheduledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorScheduledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
