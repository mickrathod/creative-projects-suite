/**
 * Online Guitar - Karplus-Strong String Synthesis Engine
 * Physically modeled string synthesis with body resonance, tone modes, and chords.
 */

export const TUNINGS = {
  standard: {
    name: 'Standard (E-A-D-G-B-E)',
    strings: [
      { note: 'E2', freq: 82.41, key: '1' },
      { note: 'A2', freq: 110.00, key: '2' },
      { note: 'D3', freq: 146.83, key: '3' },
      { note: 'G3', freq: 196.00, key: '4' },
      { note: 'B3', freq: 246.94, key: '5' },
      { note: 'E4', freq: 329.63, key: '6' }
    ]
  },
  dropD: {
    name: 'Drop D (D-A-D-G-B-E)',
    strings: [
      { note: 'D2', freq: 73.42, key: '1' },
      { note: 'A2', freq: 110.00, key: '2' },
      { note: 'D3', freq: 146.83, key: '3' },
      { note: 'G3', freq: 196.00, key: '4' },
      { note: 'B3', freq: 246.94, key: '5' },
      { note: 'E4', freq: 329.63, key: '6' }
    ]
  },
  dadgad: {
    name: 'DADGAD (Celtic / Folk)',
    strings: [
      { note: 'D2', freq: 73.42, key: '1' },
      { note: 'A2', freq: 110.00, key: '2' },
      { note: 'D3', freq: 146.83, key: '3' },
      { note: 'G3', freq: 196.00, key: '4' },
      { note: 'A3', freq: 220.00, key: '5' },
      { note: 'D4', freq: 293.66, key: '6' }
    ]
  }
};

export const CHORDS = {
  'E major': [0, 2, 2, 1, 0, 0],
  'A major': [null, 0, 2, 2, 2, 0],
  'D major': [null, null, 0, 2, 3, 2],
  'G major': [3, 2, 0, 0, 0, 3],
  'C major': [null, 3, 2, 0, 1, 0],
  'E minor': [0, 2, 2, 0, 0, 0],
  'A minor': [null, 0, 2, 2, 1, 0],
  'D minor': [null, null, 0, 2, 3, 1]
};

export class GuitarSynth {
  constructor() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.toneMode = 'acoustic'; // 'acoustic', 'bright', 'overdrive'
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.85;

    // Acoustic Body Resonance Filter (peaking around 100Hz and 220Hz wood box resonance)
    this.bodyFilter = this.ctx.createBiquadFilter();
    this.bodyFilter.type = 'peaking';
    this.bodyFilter.frequency.value = 180;
    this.bodyFilter.Q.value = 1.2;
    this.bodyFilter.gain.value = 4.0;

    // Overdrive distortion curve
    this.distortion = this.ctx.createWaveShaper();
    this.distortion.curve = this.makeDistortionCurve(25);
    this.distortion.oversample = '4x';

    this.bodyFilter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  ensureContext() {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  makeDistortionCurve(k = 25) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  setToneMode(mode) {
    this.toneMode = mode;
    if (mode === 'overdrive') {
      this.bodyFilter.disconnect();
      this.bodyFilter.connect(this.distortion);
      this.distortion.connect(this.masterGain);
    } else {
      try { this.distortion.disconnect(); } catch (e) {}
      this.bodyFilter.disconnect();
      this.bodyFilter.connect(this.masterGain);

      if (mode === 'bright') {
        this.bodyFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
        this.bodyFilter.gain.setValueAtTime(3.0, this.ctx.currentTime);
      } else {
        this.bodyFilter.frequency.setValueAtTime(180, this.ctx.currentTime);
        this.bodyFilter.gain.setValueAtTime(4.0, this.ctx.currentTime);
      }
    }
  }

  // Karplus-Strong string pluck
  pluckString(frequency, stringIndex = 0, duration = 3.5) {
    this.ensureContext();
    const sampleRate = this.ctx.sampleRate;
    const period = Math.round(sampleRate / frequency);
    const totalSamples = Math.floor(sampleRate * duration);

    const buffer = this.ctx.createBuffer(1, totalSamples, sampleRate);
    const output = buffer.getChannelData(0);

    // Initial white noise burst filling the first period
    for (let i = 0; i < period; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Karplus-Strong feedback loop with low-pass dampening
    // Lower strings (index 0, 1) sustain longer than thin strings (index 4, 5)
    const decayFactor = 0.992 - (stringIndex * 0.002);

    for (let i = period; i < totalSamples; i++) {
      // Averaging adjacent samples emulates acoustic string loss
      const val = ((output[i - period] + output[i - period - 1]) / 2) * decayFactor;
      output[i] = val;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    // String gain node with envelope
    const gainNode = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gainNode.gain.setValueAtTime(0.9, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(gainNode);
    gainNode.connect(this.bodyFilter);

    source.start(now);
  }

  // Strum a full chord with humanized micro-delays between strings
  strumChord(fretOffsets, stringList, direction = 'down') {
    this.ensureContext();
    const validStrings = [];
    fretOffsets.forEach((fret, idx) => {
      if (fret !== null && stringList[idx]) {
        // frequency = baseFreq * 2^(fret / 12)
        const baseFreq = stringList[idx].freq;
        const noteFreq = baseFreq * Math.pow(2, fret / 12);
        validStrings.push({ stringIdx: idx, freq: noteFreq });
      }
    });

    if (direction === 'up') {
      validStrings.reverse();
    }

    validStrings.forEach((item, order) => {
      const delayMs = order * 22; // 22ms per string strum
      setTimeout(() => {
        this.pluckString(item.freq, item.stringIdx);
      }, delayMs);
    });

    return validStrings.map(v => v.stringIdx);
  }
}
