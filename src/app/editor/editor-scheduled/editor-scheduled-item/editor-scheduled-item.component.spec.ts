import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorScheduledItemComponent } from './editor-scheduled-item.component';

describe('EditorScheduledItemComponent', () => {
  let component: EditorScheduledItemComponent;
  let fixture: ComponentFixture<EditorScheduledItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorScheduledItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorScheduledItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
