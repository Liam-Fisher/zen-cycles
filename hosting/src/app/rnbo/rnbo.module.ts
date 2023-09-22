// Basic Angular Modules
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Components
import {MatSliderModule} from '@angular/material/slider';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

// Global UI components
import { SourceDeviceSelectionMenuComponent } from './ui/device-menu/device-menu-ui.component'
// Device UI components
import { ParameterUI } from './ui/parameter/parameter-ui.component';
import { InportUI } from './ui/inport/inport-ui.component';
// Helpers
// import { RnboLoaderService } from './services/rnbo-loader.service';
// import { RnboEventHubService } from './services/rnbo-event-hub.service';
// Main Interface
import { RnboDeviceComponent } from './device/rnbo-device.component';
import { DeviceDisplayComponent } from './display/device-display.component';
import { MidiComponent } from './ui/midi/midi.component';
import { EventGeneratorComponent } from './event-generator/event-generator.component';
import { MidiScheduleComponent } from './midi-schedule/midi-schedule.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
  declarations: [
    ParameterUI,
    InportUI,
    RnboDeviceComponent,
    SourceDeviceSelectionMenuComponent,
    DeviceDisplayComponent,
    MidiComponent,
    EventGeneratorComponent,
    MidiScheduleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  exports: [
    DeviceDisplayComponent
  ],
  providers: []
})
export class RnboModule { }


