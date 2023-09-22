import { Component, Input } from '@angular/core';
import { FirebaseLoaderService } from 'src/app/services/firebase/firebase-loader.service';
import { AudioService } from 'src/app/services/webAPI/audio.service';
import { Observable, Subject, combineLatest, BehaviorSubject, interval, from} from 'rxjs';
import {  map, tap , takeUntil, debounce, debounceTime, distinctUntilChanged } from 'rxjs/operators';
interface NumberPosition {
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  orientationX?: number;
  orientationY?: number;
  orientationZ?: number;
}

@Component({
  selector: 'app-panning-display',
  template: `
    <div class="example-label-container">
      <button *ngIf="!isLoaded" (click)="loadAudioContext()">load</button>
      <button *ngIf="isLoaded" (click)="doTest()">test</button>
      <button *ngIf="isLoaded" (click)="loadAudioFile()">getAudio</button>
<div #playOptions
        *ngIf="!isPlaying && (hasAudio | async)" >
        
      <button
        (click)="playPath()"
      >
      play
      </button>
<input type="number" (input)="setDuration"/>
</div>
<div>
<input type="number" (input)="individualRamp($event, 'positionX')" />
      <mat-slider #radiusSlider min="0.5" max="20" step="0.5">
        <input matSliderThumb (dragEnd)="activeRadiusSlider.next($event.value)">
      </mat-slider>
</div> 
<div>
  
<input type="number" (input)="individualRamp($event, 'positionX')" />
      <mat-slider #azimuthSlider min="0" max="1" step="0.01">
        <input matSliderThumb (dragEnd)="activeAzimuthSlider.next($event.value)">
      </mat-slider>
</div>
<div>
  
<input type="number" (input)="individualRamp($event, 'positionX')" />
      <mat-slider #inclineSlider min="0" max="1" step="0.01">
        <input matSliderThumb (dragEnd)="activeInclineSlider.next($event.value)">
      </mat-slider>
    </div>
</div>
  `,
  styleUrls: ['./panning-display.component.scss'],
})
export class PanningDisplayComponent {
  private ctx: AudioContext;
  private audio: AudioBuffer;
  private destroy$ = new Subject<void>();
  private sliderValueSubject = new BehaviorSubject<number>(0);
  url: string;
  pan: PannerNode;
  vol: GainNode;
  isLoaded: boolean;
  isPlaying: boolean;
  playCount: number = 10;
  ramptime = 1;
  //hasPath: Observable<boolean>;
  hasAudio: Observable<boolean>;

  activeRadiusSlider: BehaviorSubject<number> = new BehaviorSubject(1);
  activeAzimuthSlider: BehaviorSubject<number> = new BehaviorSubject(1);
  activeInclineSlider: BehaviorSubject<number> = new BehaviorSubject(1);
  activeCoords: Observable<[number,number,number]>;

  constructor(
    private fbLoader: FirebaseLoaderService,
    private webAudio: AudioService
  ) {
    this.activeCoords = combineLatest([
      this.activeRadiusSlider,
      this.activeAzimuthSlider,
      this.activeInclineSlider
    ]).pipe(
      debounceTime(this.ramptime), // Debounce the value changes by 100 ms
      takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
    );
  }
  setDuration(val: number) {
    this.ramptime = val/1000;
    console.log(`set duration to $${this.ramptime}`);
  }
  ngOnInit() {
    this.isLoaded = false;
    this.isPlaying = false;
    this.activeCoords.subscribe((vals) => this.changePosition(...vals))
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  stop() {
    this.ctx.close();
    this.isLoaded = false;
    this.isPlaying = false;
  }
  loadAudioContext() {
    this.webAudio.setupContext();
    this.ctx = this.webAudio._ctx;
    this.vol = this.ctx.createGain();
    this.vol.gain.setValueAtTime(0.5, 0);
    this.pan = this.ctx.createPanner();
    this.pan.panningModel = 'HRTF';
    this.pan.connect(this.ctx.destination);
    this.isLoaded = true;
  }
  doTest() {
    this.webAudio.testSound();
  }
  loadAudioFile() {
    this.hasAudio = from(this.fbLoader.loadAudio(this.ctx, 'counts/fr-FR_1_32_500')).pipe(
      tap(buf => this.audio = buf),
      map(buf => !!buf)
    );
  }
  individualRamp(ev: any, tgt: keyof NumberPosition) {
    
    let val = +ev.data;
    this.rampTo(val, this.ramptime, tgt);


  }
  playPath() {
    const playBuf = this.ctx.createBufferSource();
    playBuf.buffer = this.audio;
    playBuf.loop = true;
    this.isPlaying = true;
    playBuf.addEventListener('ended', (ev: Event) => (this.isPlaying = false));
    playBuf.connect(this.pan);
    playBuf.start();
    playBuf.stop(this.ctx.currentTime + this.audio.duration * this.playCount);
  }
  changePosition(radius: number, azimuth: number, incline: number) {
    if(this.isLoaded) {
    console.log(`changing position...`);
    const x = radius * Math.sin(incline*Math.PI) * Math.cos(azimuth*Math.PI*2);
    const y = radius * Math.sin(incline*Math.PI) * Math.sin(azimuth*Math.PI*2);
    const z = radius * Math.cos(incline*Math.PI);
    console.log(`polar: 
    radius: ${radius}
    azimuth: ${azimuth}
    incline: ${incline}`);
    console.log(`cartesian: 
    x: ${x}
    y: ${y}
    z: ${z}`
    );
    this.rampTo(x, this.ramptime, 'positionX');
    this.rampTo(y, this.ramptime, 'positionY');
    this.rampTo(z, this.ramptime, 'positionZ');
    }
  }
  rampTo(tgt: number, duration: number, param: keyof NumberPosition) {
    let val = this.pan[param].value;
    let time = this.ctx.currentTime;
    // NECESSARY TO SETUP PROPER EVENT SCHEDULING ???
    this.pan[param]
    .cancelScheduledValues(time)
   // .setValueAtTime(val, time)
    .linearRampToValueAtTime(tgt, time + duration);
    //console.log(`starting ramp for ${param} at time: ${time}`);
    //console.log(`ramping from ${val} to ${tgt} in ${duration}`);
    setTimeout(( () => {
      console.log(`ramped  ${param} from ${val} to ${tgt} in ${duration}`);
    } ), duration*1000+1);

  }
}
