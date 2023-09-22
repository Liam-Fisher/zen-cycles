import { Buffer } from "buffer";
import { endianness } from "os";
import { findLCM } from "./helpers";
// add parameter property (pitch, amplitude, envelopeIndex etc...)
type CycleTemplate = {
  index: number;
  size: number;
  sequence: number[];
};


export class SimpleSplitChannelScore {
  currentNote = 0;
  maxNotes: number;
  cyclesAligned = false;
  scoreBuffer: Buffer;
  isLE: boolean = endianness() === "LE";
  cycles: CycleTemplate[];
  constructor(sequences: number[][], maxNotes: number) {
    this.cycles = sequences.map((seq) => {
      return {
        index: 0,
        size: seq.length,
        sequence: seq,
      };
    });
    this.maxNotes = maxNotes ? maxNotes : findLCM(this.sizes);
    this.scoreBuffer = Buffer.alloc(this.maxNotes * this.cycles.length * 2);
  }
  get sizes() {
    return this.cycles.map((c) => c.sequence.length);
  }
  buildScoreBuffer() {
    let currentNote = 0;
    do {
      //console.log(`writing ${currentNote+1} of ${this.maxNotes} notes`);
      this.getCycleValues(currentNote++);
    } while (currentNote < this.maxNotes);
    return this.scoreBuffer;
  }
  getCycleValues(currentNote: number) {
    let integerPart = 0;
    for (
      let cyclePosition = 0;
      cyclePosition < this.cycles.length;
      cyclePosition++
    ) {
      let cycle = this.cycles[cyclePosition];
      let cycleValue = cycle.sequence[cycle.index++];
      //console.log(`cycle: ${cyclePosition} value: ${cycleValue}`);
      if (cyclePosition % 2) {
        let offset =
          currentNote * this.cycles.length * 2 + (cyclePosition - 1) * 2;
        this.writeToBuffer(integerPart + cycleValue, offset);
      } else {
        integerPart = Math.floor(cycleValue);
      }
      cycle.index %= cycle.size;
    }
  }
  writeToBuffer(channelValue: number, bufferOffset: number) {
    //console.log(`writing at offset: ${bufferOffset}`);
    if (this.isLE) {
      //console.log(`writing LE value: ${channelValue}`);
      this.scoreBuffer.writeFloatLE(channelValue, bufferOffset);
    } else {
      //console.log(`writing BE value: ${channelValue}`);
      this.scoreBuffer.writeFloatBE(channelValue, bufferOffset);
    }
  }
}

