import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OstinatoDisplayComponent } from './ostinato-display.component';

describe('OstinatoDisplayComponent', () => {
  let component: OstinatoDisplayComponent;
  let fixture: ComponentFixture<OstinatoDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OstinatoDisplayComponent]
    });
    fixture = TestBed.createComponent(OstinatoDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
