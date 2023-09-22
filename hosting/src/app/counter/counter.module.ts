import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CounterDisplayComponent } from './counter-display/counter-display.component';
import { CounterTextFormComponent } from './counter-text-form/counter-text-form.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
@NgModule({
  declarations: [
    CounterDisplayComponent,
    CounterTextFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSliderModule
  ],
  exports: [
    CounterDisplayComponent,
    CounterTextFormComponent
  ]
})
export class CounterModule { }
