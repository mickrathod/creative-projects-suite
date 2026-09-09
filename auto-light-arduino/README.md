# 💡 LuminaSmart — Dual-Condition Ambient Motion Lighting Controller

> **Embedded IoT Firmware • Dual-Sensor Conditional Logic • Energy Conservation Hardware • Real-Time Hysteresis Control**

---

## 🌟 Vision & Engineering Overview

**LuminaSmart** is an embedded automation controller designed for energy-efficient architectural, stairwell, and security lighting. 

Conventional motion-activated lights suffer from two major inefficiencies: they turn on redundantly during broad daylight when illumination is unnecessary, or they flutter erratically when light levels hover near the threshold. 

LuminaSmart solves this by implementing a hardware-level **Dual-Condition Logical AND Gate** coupled with software hysteresis:
$$\text{Light Output} = \text{Ambient Darkness}(\text{LDR}) \land \text{Human Motion}(\text{PIR})$$

The system energizes the lighting circuit only when the ambient lux drops below a programmable threshold **and** active human presence is detected. The controller keeps the light illuminated for a programmable duration after the last detected motion, auto-extinguishing when vacancy is confirmed or when daylight naturally returns.

---

## 🔬 Hardware Architecture & Component Matrix

### 1. Embedded Microcontroller (MCU) Core
- **Microcontroller:** ATmega328P architecture (compatible with Arduino Uno, Nano, Pro Mini, and custom ATmega bare-metal designs).
- **5V Low-Power Logic:** Optimized for low quiescent current draw during standby monitoring cycles.

### 2. Sensor Instrumentation & Control Nodes
- **Cadmium Sulfide (CdS) Photoresistor / LDR Module:** Analog voltage divider feeding an ADC pin, measuring ambient illumination continuously across a 10-bit resolution range ($0 \dots 1023$).
- **HC-SR501 Pyroelectric Passive Infrared (PIR) Sensor:** Dual-element infrared sensor with a Fresnel lens detecting radiant thermal signatures emitted by human bodies across a $120^\circ$ cone up to 7 meters.
- **Optically Isolated Solid-State / Electromechanical Relay:** Galvanically isolated 5V active-low relay switching high-voltage AC (110V/220V) or low-voltage DC (12V/24V) architectural LED fixtures.

---

## ⚡ Firmware State Machine & Logic Architecture

```
                          [System Initialization]
                                     │
                                     ▼
                        [PIR Stabilization Window]
                         (30-60s Sensor Warm-up)
                                     │
                                     ▼
     ┌───────────────────────► [MONITOR STATE] ◄──────────────────────┐
     │                               │                                │
     │                      Is Ambient Light < Dark?                  │
     │                      (AND) Is Motion Detected?                 │
     │                               │                                │
     │                      NO ──────┴────── YES                      │
     │                      │                 │                       │
     │                      │                 ▼                       │
     │                      │         [ENERGIZED STATE]               │
     │                      │         - Relay Triggered Active        │
     │                      │         - Start Expiration Timer        │
     │                      │                 │                       │
     │                      │     Motion Detected Again?              │
     │                      │     - YES: Reset Expiration Timer       │
     │                      │                 │                       │
     │                      │     Timer Expired OR Daylight Returns?  │
     │                      │     - YES: De-energize Relay            │
     │                      │                 │                       │
     └──────────────────────┴─────────────────┴───────────────────────┘
```

### Key Engineering Capabilities
- **Hysteresis Filtering:** Prevents high-frequency switching oscillations (relay chattering) when ambient light levels hover near the darkness threshold.
- **Warm-Up Guard Window:** Ignores unstable PIR sensor logic during the initial thermal stabilization period following power-on.
- **Retriggerable Persistence Timer:** Automatically resets the countdown timer each time movement is registered, ensuring the light never abruptly cuts out while a room is occupied.
- **Active-Low & Active-High Configuration:** Software-switchable relay polarity matching both standard optocoupler relay modules and direct transistor drivers.

---

## 🏢 Practical Applications & Energy ROI

- **Commercial Stairwells & Hallways:** Cutting commercial building lighting energy consumption by up to 65% by ensuring lights only fire when staff or visitors traverse corridors in the dark.
- **Outdoor Perimeter & Pathway Lighting:** Illuminating walkways, porches, and garden gates upon approach without keeping bright lights burning all night.
- **Storage Rooms & Garages:** Hands-free illumination for utility closets and workshops where visitors enter with full hands.
