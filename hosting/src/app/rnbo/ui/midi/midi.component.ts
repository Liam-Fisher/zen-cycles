import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import {  FormBuilder, FormGroup } from '@angular/forms';
import * as RNBO from '@rnbo/js';
import { RnboEventHubService } from 'src/app/services/rnbo/rnbo-event-hub.service';
@Component({
  selector: 'app-midi',
  //templateUrl: './midi.component.html',
  template: `

<div>
<form [formGroup]="midiOstinatoInfo">
<mat-form-field> 
  <mat-label>quanta (ms)</mat-label>
    <input matInput formControlName="ticks">
  </mat-form-field>
<mat-form-field class="message-input">
    <mat-label>max notes</mat-label>
    <input matInput formControlName="noteCount">
  </mat-form-field>
<mat-form-field class="message-input">
    <mat-label>pitches</mat-label>
    <input matInput formControlName="pitches">
  </mat-form-field>
<mat-form-field class="message-input">
    <mat-label>velocities</mat-label>
    <input matInput formControlName="velocities">
  </mat-form-field>
<mat-form-field class="message-input">
    <mat-label>interonsets</mat-label>
    <input matInput formControlName="interonsetIntervals">
  </mat-form-field>
<mat-form-field class="message-input">
    <mat-label>durations</mat-label>
    <input matInput formControlName="durationRatios">
  </mat-form-field>
  <button mat-button (click)="scheduleOstinato()">Send</button>
</form>
</div>
  `,
  styleUrls: ['./midi.component.scss']
})
export class MidiComponent {

  @Input() device_id: string
  midiOstinatoInfo: FormGroup;  
  @Output() send: EventEmitter<number[]> = new EventEmitter();

  constructor(private fb: FormBuilder, private rnboEvents: RnboEventHubService) { }
  ngOnInit() {
    this.midiOstinatoInfo = this.fb.group({
      ticks: '',
      noteCount: '',
      pitches: '',
      velocities: '',
      interonsetIntervals: '',
      durationRatios: ''
    });
  }
  get noteCount() {
    return +this.midiOstinatoInfo.get('noteCount').value;
  }
  get channelCount() {
    return +this.midiOstinatoInfo.get('channelCount').value;
  }
  get ticks() {
    return +this.midiOstinatoInfo.get('ticks').value;
  }
  get pitches() {
    let pitchStr = this.midiOstinatoInfo.get('pitches').value;
    // could add octave/note name parsing here.
    return this.numArrayFromStr(pitchStr);
  }
  get velocities() {
    let velocityStr = this.midiOstinatoInfo.get('velocities').value;
    // could add dynamics/accent parsing here
    return this.numArrayFromStr(velocityStr);
  }
  get interonsets() {
    let interonsetIntervalsStr = this.midiOstinatoInfo.get('interonsetIntervals').value;
    return this.numArrayFromStr(interonsetIntervalsStr).map(x => x * this.ticks);
  }
  get durations() {
    let durationRatiosStr = this.midiOstinatoInfo.get('durationRatios').value;
    return this.numArrayFromStr(durationRatiosStr);
  }
  numArrayFromStr(ctlStr: string) {
    return ctlStr.split(' ').map( n => isNaN(+n) ? null : +n).filter(x => x !== null);
  }
  scheduleOstinato() {
    return this.rnboEvents.scheduleOstinato(
      this.noteCount, 
      this.pitches, 
      this.velocities,  
      this.interonsets,
      this.durations
      );
  }

}
