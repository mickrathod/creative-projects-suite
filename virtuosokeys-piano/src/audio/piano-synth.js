/**
 * VirtuosoKeys - Advanced Physical Acoustic Grand Piano Synthesizer
 * Implements harmonic string stiffness (inharmonicity), hammer strike transient modeling,
 * soundboard acoustic body filtering, damper sustain pedal dynamics, and Web MIDI.
 */

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const SARGAM_NAMES = ['Sa', 're', 'Re', 'ga', 'Ga', 'ma', 'Ma', 'Pa', 'dha', 'Dha', 'ni', 'Ni'];

// Generate 88 Piano Keys from MIDI 21 (A0) to 108 (C8)
export const ALL_PIANO_KEYS = [];
for (let midi = 21; midi <= 108; midi++) {
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const noteName = NOTE_NAMES[noteIndex];
  const isBlack = noteName.includes('#');
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  const sargam = SARGAM_NAMES[noteIndex];

  ALL_PIANO_KEYS.push({
    midi,
    name: `${noteName}${octave}`,
    noteName,
    octave,
    isBlack,
    freq,
    sargam
  });
}

// Computer keyboard mappings for white and black keys in middle octaves
export const KEYBOARD_KEY_MAP = {
  // Octave 4 White Keys (Middle C row)
  'a': 60, // C4
  's': 62, // D4
  'd': 64, // E4
  'f': 65, // F4
  'g': 67, // G4
  'h': 69, // A4
  'j': 71, // B4
  'k': 72, // C5
  'l': 74, // D5
  ';': 76, // E5
  "'": 77, // F5

  // Octave 4 Black Keys
  'w': 61, // C#4
  'e': 63, // D#4
  't': 66, // F#4
  'y': 68, // G#4
  'u': 70, // A#4
  'o': 73, // C#5
  'p': 75, // D#5

  // Octave 3 (Lower row)
  'z': 48, // C3
  'x': 50, // D3
  'c': 52, // E3
  'v': 53, // F3
  'b': 55, // G3
  'n': 57, // A3
  'm': 59, // B3
};

export class PianoSynth {
  constructor() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.85;

    // Master Limiter / Compressor
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-2.0, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(4.0, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(12.0, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.1, this.ctx.currentTime);

    // Master Analyser for 60 FPS Visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 1024;

    // Soundboard Body Resonance Filters
    this.soundboardLow = this.ctx.createBiquadFilter();
    this.soundboardLow.type = 'peaking';
    this.soundboardLow.frequency.value = 240; // Wood body resonance
    this.soundboardLow.Q.value = 1.2;
    this.soundboardLow.gain.value = 3.5;

    this.soundboardAir = this.ctx.createBiquadFilter();
    this.soundboardAir.type = 'highshelf';
    this.soundboardAir.frequency.value = 4500; // String acoustic shimmer
    this.soundboardAir.gain.value = 1.5;

    // Concert Hall Convolver Reverb
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = this.createSyntheticReverbBuffer(2.4, 2.2);
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.28;

    // Dry / Wet Routing
    this.soundboardLow.connect(this.soundboardAir);
    this.soundboardAir.connect(this.masterGain);

    // Reverb send
    this.soundboardAir.connect(this.reverbNode);
    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.masterGain);

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Active voices: midi -> voice object
    this.activeVoices = new Map();
    this.isSustainPedalDown = false;
    this.sustainedVoices = new Set();

    // Preset
    this.currentPreset = 'grand'; // 'grand', 'bright', 'electric', 'ethereal'

