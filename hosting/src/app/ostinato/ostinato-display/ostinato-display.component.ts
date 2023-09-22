import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FirebaseLoaderService } from 'src/app/services/firebase/firebase-loader.service';
import {from} from 'rxjs';
interface ClientOstinatoData {
  pitches: string;
  amplitudes: string;
  interonsetIntervals: string;
  durationRatios: string;
}

@Component({
  selector: 'app-ostinato-display',
  templateUrl: './ostinato-display.component.html',
  styleUrls: ['./ostinato-display.component.scss']
})
export class OstinatoDisplayComponent {
    ostinatoData: FormGroup
    cloudFunctionUrl = 'https://buildostinato-rhvbvqnulq-uc.a.run.app'
    constructor(
      private fb: FormBuilder,
      private http: HttpClient,
      private fsLoader: FirebaseLoaderService
      ){
        this.ostinatoData = this.fb.group({
          name: '',
          pitches: '',
          amplitudes: '',
          interonsetIntervals: '',
          durationRatios: ''
        });
      }
      loadData() {
        let noteCount = 0;
        let noteIndex = 0;
        from(this.fsLoader.loadScore('testOst2.bin')).subscribe((buf: ArrayBuffer) => {
          const view = new Float32Array(buf);
          noteCount = 20;
          nextNote();
          function nextNote() {
            if (noteIndex < noteCount) {
              let chan1 = view[noteIndex*2];
              let chan2 = view[noteIndex*2+1];
              console.log(`note: ${noteIndex} of ${noteCount}`);
              console.log(`__________________________________________________________________________`);
              let pitch = Math.floor(chan1);
              let amp = chan1 - pitch;
              let ioi = Math.floor(chan2);
              let ratio = chan2 - ioi;
              console.log(`pitch | amp |  ioi  | ratio`);
              console.log(`${pitch}  | ~${String.fromCharCode(Math.floor(amp*20+66))}~ | ${ioi.toString(10).padStart(4).padEnd(5)} | ${ratio.toFixed(4)}`);
              console.log(`--------------------------------------------------------------------------`);
              noteIndex++;
              setTimeout(nextNote, 250);
            }
          }
    });
    
  }

    sendData() {
      const testData = {
        "bucket": this.fsLoader.bucket,
        "path": "testOst2",
        "ostinato": {
        "maxNotes": '',
        "amplitudes": "0.9 0.6 0.6 0.6",
        "durationRatios": "0.99 0.99 0.33",
        "interonsetIntervals": "4 4 2 4 4 2 2",
        "pitches": "69 67 64 72 71"
        }
      };
      this.http.post(this.cloudFunctionUrl, testData).subscribe((res) => {
          console.log('status:', res);
      });

    }

}
