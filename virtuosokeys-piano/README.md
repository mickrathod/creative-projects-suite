# VirtuosoKeys Pro • Virtual Grand Piano & Song Academy

VirtuosoKeys Pro is an ultra-high-fidelity virtual acoustic grand piano simulator and interactive harmony academy built for musicians, producers, and students. Combining physical string inharmonicity synthesis, damper pedal modeling, Synthesia-style falling notes visualization, and Web MIDI hardware support, VirtuosoKeys bridges classical concert performance with modern digital music pedagogy.

---

## 🌟 Product Vision & Architecture

Traditional digital pianos rely on gigabytes of pre-recorded sample libraries that suffer from static velocity switching and unnatural phase cancellation. VirtuosoKeys models the acoustic physics of a 9-foot concert grand piano directly inside the browser using real-time Web Audio additive synthesis and physical resonance filters:

- **String Stiffness Inharmonicity**: Models acoustic piano string dispersion ($f_k = k f_0 \sqrt{1 + B k^2}$) across all 88 keys from A0 to C8, reproducing the characteristic metallic acoustic ring of low bass strings and the crystalline chime of high treble dampers.
- **Physical Hammer Strike Modeling**: Generates velocity-sensitive micro-second noise transients passed through pitch-tracked resonant bandpass filters to simulate felt hammer impacts against steel strings.
- **Soundboard Acoustic Coupling**: Dual-stage peaking filters at 240Hz and 4500Hz emulate the vibrational warmth and air resonance of a solid spruce soundboard.
- **Concert Hall Convolver Reverb**: Synthetic impulse convolution simulating acoustic diffusion across a 2,500-seat symphony auditorium.
- **Hardware Web MIDI API**: Plug-and-play support for any physical USB MIDI keyboard (Yamaha, Roland, Casio, Korg, Akai, Arturia) with zero-latency note-on, note-off, and continuous sustain pedal detection.

---

## 🎼 Synthesia Falling Notes Engine

The built-in 60 FPS HTML5 Canvas engine projects rolling melodic tiles cascading down towards the keyboard strike line in synchronization with multi-hand musical scores:
- **Color-Coded Hand Separation**: Golden-amber tiles for right-hand lead melodies and electric-cyan tiles for left-hand bass harmony arpeggios.
- **Interactive Repertoire**: Full multi-hand song scores for:
  - *Tum Hi Ho* (Aashiqui 2 / Arijit Singh) — Iconic piano opening motif and emotional vocal verse.
  - *Tum Mere Ho* (Anuv Jain) — Indie acoustic piano arrangement with real-time synchronized Hindi lyrics.
  - *Kal Ho Naa Ho* (Theme) — Uplifting romantic melodic structure.
  - *First Step* (Interstellar / Hans Zimmer) — Atmospheric minimalist crescendo.
  - *Für Elise* (Beethoven) — Essential classical milestone.
- **Practice Modes**: Adjustable tempo speeds (0.6x, 0.8x, 1.0x, 1.2x) and wait-for-key interactive scoring.

---

## 🎓 Piano & Harmony Academy Curriculum

VirtuosoKeys incorporates an interactive learning studio covering fundamental to intermediate music theory:
1. **Lesson 1: Anatomy & Finding Middle C**: Navigating the twin 2-black and 3-black key clusters, Western note letters (C-D-E-F-G-A-B), and Indian classical Sargam (Sa-Re-Ga-Ma-Pa-Dha-Ni).
2. **Lesson 2: The 5 Essential Chords**: Triad mechanics for C Major, G Major, A Minor, F Major, and E Minor with ergonomic finger numbering (`1=Thumb`, `3=Middle`, `5=Pinky`).
3. **Lesson 3: The 4-Chord Hit Pop Formula**: Deconstructing the universal `I - V - vi - IV` progression powering global chart-toppers.
4. **Lesson 4: Left-Hand Rolling Arpeggios**: Techniques to accompany melodies using root-fifth-octave rolls.
5. **Lesson 5: Interactive Pitch & Ear Training**: Gamified ear-training quizzes testing auditory note memory.

---

## 🎛️ Acoustic Presets & Controls

- **Concert Grand**: Full-bodied, warm, resonant Steinway soundboard character.
- **Bright Pop Studio**: Cutting treble presence tailored for modern radio production.
- **Rhodes Vintage EPiano**: Bell-like FM tine synthesis with mellow warmth.
- **Ambient Shimmer**: Extended ethereal decay and lush reverberant trails.
- **Damper Sustain Pedal**: True continuous sustain modeling holding string vibrations until release.
- **Real-Time Soundboard Spectrum**: 60 FPS FFT frequency analyzer visualizing harmonic overtone decay.
