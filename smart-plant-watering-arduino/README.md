# 🌱 FloraPulse — Autonomous Soil Moisture & Precision Irrigation Firmware

> **Embedded Botanical Automation • Hygrometric Soil Sensing • Anti-Overwatering Cooldown Dynamics • Failsafe Submersible Relay Control**

---

## 🌿 Vision & Engineering Overview

**FloraPulse** is an embedded botanical preservation system and precision irrigation controller engineered for domestic houseplants, vertical herb gardens, and precision greenhouse cultivation.

A primary cause of houseplant mortality is improper hydration—either prolonged drought or fatal root rot caused by frequent, impatient overwatering. When dry soil is watered, water requires several minutes to percolate downward and be absorbed by the root zone. Standard automated timers that continue pumping until the sensor detects moisture inevitably drown plants and overflow containers.

FloraPulse solves this botanical challenge through **Pulsed Hydration & Absorption Cooldown Dynamics**:
1. It monitors analog volumetric soil moisture continuously.
2. When dry soil is detected, it energizes a micro-submersible pump for a calibrated, measured pulse (e.g. 3 seconds).
3. It immediately enforces a hardware lockout cooldown window (e.g. 1 hour) before any further automated irrigation can occur, allowing the root substrate to absorb the moisture evenly.

---

## 🔬 Hardware Architecture & Component Matrix

### 1. Embedded Microcontroller (MCU)
- **Controller Core:** ATmega328P architecture (Arduino Uno / Nano / Pro Mini compatible).
- **ADC Sampling Pipeline:** 10-bit analog conversion translating soil resistance into calibrated moisture values ($0 \dots 1023$).

### 2. Sensor Instrumentation & Actuation
- **Hygrometric Soil Moisture Probe:** Dual-prong resistive/capacitive sensor probe inserted into the root ball measuring soil conductivity.
- **5V Opto-Isolated Relay Node:** Switches the low-voltage DC circuit powering the submersible water pump.
- **Submersible DC Water Pump & Silicone Tubing:** Compact 5V centrifugal micro-pump delivering steady, low-pressure hydration directly to plant soil.
- **Manual Override Tactile Button:** Hardware-debounced push button allowing immediate manual priming or watering on demand, bypassing cooldown locks.

---

## ⚡ Firmware State Machine & Hydration Dynamics

```
                         [System Boot & Initialization]
                                       │
                                       ▼
                   ┌──────────► [MONITOR STATE] ◄──────────┐
                   │                   │                   │
                   │           Sample Soil Moisture        │
                   │             (Every 5 Seconds)         │
                   │                   │                   │
                   │          Manual Button Pressed?       │
                   │          ├── YES ─────────────┐       │
                   │          │                    │       │
                   │          NO                   ▼       │
                   │          │           [WATERING CYCLE] │
                   │    Soil Moisture < Dry?      - Run Pump (3s)  │
                   │    (AND) Cooldown Expired?   - LED Pulse Alert│
                   │          ├── YES ─────────────┤       │
                   │          │                    │       │
                   │          NO                   ▼       │
                   │          │          [ABSORPTION COOLDOWN]
                   │          │          - Lock Auto Pump (1h)
                   │          │          - Allow Water Soak
                   │          │                    │
                   └──────────┴────────────────────┘
```

### Key Engineering Safeguards
- **Percolation Delay Protection:** Enforces a minimum 1-hour absorption cooldown between automatic watering cycles, preventing fatal root hypoxia and water reservoir depletion.
- **Galvanic Power Isolation:** Dual-rail electrical isolation keeping high-draw pump induction noise and transient voltage spikes separate from MCU logic rails.
- **Analog Threshold Calibration:** Programmable hysteresis band separating dry, nominal, and saturated soil zones.
- **Manual Prime Override:** Allows immediate top-ups and tubing air purging without disrupting automated scheduling timers.

---

## 🌻 Botanical & Ecological Impact

- **Zero Water Waste:** Targeted root-level micro-dosing eliminates surface evaporation and messy tray overflows.
- **Travel Independence:** Keeps prized tropicals, bonsai, and delicate ferns thriving autonomously during extended homeowner travel or vacations.
- **Root Health Optimization:** Promotes deep root growth by avoiding superficial surface wetting.
