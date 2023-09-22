import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventGeneratorComponent } from './event-generator.component';

describe('EventGeneratorComponent', () => {
  let component: EventGeneratorComponent;
  let fixture: ComponentFixture<EventGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventGeneratorComponent]
    });
    fixture = TestBed.createComponent(EventGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
