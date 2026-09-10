# ⚡ Flagship Interactive Creative Suite

> **A Curated Quartet of Next-Gen Creative Web Experiences • 3D Physics WebGL Engine • Hardware-Grade DJ Performance Console • Mathematical Physical Guitar Synthesizer • Acoustic Grand Piano & Synthesia Academy**

---

## 🌐 Live Web Applications (Hosted on GitHub Pages)

Each flagship application has its own dedicated GitHub repository and is deployed live to **GitHub Pages**:

| Application | Live Demo URL | Dedicated Source Repository | Tech Stack | Status |
|:---|:---:|:---:|:---|:---:|
| 🧊 **CubiX 3D Rubik's Cube** | [**Launch Live App 🚀**](https://mickrathod.github.io/rubiks-cube-3d/) | [mickrathod/rubiks-cube-3d](https://github.com/mickrathod/rubiks-cube-3d) | Three.js, WebGL, Web Audio, WCA Timer | 🟢 **LIVE (200 OK)** |
| 🥁 **DrumCraft Studio** | [**Launch Live App 🚀**](https://mickrathod.github.io/drumcraft-studio/) | [mickrathod/drumcraft-studio](https://github.com/mickrathod/drumcraft-studio) | React 19, Physical Modeling, 16-Pad MPC | 🟢 **LIVE (200 OK)** |
| 🎹 **VirtuosoKeys Piano Pro** | [**Launch Live App 🚀**](https://mickrathod.github.io/virtuosokeys-piano/) | [mickrathod/virtuosokeys-piano](https://github.com/mickrathod/virtuosokeys-piano) | React 19, Steinway Harmonics, Synthesia Canvas | 🟢 **LIVE (200 OK)** |
| 🎸 **AuraStrings Guitar Pro** | [**Launch Live App 🚀**](https://mickrathod.github.io/aurastrings-guitar/) | [mickrathod/aurastrings-guitar](https://github.com/mickrathod/aurastrings-guitar) | React 19, Karplus-Strong DSP, Web Audio | 🟢 **LIVE (200 OK)** |
| 🎧 **PulseDeck Pro DJ** | [**Launch Live App 🚀**](https://mickrathod.github.io/pulsedeck-pro/) | [mickrathod/pulsedeck-pro](https://github.com/mickrathod/pulsedeck-pro) | React 19, Web Audio API, Canvas 60FPS | 🟢 **LIVE (200 OK)** |
| 🏎️ **ApexDrive 3D Driving** | [**Launch Live App 🚀**](https://mickrathod.github.io/apexdrive-3d/) | [mickrathod/apexdrive-3d](https://github.com/mickrathod/apexdrive-3d) | React 19, Three.js, Cannon-es, WebGL | 🟢 **LIVE (200 OK)** |

---

## 🗂️ Workspace Architecture

```
├── rubiks-cube-3d/                    # 🧊 CubiX 3D (Interactive Three.js Rubik's Cube & AI Solver)
├── drumcraft-studio/                  # 🥁 DrumCraft Studio (Physical Drum Modeling & 16-Pad MPC)
├── virtuosokeys-piano/               # 🎹 VirtuosoKeys Piano Pro (Steinway Synthesis & Harmony Academy)
├── online-guitar-react/               # 🎸 AuraStrings Guitar Pro (Physical Modeling Synthesizer)
├── dj-player-react/                   # 🎧 PulseDeck Pro DJ (Hardware-Grade Performance Console)
└── bruno-simon-3d-portfolio/          # 🏎️ ApexDrive 3D (Three.js + Cannon-es Physics Driving Game)
```

---

## 🚀 Flagship Project Highlights

### 1. 🎹 VirtuosoKeys Piano & Harmony Academy
* **Live App:** [https://mickrathod.github.io/virtuosokeys-piano/](https://mickrathod.github.io/virtuosokeys-piano/)
* **Repository:** [https://github.com/mickrathod/virtuosokeys-piano](https://github.com/mickrathod/virtuosokeys-piano)
* **Technologies:** React 19, Web Audio API (Harmonic Additive & Decay Modeling), HTML5 Canvas (60 FPS Synthesia Falling Notes), Web MIDI API, Vite
* **About:** Studio-grade virtual grand piano simulator featuring authentic ivory and ebony keys, Indian Sargam (`Sa, Re, Ga...`) and Western notation labels, falling note sheet music cascade, damper sustain pedal simulation, interactive song library (*Tum Hi Ho*, *Tum Mere Ho*, *Kal Ho Naa Ho*, *Interstellar*, *Für Elise*), and a 5-module structured Harmony Academy.

### 2. 🎸 AuraStrings Guitar Pro
* **Live App:** [https://mickrathod.github.io/aurastrings-guitar/](https://mickrathod.github.io/aurastrings-guitar/)
* **Repository:** [https://github.com/mickrathod/aurastrings-guitar](https://github.com/mickrathod/aurastrings-guitar)
* **Technologies:** React 19, Web Audio API, Mathematical Karplus-Strong DSP, Vite
* **About:** Studio-grade virtual guitar simulator featuring an interactive 12-fret playable neck, real-time chord fingering overlays, circular acoustic rosette soundhole strum pad, 60 FPS acoustic resonance spectrum visualizer, 4 tone profiles (Dreadnought, Classical, 12-String, Tube Amp), and 1-click jam progressions.

### 3. 🎧 PulseDeck Pro DJ
* **Live App:** [https://mickrathod.github.io/pulsedeck-pro/](https://mickrathod.github.io/pulsedeck-pro/)
* **Repository:** [https://github.com/mickrathod/pulsedeck-pro](https://github.com/mickrathod/pulsedeck-pro)
* **Technologies:** React 19, Web Audio API, HTML5 Canvas (60 FPS), Vite, Lucide Icons
* **About:** Hardware-grade browser DJ console modeled after Pioneer CDJ-3000 decks and DJM-900NXS2 mixers. Delivers real-time vinyl scratch physics on touch-sensitive platters, procedural dance track generators, 3-band isolator EQs with kill toggles, bipolar color sound filters, crossfader curve selection, an 8-pad performance sampler, and multi-band RGB dynamic waveforms.

### 4. 🏎️ ApexDrive 3D Driving
* **Live App:** [https://mickrathod.github.io/apexdrive-3d/](https://mickrathod.github.io/apexdrive-3d/)
* **Repository:** [https://github.com/mickrathod/apexdrive-3d](https://github.com/mickrathod/apexdrive-3d)
* **Technologies:** React 19, Three.js, Cannon-es 3D Physics, WebGL, Web Audio API, Vite
* **About:** An interactive 3D WebGL driving portfolio inspired by Bruno Simon. Features real-time vehicle suspension, tire friction, drift mechanics, collectible stars, interactive project monuments, dynamic camera modes (Chase Cam, Top-Down, Cinematic Orbit), day/night lighting cycles, procedural engine rev audio synthesis, and a live GPS radar HUD.

---

## 💎 Design Philosophy & Core Principles

- **Zero Unnecessary Dependencies:** Pure, native implementations where possible (Web Audio API instead of heavy audio engines, Cannon-es physics, CSS hardware acceleration).
- **Tactile & Responsive Feedback:** Real-time feedback in every application—from audio synthesis and physics simulation to instant chord updates and visual confirmation animations.
