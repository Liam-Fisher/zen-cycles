import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import {  FormBuilder, FormGroup } from '@angular/forms';
import { RnboEventHubService } from 'src/app/services/rnbo/rnbo-event-hub.service';
import { MidiScheduleItem } from '../midi-schedule/midi-schedule-datasource';
@Component({
  selector: 'app-event-generator',
  template: `

<div>
<form [formGroup]="ostinatoInfo">
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
  styleUrls: ['./event-generator.component.scss']
})
export class EventGeneratorComponent {

  @Input() device_id: string
  ostinatoInfo: FormGroup;  
  ostinatoEvents: [number,number,number,number][]
  @Output() items: EventEmitter<MidiScheduleItem[]> = new EventEmitter();

  constructor(private fb: FormBuilder, private rnboEvents: RnboEventHubService) { }
  ngOnInit() {
    this.ostinatoInfo = this.fb.group({
      ticks: '',
      noteCount: '',
      pitches: '',
      velocities: '',
      interonsetIntervals: '',
      durationRatios: ''
    });
  }
  get noteCount() {
    return +this.ostinatoInfo.get('noteCount').value;
  }
  get channelCount() {
    return +this.ostinatoInfo.get('channelCount').value;
  }
  get ticks() {
    return +this.ostinatoInfo.get('ticks').value;
  }
  get pitches() {
    let pitchStr = this.ostinatoInfo.get('pitches').value;
    // could add octave/note name parsing here.
    return this.numArrayFromStr(pitchStr);
  }
  get velocities() {
    let velocityStr = this.ostinatoInfo.get('velocities').value;
    // could add dynamics/accent parsing here
    return this.numArrayFromStr(velocityStr);
  }
  get interonsets() {
    let interonsetIntervalsStr = this.ostinatoInfo.get('interonsetIntervals').value;
    return this.numArrayFromStr(interonsetIntervalsStr).map(x => x * this.ticks);
  }
  get durations() {
    let durationRatiosStr = this.ostinatoInfo.get('durationRatios').value;
    return this.numArrayFromStr(durationRatiosStr);
  }
  numArrayFromStr(ctlStr: string) {
    return ctlStr.split(' ').map( n => isNaN(+n) ? null : +n).filter(x => x !== null);
  }
  playOstinato() {
    console.log(`playing ostinato`);
    this.rnboEvents.playOstinato(this.device_id, 1000, this.ostinatoEvents);
  }
  scheduleOstinato() {
    this.items.emit(
      this.rnboEvents.scheduleOstinato(
        this.noteCount, 
        this.pitches, 
        this.velocities,  
        this.interonsets,
        this.durations
        )
    );
  }

}
