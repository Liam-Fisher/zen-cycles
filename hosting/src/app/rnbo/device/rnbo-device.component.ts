import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as RNBO from '@rnbo/js';
import {  RnboLoaderService } from '../../services/rnbo/rnbo-loader.service';
import { RnboEventHubService } from '../../services/rnbo/rnbo-event-hub.service';
import { Observable, from } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';



interface MessageForm {
  inport: string;
  payload: number | number[];
}
@Component({
  selector: 'app-rnbo-device',
  template: `
    <h3>{{ id }}</h3>
    <div class="device-ui" *ngIf="loaded">
    <button mat-button id= "device-selection-menu-trigger" [matMenuTriggerFor]="menu">Menu</button>
<mat-menu #menu="matMenu" >
  <div class="device-selection-button-container" *ngFor="let score_id of (scoreBuffers|async)">
  <button mat-menu-item (click)="loadScore(score_id)">{{score_id}}</button>
  </div>
</mat-menu> 

      <div
        class="device-parameter-container"
        *ngFor="let parameter of params; let i = index"
      >
        <app-parameter-ui
          [device_id]="id"
          [parameter]="parameter"
          [precision]="4"
          [isNormalized]="false"
          (update)="updateParameter($event, i)"
        ></app-parameter-ui>
      </div>
      <div class="device-inport-container">
        <app-inport-ui
          [device_id]="id"
          [inportInfo]="inports"
          (send)="sendMessage($event)"
        >
        </app-inport-ui>
      </div>
    </div>
    <div id="testButton">
      <button (click)="doTest()">test</button>
      </div>
      <!--
    <div id="queryForm">
  <form [formGroup]="testQuery">
  <mat-form-field class="message-input">
    <mat-label>query index</mat-label>
    <input matInput formControlName="index">
  </mat-form-field>
  <button mat-button (click)="sendQuery()">Query</button>
</form>
</div>
-->

  `,
  //templateUrl: './rnbo-device.component.html',
  styleUrls: ['./rnbo-device.component.scss'],
})
export class RnboDeviceComponent implements OnChanges {
  @Input() id: string = '';
  @Input() scoreBuffers: Observable<string[]>;
  testQuery: FormGroup;
  
  device: RNBO.BaseDevice;
  scoreType: string = '4_A';
  loaded: boolean = false;
  merger?: ChannelMergerNode;
  splitter?: ChannelSplitterNode;
  constructor(
    private fb: FormBuilder,
    private rnboLoader: RnboLoaderService,
    private rnboHub: RnboEventHubService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient
  ) {}
  ngOnInit() {
    this.testQuery = this.fb.group({
      index: ''
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    let idChange = changes?.['id'];
    if ((idChange)&&((idChange.currentValue!==idChange.previousValue)||(idChange.firstChange))) {
      this.updateDevice(changes['id'].currentValue);
    }
  }
  /*
  sendQuery() {
    let msgEvt = new RNBO.MessageEvent(RNBO.TimeNow, 'testQuery', +this.testQuery.get('index').value);
    this.device.scheduleEvent(msgEvt);
  }
  */
  async loadScore(score_id: string) {
    this.rnboLoader.loadScore(this.id, score_id);
  }
  async updateDevice(newID: string) {
    this.id = newID;
    this.device = (await this.rnboLoader.loadDevice(this.id, {'logDevice': true, 'logPatcher': true}) as RNBO.BaseDevice);
    this.rnboHub.addEventHandler(this.id, this.device, "message", 
    ((evt) => {
      console.log(`received outport message`);
      console.log(evt);
    } 
    ));
    this.loaded = true;
    let categories = this.id.split('_');
    this.scoreType = `${categories[1]}_${categories[2]}`;
    this.scoreBuffers = from(this.rnboLoader.loadScoreList(this.scoreType));
    this.cdRef.detectChanges();
  }
  // Reroute this event handling the the evnet-hub service once timing is enabled
  updateParameter(valueChangeEvent: number, parameterIndex: number) {
    if (this?.device?.numParameters > parameterIndex) {
      console.log(`setting parameter ${parameterIndex} to ${valueChangeEvent}`);
      this.device.parameters[parameterIndex].value = valueChangeEvent;
    }
  }
  sendMessage(evt: MessageForm) {
    let msgEvt = new RNBO.MessageEvent(RNBO.TimeNow, evt.inport, evt.payload);
    this.device.scheduleEvent(msgEvt);
  }
  get params(): RNBO.Parameter[] {
    return this?.device?.parameters ?? [];
  }
  get inports(): RNBO.MessageInfo[] {
    return this?.device?.inports ?? [];
  }
  get buf_ids(): string[] {
    return this.device.dataBufferDescriptions.map((dBD: RNBO.ExternalDataInfo) => dBD.id);
  }
  doTest() {
    console.log('doing test');
    // Replace 'YOUR_CLOUD_FUNCTION_URL' with the actual URL of your deployed Cloud Function
    const cloudFunctionUrl = 'https://testfunction-rhvbvqnulq-uc.a.run.app';

    // Create a JSON object with the numbers property
    const data = {
      text: 'hello world'
    };
    this.http.post(cloudFunctionUrl, data).subscribe((res) => {
      try {
        console.log('ArrayBuffer uploaded successfully:', res);
      }
      catch(err) {
        console.error('Error uploading ArrayBuffer:', err);
      }
    });
  }
}