    // MIDI setup
    this.midiAccess = null;
    this.midiListeners = [];
    this.initMIDI();
  }

  ensureContext() {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  createSyntheticReverbBuffer(duration, decay) {
    const sampleRate = this.ctx.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      const factor = Math.exp(-n * decay);
      left[i] = (Math.random() * 2 - 1) * factor;
      right[i] = (Math.random() * 2 - 1) * factor;
    }
    return impulse;
  }

  setPreset(preset) {
    this.currentPreset = preset;
    const now = this.ctx.currentTime;
    if (preset === 'bright') {
      this.soundboardAir.gain.setTargetAtTime(5.0, now, 0.05);
      this.reverbGain.gain.setTargetAtTime(0.18, now, 0.05);
    } else if (preset === 'electric') {
      this.soundboardAir.gain.setTargetAtTime(-3.0, now, 0.05);
      this.reverbGain.gain.setTargetAtTime(0.35, now, 0.05);
    } else if (preset === 'ethereal') {
      this.soundboardAir.gain.setTargetAtTime(6.0, now, 0.05);
      this.reverbGain.gain.setTargetAtTime(0.65, now, 0.05);
    } else {
      // Grand Piano
      this.soundboardAir.gain.setTargetAtTime(1.5, now, 0.05);
      this.reverbGain.gain.setTargetAtTime(0.28, now, 0.05);
    }
  }

  setSustainPedal(isDown) {
    this.isSustainPedalDown = isDown;
    if (!isDown) {
      // Release all sustained voices that are no longer physically held
      this.sustainedVoices.forEach((voice) => {
        this.stopVoice(voice);
      });
      this.sustainedVoices.clear();
    }
  }

  setMasterVolume(val) {
    const now = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1.2, val)), now, 0.02);
  }

  /**
   * Play Note with physical acoustic harmonic partials
   */
  startNote(midi, velocity = 0.85) {
    this.ensureContext();

    // Release existing voice on same key if playing
    if (this.activeVoices.has(midi)) {
      const oldVoice = this.activeVoices.get(midi);
      this.stopVoice(oldVoice, 0.04);
      this.activeVoices.delete(midi);
      this.sustainedVoices.delete(oldVoice);
    }

    const keyData = ALL_PIANO_KEYS.find((k) => k.midi === midi);
    if (!keyData) return;

    const fundamental = keyData.freq;
    const now = this.ctx.currentTime;
    const voiceGain = this.ctx.createGain();

    // Velocity scale (0 to 1)
    const velFactor = Math.pow(velocity, 1.4);
    voiceGain.gain.setValueAtTime(0, now);
    voiceGain.gain.linearRampToValueAtTime(velFactor * 0.9, now + 0.003);

    // Natural piano decay time: low bass rings longer, high treble decays quickly
    const decayDuration = Math.max(1.2, 7.5 - (midi - 21) * 0.065);
    voiceGain.gain.setTargetAtTime(0.0001, now + 0.04, decayDuration * 0.6);

    // Partial Harmonics with inharmonicity B
    // f_k = k * f_0 * sqrt(1 + B * k^2)
    const inharmonicityB = 0.00012 * Math.pow(midi / 45, 1.8);
    const partialCount = midi < 50 ? 6 : midi < 75 ? 4 : 2;

    const oscNodes = [];
    const partialWeights = [1.0, 0.55, 0.32, 0.18, 0.09, 0.04];

    for (let p = 1; p <= partialCount; p++) {
      const osc = this.ctx.createOscillator();
      const pFreq = p * fundamental * Math.sqrt(1 + inharmonicityB * p * p);
      osc.frequency.setValueAtTime(pFreq, now);

      if (this.currentPreset === 'electric') {
        osc.type = p === 1 ? 'sine' : 'triangle';
      } else {
        osc.type = p % 2 === 1 ? 'sine' : 'triangle';
      }

      const pGain = this.ctx.createGain();
      const weight = (partialWeights[p - 1] || 0.05) * (1 - (p - 1) * 0.12);
      pGain.gain.setValueAtTime(weight, now);

      osc.connect(pGain);
      pGain.connect(voiceGain);
      osc.start(now);
      oscNodes.push(osc);
    }

    // Hammer Strike Click Transient
    const hammerBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.015), this.ctx.sampleRate);
    const hData = hammerBuffer.getChannelData(0);
    for (let i = 0; i < hData.length; i++) {
      const t = i / this.ctx.sampleRate;
      hData[i] = (Math.random() * 2 - 1) * Math.exp(-t * 260);
    }
    const hammerSource = this.ctx.createBufferSource();
    hammerSource.buffer = hammerBuffer;
    const hammerFilter = this.ctx.createBiquadFilter();
    hammerFilter.type = 'bandpass';
    hammerFilter.frequency.setValueAtTime(1400 + midi * 20, now);
    hammerFilter.Q.setValueAtTime(1.8, now);

    const hammerGain = this.ctx.createGain();
    hammerGain.gain.setValueAtTime(velFactor * 0.22, now);

    hammerSource.connect(hammerFilter);
    hammerFilter.connect(hammerGain);
    hammerGain.connect(this.soundboardLow);
    hammerSource.start(now);

    // Connect voice gain to soundboard
    voiceGain.connect(this.soundboardLow);

    const voice = {
      midi,
      keyData,
      voiceGain,
      oscNodes,
      startTime: now
    };

    this.activeVoices.set(midi, voice);
    return voice;
  }

  /**
   * Release key / damper fall
   */
  stopNote(midi) {
    const voice = this.activeVoices.get(midi);
    if (!voice) return;

    if (this.isSustainPedalDown) {
      // Keep ringing until pedal is lifted
      this.sustainedVoices.add(voice);
    } else {
      this.stopVoice(voice);
    }

    this.activeVoices.delete(midi);
  }

  stopVoice(voice, releaseTime = 0.12) {
    if (!voice || !voice.voiceGain) return;
    const now = this.ctx.currentTime;
    try {
      voice.voiceGain.gain.cancelScheduledValues(now);
      voice.voiceGain.gain.setValueAtTime(voice.voiceGain.gain.value, now);
      voice.voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

      setTimeout(() => {
        voice.oscNodes.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        });
        voice.voiceGain.disconnect();
      }, releaseTime * 1000 + 50);
    } catch (e) {}
  }

  /**
   * Web MIDI API Integration
   */
  async initMIDI() {
    if (typeof navigator !== 'undefined' && navigator.requestMIDIAccess) {
      try {
        this.midiAccess = await navigator.requestMIDIAccess();
        this.setupMIDIPorts();
        this.midiAccess.onstatechange = () => this.setupMIDIPorts();
      } catch (err) {
        console.warn('Web MIDI not available or permission denied:', err);
      }
    }
  }

  setupMIDIPorts() {
    if (!this.midiAccess) return;
    for (const input of this.midiAccess.inputs.values()) {
      input.onmidimessage = (msg) => this.handleMIDIMessage(msg);
    }
  }

  handleMIDIMessage(event) {
    const [status, data1, data2] = event.data;
    const command = status >> 4;
    const midiNote = data1;
    const velocity = data2 / 127;

    if (command === 9 && data2 > 0) {
      // Note On
      this.startNote(midiNote, velocity);
      this.notifyMIDIListeners('noteon', midiNote, velocity);
    } else if (command === 8 || (command === 9 && data2 === 0)) {
      // Note Off
      this.stopNote(midiNote);
      this.notifyMIDIListeners('noteoff', midiNote);
    } else if (command === 11) {
      // Control Change
      if (data1 === 64) {
        // Damper Sustain Pedal
        const isDown = data2 >= 64;
        this.setSustainPedal(isDown);
        this.notifyMIDIListeners('sustain', isDown);
      }
    }
  }

  onMIDIEvent(callback) {
    this.midiListeners.push(callback);
    return () => {
      this.midiListeners = this.midiListeners.filter((cb) => cb !== callback);
    };
  }

  notifyMIDIListeners(type, ...args) {
    this.midiListeners.forEach((cb) => cb(type, ...args));
  }
}
