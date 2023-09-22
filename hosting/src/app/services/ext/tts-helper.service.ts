import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Database, ref as dbRef, get as dbGet  } from '@angular/fire/database';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Storage, ref } from '@angular/fire/storage';

interface countFormData {
language: string
voice: string
start: string
end: string
}

  // the standard interface...
// multiple functions for time/pitch contour could be added to this...
interface SSMLCountData {
        start: number;
        end: number;
        break_time: number;
}
type TTSData = {
  languageCode: string;
  voices: string[]
}
type TTSInput = {text: string}|{ssml: string}; // | SSML
type TTSVoice = {
  languageCode: string;
  name: string;
}
type TTSAudioConfig = {
  audioEncoding: string; // ?? just MP3 
  volumeGainDb?: number; // [-96, 16]
  pitch?: number; // [-20, 20]
  speakingRate?: number; // [-0.25, 4.0];
}
export interface TTSRequest {
  input: TTSInput;
  audioConfig: TTSAudioConfig;
  voice: TTSVoice;
}


@Injectable({
  providedIn: 'root'
})
export class TTSHelperService {
  readonly storage: Required<Storage> = inject(Storage);
  readonly firestore: Required<Firestore> = inject(Firestore);
  readonly database: Required<Database> = inject(Database);
  private activeLanguageCode: string;
  private activeVoice: string;
  readonly cloudFunctionUrl: string = 'https://createcount-rhvbvqnulq-uc.a.run.app';
  constructor(private http: HttpClient) { }


async addCountText(data: TTSRequest) {
  addDoc(collection(this.firestore, 'count_text_docs'), data);
}
get languageNames() {
  return dbGet(dbRef(this.database, 'language_names')).then((snapshot => {
    if(snapshot.exists()) {
      return snapshot.val() as string[];
    }
    else {
      return ['error'];
    }
  }
  ));
}
languageVoices(lang: string) {
  return dbGet(dbRef(this.database, `language_options/${lang}`)).then((snapshot => {
    if(snapshot.exists()) {
      let val = snapshot.val() as TTSData;
      this.activeLanguageCode = val.languageCode;
      return val.voices as string[];
    }
    else {
      return ['<empty>'];
    }
  }
  ));
}
createRequest(formData: countFormData) {
  console.log(`formData`);
  console.log(formData);
  let tags = formData.voice.split('-');
  let name = [this.activeLanguageCode, tags[1], tags[2]].join('-');

let ssmlString = this.formatCountSSML(+formData.start, +formData.end, 250);
console.log(`SSML`);
console.log(ssmlString);

const testRequest = {
  ttsData: {
  input: {
    ssml: ssmlString
  },
  audioConfig: {
    audioEncoding: 'MP3'
  },
  voice: {
    languageCode: this.activeLanguageCode,
    name: [this.activeLanguageCode, tags[1], tags[2]].join('-')
  }
}
}

  console.log(`TTS Request`);
  console.log(testRequest);

  this.http.post(this.cloudFunctionUrl, testRequest).subscribe((result) => {
    console.log(`result: ${result}`);
  });
}
/*
createRequest(formData: countFormData) {
  let ssmlGender: string;
  console.log(`formData`);
  console.log(formData);
  let tags = formData.voice.split('-');
  //let gender = tags[0];
  let name = [this.activeLanguageCode, tags[1], tags[2]].join('-');

let ssmlString = this.formatCountSSML(+formData.start, +formData.end, 250);
console.log(`SSML`);
console.log(ssmlString);

const testRequest: TTSRequest= {
  text: ssmlString,
  audioEncoding: 'MP3',
  ssmlGender: gender,
  languageCode: this.activeLanguageCode,
  voiceName: [this.activeLanguageCode, tags[1], tags[2]].join('-'),
  speakingRate: 0.9
}

  console.log(`TTS Request`);
  console.log(testRequest);
  this.addCountText(testRequest);
}
*/
formatCountSSML(start: number, end: number, break_time: number) {
  const openingTag = '<say-as interpret-as="cardinal">';
  const closingTag = `</say-as>\n`;
  let breakTag = break_time ? `<break time="${break_time}ms" />\n` : '\n';
	let inc = +(start < end) * 2 - 1; 
  let total = Math.abs(start - end) + 1;
  return `<speak>\n${(new Array(total)).fill('')
    .map((s,i) =>`${openingTag} ${(start + i*inc)} ${closingTag}`)
    // add prosody maps here...
    .join(breakTag)}\n</speak>`;
}


}
