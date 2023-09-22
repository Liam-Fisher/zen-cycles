import { Component,ViewChild } from '@angular/core';
import {  RnboLoaderService } from '../../services/rnbo/rnbo-loader.service';
import {  BehaviorSubject, Observable, of, from} from 'rxjs';
import { AudioService } from '../../services/webAPI/audio.service';
import { MidiScheduleComponent } from '../midi-schedule/midi-schedule.component';

@Component({
  selector: 'app-device-display',
  templateUrl: './device-display.component.html',
  styleUrls: ['./device-display.component.scss']
})
export class DeviceDisplayComponent {
  @ViewChild(MidiScheduleComponent) schedule!: MidiScheduleComponent;
  isRestarting: BehaviorSubject<boolean> = new BehaviorSubject(false);
  deviceList: Observable<string[]>;
  scoreList:  Observable<string[]>;
  //deviceList = ['ostinato'];
  active_id: Observable<string>;
  audioLoaded: boolean;
  constructor(public rnboLoader: RnboLoaderService, private webAudio: AudioService) { }
  ngAfterViewInit() {
    console.log(`loading device list`);
    this.deviceList = from(this.rnboLoader.loadDeviceList());
    console.log(`device list loaded`);
  }
  loadDevice(device_id: string) {
    this.active_id = of(device_id);
    console.log(`selected device ${device_id}`);
  } 
  testAudio() {
    this.webAudio.testSound();
  }
  loadAudio() {
    this.audioLoaded = this.webAudio.setupContext();
  }
}

