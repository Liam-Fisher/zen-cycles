import {onRequest} from 'firebase-functions/v2/https';
import {log} from 'firebase-functions/logger';
import {Storage} from "@google-cloud/storage";
import {v1beta1} from '@google-cloud/text-to-speech';

type TTSInput = {text: string}|{ssml: string}; // | SSML
type TTSVoice = {
  languageCode: string;
  name: string;
}
type TTSAudioConfig = {
  audioEncoding: 'MP3'|'OGG_OPUS'; // ?? just MP3 
  volumeGainDb?: number; // [-96, 16]
  pitch?: number; // [-20, 20]
  speakingRate?: number; // [-0.25, 4.0];
}
// move counting data (e.g. start, end, break) to audio
export interface TTSRequest {
  input: TTSInput;
  audioConfig: TTSAudioConfig;
  voice: TTSVoice;
}

const storage = new Storage();
const tts = new v1beta1.TextToSpeechClient();


exports.createCount = onRequest(
  {cors: true},
  async (req, res) => {
log(`received request`);
    try { 
      const data = req.body.ttsData as TTSRequest;
      const bucket = storage.bucket(`gs://scriptedcounts`);
      // 
      // const filename = `${data.voice.languageCode}_${}`
      const file = bucket.file(`testData_${((Date.now())%100000).toPrecision(4)}.mp3`);
      const [response] = await tts.synthesizeSpeech(data);
      const buf = Buffer.from(response?.audioContent ?? '');

  await file.save(buf, {
        metadata: {
                contentType: "audio/mp3",
        },
    });
      res.status(200).send({text:`audio created`});
    }
     catch (err) {
      res.status(500).send({text: `Error creating file,`});
    }
  }
);


