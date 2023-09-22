import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanningDisplayComponent } from './panning-display.component';

describe('PanningDisplayComponent', () => {
  let component: PanningDisplayComponent;
  let fixture: ComponentFixture<PanningDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanningDisplayComponent]
    });
    fixture = TestBed.createComponent(PanningDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
