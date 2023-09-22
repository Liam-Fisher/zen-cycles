"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var monophonic_1 = require("../src/monophonic");
var exampleData = {
    "maxNotes": '',
    "amplitudes": "0.9 0.6",
    "durationRatios": "0.99 0.99 0.33",
    "interonsetIntervals": "4 4 2 4",
    "pitches": "69 67 64"
};
console.log("running test");
test(exampleData);
function test(ost) {
    var result = (0, monophonic_1.buildMonophonicOstinato)(ost);
    console.log("created result");
    var noteCount = result.byteLength / 8;
    var chan1, chan2, pitch, amp, ioi, ratio;
    var noteIndex = 0;
    nextNote();
    function nextNote() {
        if (noteIndex < noteCount) {
            if ((0, os_1.endianness)() === "LE") {
                chan1 = result.readFloatLE(noteIndex * 8);
                chan2 = result.readFloatLE(noteIndex * 8 + 4);
            }
            else {
                chan1 = result.readFloatBE(noteIndex * 8);
                chan2 = result.readFloatBE(noteIndex * 8 + 4);
            }
            noteIndex++;
            console.log("note: ".concat(noteIndex, " of ").concat(noteCount));
            console.log("__________________________________________________________________________");
            pitch = Math.floor(chan1);
            amp = chan1 - pitch;
            ioi = Math.floor(chan2);
            ratio = chan2 - ioi;
            console.log("pitch | amp |  ioi  | ratio");
            console.log("".concat(pitch, "  | ~").concat(String.fromCharCode(Math.floor(amp * 20 + 66)), "~ | ").concat(ioi.toString(10).padStart(4).padEnd(5), " | ").concat(ratio.toFixed(4)));
            console.log("--------------------------------------------------------------------------");
            setTimeout(nextNote, 100);
        }
    }
}
