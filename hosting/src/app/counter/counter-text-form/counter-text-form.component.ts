import { Component,ViewChild  } from '@angular/core';
import { Observable, from, map,startWith, switchMap } from 'rxjs';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TTSHelperService } from 'src/app/services/ext/tts-helper.service';
type MatOpt = { value: string; viewValue: string };
@Component({
  selector: 'app-counter-text-form',
  templateUrl: './counter-text-form.component.html',
  styleUrls: ['./counter-text-form.component.scss'],
})
export class CounterTextFormComponent {
  voiceForm: FormGroup;
  //language_names: Observable<MatOpt[]>;
  //voice_names: Observable<MatOpt[]>;
  language_names: Observable<string[]>;

  filtered_language_options: Observable<string[]>;
  voice_names: Observable<string[]>;
  
  constructor(private fb: FormBuilder, private tts: TTSHelperService) {
   this.voiceForm = this.fb.group({
     language: new FormControl(''),
     voice: new FormControl(''),
     start: new FormControl(''),
     end: new FormControl('')
  });
   // this.language_names = from(this.tts.languageNames).pipe(
   //   map((names) =>
   //     names.map((n) => {
   //       return {
   //         value: n,
   //         viewValue: n.split('_').join(' '),
   //       };
   //     })
   //   )
   // );
   this.language_names = from(this.tts.languageNames);
   this.voice_names = this.voiceForm.get('language').valueChanges.pipe(
    switchMap((val: string) => from(this.tts.languageVoices(val)))
   );
   this.filtered_language_options = this.voiceForm.get('language').valueChanges.pipe(
    startWith(''),
    switchMap(value => this.language_names.pipe(
      map(options => this._filter(options, value || ''))
    ))
  );
}

  private _filter(options: string[], value: string): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
  createCount() {
    let val = this.voiceForm.getRawValue();
    console.log(val);
    this.tts.createRequest(val);
  }
}