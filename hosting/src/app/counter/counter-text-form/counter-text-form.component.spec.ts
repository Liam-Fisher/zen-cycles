import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterTextFormComponent } from './counter-text-form.component';

describe('CounterTextFormComponent', () => {
  let component: CounterTextFormComponent;
  let fixture: ComponentFixture<CounterTextFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterTextFormComponent]
    });
    fixture = TestBed.createComponent(CounterTextFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
