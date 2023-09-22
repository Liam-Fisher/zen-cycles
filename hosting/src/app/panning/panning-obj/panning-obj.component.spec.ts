import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanningObjComponent } from './panning-obj.component';

describe('PanningObjComponent', () => {
  let component: PanningObjComponent;
  let fixture: ComponentFixture<PanningObjComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanningObjComponent]
    });
    fixture = TestBed.createComponent(PanningObjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
