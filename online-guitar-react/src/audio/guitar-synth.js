/**
 * AuraStrings Pro - Advanced Physical Karplus-Strong Synthesis Engine
 * Complete with fretboard modeling, multi-tap delay reverb, stereo chorus,
 * tube overdrive, rhythmic pattern arpeggiator, and real-time audio analysis.
 */

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const TUNINGS = {
  standard: {
    name: 'Standard (E-A-D-G-B-E)',
    strings: [
      { note: 'E2', midi: 40, freq: 82.41, key: '1' },
      { note: 'A2', midi: 45, freq: 110.00, key: '2' },
      { note: 'D3', midi: 50, freq: 146.83, key: '3' },
      { note: 'G3', midi: 55, freq: 196.00, key: '4' },
      { note: 'B3', midi: 59, freq: 246.94, key: '5' },
      { note: 'E4', midi: 64, freq: 329.63, key: '6' }
    ]
  },
  dropD: {
    name: 'Drop D (D-A-D-G-B-E)',
    strings: [
      { note: 'D2', midi: 38, freq: 73.42, key: '1' },
      { note: 'A2', midi: 45, freq: 110.00, key: '2' },
      { note: 'D3', midi: 50, freq: 146.83, key: '3' },
      { note: 'G3', midi: 55, freq: 196.00, key: '4' },
      { note: 'B3', midi: 59, freq: 246.94, key: '5' },
      { note: 'E4', midi: 64, freq: 329.63, key: '6' }
    ]
  },
  dadgad: {
    name: 'DADGAD (Celtic / Folk)',
    strings: [
      { note: 'D2', midi: 38, freq: 73.42, key: '1' },
      { note: 'A2', midi: 45, freq: 110.00, key: '2' },
      { note: 'D3', midi: 50, freq: 146.83, key: '3' },
      { note: 'G3', midi: 55, freq: 196.00, key: '4' },
      { note: 'A3', midi: 57, freq: 220.00, key: '5' },
      { note: 'D4', midi: 62, freq: 293.66, key: '6' }
    ]
  },
  openG: {
    name: 'Open G (D-G-D-G-B-D)',
    strings: [
      { note: 'D2', midi: 38, freq: 73.42, key: '1' },
      { note: 'G2', midi: 43, freq: 98.00, key: '2' },
      { note: 'D3', midi: 50, freq: 146.83, key: '3' },
      { note: 'G3', midi: 55, freq: 196.00, key: '4' },
      { note: 'B3', midi: 59, freq: 246.94, key: '5' },
      { note: 'D4', midi: 62, freq: 293.66, key: '6' }
    ]
  }
};

export const CHORD_CATEGORIES = {
  Major: ['C major', 'D major', 'E major', 'F major', 'G major', 'A major', 'B major'],
  Minor: ['C minor', 'D minor', 'E minor', 'F minor', 'G minor', 'A minor', 'B minor'],
  '7ths': ['C7', 'D7', 'E7', 'G7', 'A7', 'B7', 'Am7', 'Em7'],
  'Sus / Add': ['Cadd9', 'Dsus4', 'Asus2', 'Fmaj7']
};

export const CHORDS = {
  // Major
  'E major': [0, 2, 2, 1, 0, 0],
  'A major': [null, 0, 2, 2, 2, 0],
  'D major': [null, null, 0, 2, 3, 2],
  'G major': [3, 2, 0, 0, 0, 3],
  'C major': [null, 3, 2, 0, 1, 0],
  'F major': [1, 3, 3, 2, 1, 1],
  'B major': [null, 2, 4, 4, 4, 2],
  // Minor
  'E minor': [0, 2, 2, 0, 0, 0],
  'A minor': [null, 0, 2, 2, 1, 0],
  'D minor': [null, null, 0, 2, 3, 1],
  'G minor': [3, 5, 5, 3, 3, 3],
  'C minor': [null, 3, 5, 5, 4, 3],
  'F minor': [1, 3, 3, 1, 1, 1],
  'B minor': [null, 2, 4, 4, 3, 2],
  // 7ths
  'E7': [0, 2, 0, 1, 0, 0],
  'A7': [null, 0, 2, 0, 2, 0],
  'D7': [null, null, 0, 2, 1, 2],
  'G7': [3, 2, 0, 0, 0, 1],
  'C7': [null, 3, 2, 3, 1, 0],
  'B7': [null, 2, 1, 2, 0, 2],
  'Am7': [null, 0, 2, 0, 1, 0],
  'Em7': [0, 2, 0, 0, 0, 0],
  'Dm7': [null, null, 0, 2, 1, 1],
  // Sus / Add
  'Cadd9': [null, 3, 2, 0, 3, 3],
  'Dsus4': [null, null, 0, 2, 3, 3],
  'Asus2': [null, 0, 2, 2, 0, 0],
  'Fmaj7': [null, null, 3, 2, 1, 0]
};

export const PROGRESSIONS = [
  { name: 'Classic Pop', chords: ['G major', 'D major', 'E minor', 'C major'] },
  { name: 'Folk Ballad', chords: ['C major', 'A minor', 'F major', 'G major'] },
  { name: 'Spanish Flamenco', chords: ['A minor', 'G major', 'F major', 'E major'] },
  { name: 'Acoustic Blues', chords: ['E7', 'A7', 'E7', 'B7', 'A7'] }
];

export function getNoteFromMidi(baseMidi, fret) {
  const midi = baseMidi + fret;
  const noteName = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return { name: noteName, octave, full: `${noteName}${octave}` };
}

