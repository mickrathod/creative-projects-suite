# 🎸 AuraStrings — Procedural Karplus-Strong Physical Guitar Synthesizer

> **Studio-Grade Virtual Guitar Simulation • Mathematical Physical Modeling • React 19 & Web Audio API • 100% Procedural Sound**

---

## 🎶 Vision & Product Overview

**AuraStrings** is an expressive, web-based acoustic and electric guitar simulator powered by mathematical physical modeling. Unlike traditional digital instruments that rely on static, pre-recorded audio samples that sound robotic and repetitive, AuraStrings synthesizes the physics of vibrating guitar strings in real time using the **Karplus-Strong string synthesis algorithm**.

Every pluck, pick, strum, and fret position simulates tension, string gauge, wave propagation, internal damping, and acoustic wood body resonances. The result is an organic, dynamic instrument that responds with authentic harmonic depth, sustain, and expressive tactile feedback.

---

## ⚡ Core Features & Interactive Capabilities

### 1. Interactive Strumming Engine & Pick Physics
- **Realistic Upstroke & Downstroke Emulation:** When dragging across the virtual soundhole, strings trigger with minute, natural time offsets (inter-onset intervals) that mimic the physics of a physical guitar pick passing over bronze wound strings.
- **Velocity-Sensitive Dynamics:** Strum velocity and cursor speed dynamically influence pluck hardness, high-frequency brightness, and initial attack amplitude.
- **Real-Time String Oscillation Animations:** Dynamic SVG/Canvas string rendering vibrates proportionally to note amplitude and pitch frequency, giving immediate visual feedback of string resonance.

### 2. Physical Karplus-Strong Synthesis Core
- **Short-Noise Burst Excitation:** Emulates the physical strike of a plectrum by injecting a randomized high-frequency burst into a recursive delay line.
- **Averaging Low-Pass Feedback Loop:** Simulates the internal friction and air resistance of vibrating steel/nylon strings, naturally attenuating high harmonics faster than fundamental frequencies.
- **Acoustic Body Impulse Convolver:** Routes synthesized string vibrations through resonant cabinet/soundboard filters to simulate the rich, woody low-end response of dreadnought acoustic guitars.

### 3. Fretboard & Chord Matrix
- **Full Standard Tuning (E2, A2, D3, G3, B3, E4):** 6 individually voiced strings calibrated with authentic fundamental frequencies and harmonic overtones.
- **One-Click Chord Voicing Banks:**
  - *Standard Open Chords:* C Major, G Major, D Major, E Minor, A Minor, F Major.
  - *Advanced Jazz & Blues Chords:* E7, A7, Dmaj7, Cadd9, Asus4.
  - *Custom Fretboard Fingering:* Click anywhere along the fretboard to place fingers, change fret stops, and hear custom voicings instantly.
- **Barre Chord Engine:** Simulates index-finger clamping across multiple frets with natural string dampening.

### 4. Studio Tone Profiles & Amplification
- **Pure Dreadnought Acoustic:** Bright, resonant steel string response with lush top-end sparkle and deep spruce-body resonance.
- **Warm Spanish Nylon:** Softer attack, rounded mids, and gentle harmonic decay modeling classical Spanish guitars.
- **Jangle 12-String Shimmer:** Octave doubling emulation generating rich chorused overtones and wide stereo width.
- **Overdriven Tube Electric:** Routed through a soft-clipping non-linear waveshaping distortion curve and low-pass speaker cabinet filter for gritty rock leads and crunchy rhythms.

---

## 🔬 Mathematical Modeling: Karplus-Strong Architecture

```
                  [Pluck Excitation Noise Buffer]
                                │
                                ▼
                       [Summing Node (+)] ◄─────────────┐
                                │                       │
                                ▼                       │
                    [Delay Line: L = Fs / f0]           │
                                │                       │
                                ▼                       │
                   [Low-Pass Filter: Damping]           │
                                │                       │
                                ▼                       │
                    [Feedback Attenuation: α] ──────────┘
                                │
                                ▼
                     [Body Resonance Filter]
                                │
                                ▼
                    [Master Stereo Output]
```

### The Physics Formula:
- **Delay Length ($L$):** Determined by the target frequency $f_0$ and audio sample rate $F_s$:
  $$L = \frac{F_s}{f_0}$$
- **Loop Filter:** Each sample $y[n]$ is computed by averaging adjacent samples to model natural string loss:
  $$y[n] = \alpha \cdot \frac{x[n] + x[n-1]}{2}$$
- **Decay Factor ($\alpha$):** Determines whether the string behaves like a muted nylon string ($\alpha \approx 0.96$) or a sustained steel string ($\alpha \approx 0.995$).

---

## 🎨 Design Language & Sensory Feedback

- **Warm Mahogany & Rosewood Aesthetic:** Dark walnut fretboard inlays, brass fret markers, pearloid position dots, and glowing metallic strings.
- **Tactile Strum Zone:** Smooth, frictionless cursor tracking across strings with subtle audio-haptic feedback.
- **Responsive Geometry:** Automatically scales across desktop ultra-wide monitors, tablets, and mobile devices while preserving authentic string spacing.
