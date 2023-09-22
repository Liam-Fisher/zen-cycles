import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc
} from '@angular/fire/firestore';
import { Storage, ref, getBlob,getBytes, getDownloadURL } from '@angular/fire/storage';
import { TTSRequest } from '../ext/tts-helper.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseLoaderService {
  readonly devices= ['ostinato'];
  readonly storage: Required<Storage> = inject(Storage);
  readonly fs: Required<Firestore> = inject(Firestore);
  readonly bucket: string =  `gs://${this.storage.app.options.storageBucket}`;
  constructor() { }
async getDoc(path: string) {
  return getDoc(doc(this.fs, path));
}
async getURL(path: string) {
  let url = await getDownloadURL(this.getRef(path));
  return url;
}
getRef(path: string) {
  console.log(`gettting reference to ${this.bucket}/${path} `);
  return ref(this.storage, `${this.bucket}/${path}`);
}
async loadBlob(path: string) {
  return getBlob(this.getRef(path));
}
async loadJSON(path: string) {
  return JSON.parse(await (await this.loadBlob(`${path}.json`)).text());
}
async loadScore(path: string) {
  return await getBytes(this.getRef(`scores/${path}`));
}
async loadAudio(audioCtx: AudioContext, path: string): Promise<AudioBuffer> {
  console.log(`audio from path ${path}`)
  let bytes = await getBytes(this.getRef(`${path}.mp3`));
  return audioCtx.decodeAudioData(bytes);
}
async addCountText(data: TTSRequest) {
  addDoc(collection(this.fs, 'count_text_docs'), data);
}
async getLanguageNames() {

}

}
