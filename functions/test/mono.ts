import {endianness} from 'os';
import { ClientOstinatoData, clientDataToTemplate } from '../src/helpers';
import {SimpleSplitChannelScore} from '../src/monophonic';

const exampleData = {
"maxNotes": '',
"amplitudes": "0.9 0.6 0.6 0.6",
"durationRatios": "0.99 0.99 0.33",
"interonsetIntervals": "4 4 2 4 4 2 2",
"pitches": "69 67 64 72 71"
};

console.log(`running test`);
test(exampleData);
function test(ost: ClientOstinatoData) {
  const score = new SimpleSplitChannelScore(...clientDataToTemplate(ost));
  const result = score.buildScoreBuffer();
  console.log(`created result`);
  const noteCount = result.byteLength / 8;
  let chan1: number,
    chan2: number,
    pitch: number,
    amp: number,
    ioi: number,
    ratio: number;
  let noteIndex = 0;
  nextNote();

  function nextNote() {
    if (noteIndex < noteCount) {
      if (endianness() === "LE") {
        chan1 = result.readFloatLE(noteIndex * 8);
        chan2 = result.readFloatLE(noteIndex * 8 + 4);
      } else {
        chan1 = result.readFloatBE(noteIndex * 8);
        chan2 = result.readFloatBE(noteIndex * 8 + 4);
      }
      noteIndex++;
      console.log(`note: ${noteIndex} of ${noteCount}`);
      console.log(`__________________________________________________________________________`);
      pitch = Math.floor(chan1);
      amp = chan1 - pitch;
      ioi = Math.floor(chan2);
      ratio = chan2 - ioi;
      console.log(`pitch | amp |  ioi  | ratio`);
      console.log(`${pitch}  | ~${String.fromCharCode(Math.floor(amp*20+66))}~ | ${ioi.toString(10).padStart(4).padEnd(5)} | ${ratio.toFixed(4)}`);
      console.log(`--------------------------------------------------------------------------`);
      setTimeout(nextNote, 100);
    }
  }
}