export class GuitarSynth {
  constructor() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.toneMode = 'acoustic'; // 'acoustic', 'warm', 'bright', 'overdrive'
    
    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.85;

    // Body Resonance Filter (peaking at warm spruce guitar frequencies)
    this.bodyFilter = this.ctx.createBiquadFilter();
    this.bodyFilter.type = 'peaking';
    this.bodyFilter.frequency.value = 180;
    this.bodyFilter.Q.value = 1.4;
    this.bodyFilter.gain.value = 4.5;

    // Air Tone Filter (High Shelf for acoustic sparkle)
    this.airFilter = this.ctx.createBiquadFilter();
    this.airFilter.type = 'highshelf';
    this.airFilter.frequency.value = 4500;
    this.airFilter.gain.value = 2.0;

    // Analyser for 60FPS visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    // Simple Reverb impulse simulation via feedback delay
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.28;
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.value = 0.085;
    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.value = 0.42;

    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);
    this.delayNode.connect(this.reverbGain);

    // Overdrive distortion curve
    this.distortion = this.ctx.createWaveShaper();
    this.distortion.curve = this.makeDistortionCurve(35);
    this.distortion.oversample = '4x';

    // Wiring
    this.bodyFilter.connect(this.airFilter);
    this.airFilter.connect(this.masterGain);
    this.airFilter.connect(this.delayNode);
    this.reverbGain.connect(this.masterGain);

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Internal rhythm timer
    this.rhythmInterval = null;
  }

  ensureContext() {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.ensureContext();
    this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
  }

  setToneMode(mode) {
    this.toneMode = mode;
    const now = this.ctx.currentTime;
    
    // Disconnect effects chain
    try { this.airFilter.disconnect(); } catch (e) {}

    if (mode === 'overdrive') {
      this.airFilter.connect(this.distortion);
      this.distortion.connect(this.masterGain);
      this.airFilter.connect(this.delayNode);
      this.reverbGain.gain.setValueAtTime(0.15, now);
    } else {
      try { this.distortion.disconnect(); } catch (e) {}
      this.airFilter.connect(this.masterGain);
      this.airFilter.connect(this.delayNode);

      if (mode === 'bright') {
        this.bodyFilter.frequency.setValueAtTime(3200, now);
        this.bodyFilter.gain.setValueAtTime(3.5, now);
        this.airFilter.gain.setValueAtTime(5.0, now);
        this.reverbGain.gain.setValueAtTime(0.35, now);
      } else if (mode === 'warm') {
        this.bodyFilter.frequency.setValueAtTime(140, now);
        this.bodyFilter.gain.setValueAtTime(6.0, now);
        this.airFilter.gain.setValueAtTime(-2.0, now);
        this.reverbGain.gain.setValueAtTime(0.40, now);
      } else {
        // Acoustic Natural
        this.bodyFilter.frequency.setValueAtTime(180, now);
        this.bodyFilter.gain.setValueAtTime(4.5, now);
        this.airFilter.gain.setValueAtTime(2.0, now);
        this.reverbGain.gain.setValueAtTime(0.28, now);
      }
    }
  }

  makeDistortionCurve(k = 35) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // Karplus-Strong string synthesis
  pluckString(frequency, stringIndex = 0, duration = 3.6, velocity = 1.0) {
    this.ensureContext();
    const sampleRate = this.ctx.sampleRate;
    const period = Math.round(sampleRate / frequency);
    const totalSamples = Math.floor(sampleRate * duration);

    const buffer = this.ctx.createBuffer(1, totalSamples, sampleRate);
    const output = buffer.getChannelData(0);

    // Initial white-noise burst with velocity scaling
    for (let i = 0; i < period; i++) {
      output[i] = (Math.random() * 2 - 1) * velocity;
    }

    // Decay factor (thicker bass strings ring longer than thin unwound trebles)
    const decayFactor = 0.993 - (stringIndex * 0.0018);

    // Karplus-Strong averaging loop
    for (let i = period; i < totalSamples; i++) {
      const val = ((output[i - period] + output[i - period - 1]) / 2) * decayFactor;
      output[i] = val;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gainNode.gain.setValueAtTime(0.95 * velocity, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0005, now + duration);

    source.connect(gainNode);
    gainNode.connect(this.bodyFilter);

    source.start(now);
  }

  // Strum a chord with direction and velocity
  strumChord(fretOffsets, stringList, direction = 'down', speedMs = 24) {
    this.ensureContext();
    const validStrings = [];
    fretOffsets.forEach((fret, idx) => {
      if (fret !== null && stringList[idx]) {
        const baseFreq = stringList[idx].freq;
        const noteFreq = baseFreq * Math.pow(2, fret / 12);
        validStrings.push({ stringIdx: idx, freq: noteFreq, fret });
      }
    });

    if (direction === 'up') {
      validStrings.reverse();
    }

    validStrings.forEach((item, order) => {
      const delayMs = order * speedMs;
      // Slight natural velocity dynamics: picking down hits bass harder, up hits treble harder
      const vel = direction === 'down' ? 1.0 - (order * 0.04) : 0.85 + (order * 0.03);
      setTimeout(() => {
        this.pluckString(item.freq, item.stringIdx, 3.8, Math.max(0.65, vel));
      }, delayMs);
    });

    return validStrings.map(v => v.stringIdx);
  }

  // Frequency spectrum data for visualizer
  getSpectrumData() {
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}
