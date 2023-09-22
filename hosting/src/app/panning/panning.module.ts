import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanningObjComponent } from './panning-obj/panning-obj.component';
import { PanningDisplayComponent } from './panning-display/panning-display.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    PanningObjComponent,
    PanningDisplayComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    MatButtonModule
  ],
  exports: [
    PanningDisplayComponent
  ]
})
export class PanningModule { }
