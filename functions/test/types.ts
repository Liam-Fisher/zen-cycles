export interface OstinatoData {
        voices: VoiceData[]
        constraints: {
            minNotes: number;
            maxNotes: number;
            maxDurationMs: number;
        }
        globals: {
            timing: TimingGlobal;
            pitch: PitchGlobal
            amplitude: AmplitudeGlobal
        }
}


export type VoiceData =  {
    amplitudes: AmplitudeCycle;
    pitches: PitchCycle;
    durations: DurationCycle;
    modifiers?: PatternModifiers;
}

type PatternModifiers = {
    masks?: number[];
    permutations?: number[][];
    permutationSchedule: ModifierSchedule
    maskSchedule: ModifierSchedule
}
type ModifierSchedule = {
    [Param in keyof VoiceData]: ScheduleEntry
}
type ParameterCycle = {
    indexPatterns: number[][];
    schedule?: ScheduleEntry[];
}
type GroupCycle = ParameterCycle & { groups: number[][] }

type DiscreteEnvelopeCycle = ParameterCycle & { 
    envelopes: DiscreteEnvelope[] 
}
type ContinuousEnvelopeCycle = ParameterCycle & { 
    // for concatenating envelopes relative to the note duration
    partitions?: number[][]
    envelopes: ContinuousEnvelope[] 
}

type AmplitudeCycle = ParameterCycle & ContinuousEnvelopeCycle;
type PitchCycle = AmplitudeCycle & GroupCycle;
// duration envelopes are discrete 
// they have integer values
// they operate across multiple notes
// index 0 indicates a quanta offsets 
// for the duration index;
// index 1 indicates an event count 
// before the next quanta offset
type DurationCycle = ParameterCycle & GroupCycle & DiscreteEnvelopeCycle;


type DiscreteEnvelope = {
    points: [number, number][]
}
type ContinuousEnvelope = {
    points: [number, number, ...number[]][]
}


type ScheduleEntry = {
    index: number
    count: number
}
interface TimingGlobal {
            // default is ms
            // should match the tempo type of the instruments
            metric?: 'ms'|'ticks'|'samples'
            // smallest indivisible unit in event time
            quanta: number
}
interface PitchGlobal {
    // an array of numbers indicating frequencies in Hz
    // javascript expression as a string
        // should return an array of numbers
    // a single number indicates a root frequency
    // null indicates 440 (the standard)
    tunings?: (null|string|number|number[]);
    root: number
}
interface AmplitudeGlobal {
    mixes: Record<string, {
        // multiplier for the global amplitude
        global: number;
        // normalized balance per voice
        balance: number[];
    }>[]
    // quanta mapped to an amplitude scaling factor
    durationGainMaps?: Record<string, Record<number, number[]>>
    // tuning frequency mapped to an amplitude scaling factor
    tuningGainMaps?: Record<string, Record<string, number[]>>
    
    // meter position mapped to an amplitude offset
    // i.e. the
    // meterGainMaps?: Record<string, number|number[]|number[][]>
}


/*
Score Buffer types:
    coreBuffer : midiCents.amplitude, tickIOI.ratio 
    fxBuffer : amplitudeEnvelopeIndex.panning, pitchEnvelopeIndex.reverb

    tuningBuffer : pitch = tuningBuffer[_midiIndex/4][midiIndex%4] 
    
    lfoBuffer : (vibrato, tremolo, panning, ...generic) frequency.depth
    
    amplitudeEnvelopeBuffer : decibelOffset.durationRatio, groups
    pitchEnvelopeBuffer : midiCentOffset.durationRatio



    // tuned 

    4 channel split - amplitudeEnvelopeIndex.panning, pitchEnvelopeIndex.reverb, 
    // adds
    */

/*
Ostinato algorithm schema

basic format: 
globally: 
    check counting limits;
    if there are global parameter events : 
        apply any changes to timing quanta e.g. tempo;
        apply any changes to tuning map
        apply any modifiers to amplitude

    for each voice:    
        if there are any 
            get duration of next note event from duration cycle




*/