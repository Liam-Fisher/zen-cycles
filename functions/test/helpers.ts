
// this is for testing purposes...
export interface ClientOstinatoData {
    maxNotes: string;
    pitches: string;
    amplitudes: string;
    interonsetIntervals: string;
    durationRatios: string;
}

export function clientDataToTemplate(data: ClientOstinatoData): [number[][], number] {
  let maxNotes = isNaN(+data.maxNotes) ? 0 : +data.maxNotes;
  let orderedData = [data.pitches, data.amplitudes, data.interonsetIntervals, data.durationRatios];
    return [orderedData.map((data) => numArrayFromStr(data)), maxNotes];
}

export function numArrayFromStr(ctlStr: string): number[] {
  return ctlStr.split(' ').map( n => isNaN(+n) ? 0 : +n);
}
export function buildSequence(tuning: number[], group: number[], pattern: number[]){
      return pattern.map((el: number) => tuning[group[el]]);
}
export function findLCM(numbers: number[]) {
    // Function to find the GCD of two numbers using the Euclidean algorithm
    function findGCDofTwo(a: number, b: number) {
      while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
      }
      return a;
    }
    // Function to find the LCM of two numbers using the GCD
    function findLCMofTwo(a: number, b: number) {
      return (a * b) / findGCDofTwo(a, b);
    }
    // Reduce the array to find the LCM of all numbers
    return numbers.reduce((lcm, num) => findLCMofTwo(lcm, num), numbers[0]);
  }
