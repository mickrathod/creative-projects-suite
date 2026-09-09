/*
  Automatic Light ON/OFF using Arduino (LDR + PIR + Relay)
  =========================================================
  Turns a light ON only when BOTH conditions are true:
    1. It is dark enough (LDR reading below DARK_THRESHOLD)
    2. Motion is detected (PIR output HIGH)

  Once triggered, the light stays ON for ON_DURATION_MS after
  the last motion detected, then switches OFF automatically
  (even if it's still dark, to save power / avoid always-on).

  Hardware:
    - LDR module (digital or analog) -> A0
    - PIR motion sensor (HC-SR501)     -> D2
    - Relay module IN pin              -> D7
    - Relay COM/NO wired to the bulb's live line (mains bulb)
      OR to a 12V bulb + external supply if using a 12V relay board.

  Wiring notes:
    - LDR analog module: VCC->5V, GND->GND, AO->A0
    - PIR HC-SR501: VCC->5V, GND->GND, OUT->D2
      (turn the PIR's sensitivity/delay trimmers fully
      counter-clockwise for shortest retrigger delay during testing)
    - Relay module: VCC->5V, GND->GND, IN->D7
      Most cheap relay boards are ACTIVE-LOW (LOW = relay energized).
      Set RELAY_ACTIVE_LOW below to match your board.

  SAFETY: If switching mains (110V/220V) through the relay, all
  mains-side wiring must be done by someone qualified, with the
  relay board's mains side fully insulated. This sketch only
  handles the low-voltage logic side.
*/

const int LDR_PIN = A0;      // LDR analog input
const int PIR_PIN = 2;       // PIR digital input
const int RELAY_PIN = 7;     // Relay control output

const int DARK_THRESHOLD = 400;      // Lower = darker (0-1023). Tune to your LDR/module.
const unsigned long ON_DURATION_MS = 30000;   // Stay on 30s after last motion
const unsigned long PIR_WARMUP_MS  = 30000;   // PIR needs ~30-60s to stabilize after power-on

const bool RELAY_ACTIVE_LOW = true;  // true for most common relay modules

unsigned long lastMotionTime = 0;
unsigned long bootTime = 0;
bool lightOn = false;

void setRelay(bool on) {
  if (RELAY_ACTIVE_LOW) {
    digitalWrite(RELAY_PIN, on ? LOW : HIGH);
  } else {
    digitalWrite(RELAY_PIN, on ? HIGH : LOW);
  }
}

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  setRelay(false);

  Serial.begin(9600);
  bootTime = millis();
  Serial.println("Auto Light System booting...");
  Serial.println("Waiting for PIR to stabilize...");
}

void loop() {
  unsigned long now = millis();
  bool pirWarmedUp = (now - bootTime) > PIR_WARMUP_MS;

  int lightLevel = analogRead(LDR_PIN);
  bool isDark = lightLevel < DARK_THRESHOLD;
  bool motionDetected = pirWarmedUp && digitalRead(PIR_PIN) == HIGH;

  if (motionDetected && isDark) {
    lastMotionTime = now;
    if (!lightOn) {
      lightOn = true;
      setRelay(true);
      Serial.println("Motion + Dark -> Light ON");
    }
  }

  if (lightOn && (now - lastMotionTime > ON_DURATION_MS)) {
    lightOn = false;
    setRelay(false);
    Serial.println("Timeout -> Light OFF");
  }

  // If it becomes bright while the light is on, turn it off immediately
  if (lightOn && !isDark) {
    lightOn = false;
    setRelay(false);
    Serial.println("Daylight detected -> Light OFF");
  }

  Serial.print("LDR: ");
  Serial.print(lightLevel);
  Serial.print(" | Dark: ");
  Serial.print(isDark ? "Y" : "N");
  Serial.print(" | PIR: ");
  Serial.print(motionDetected ? "Y" : (pirWarmedUp ? "N" : "warming up"));
  Serial.print(" | Light: ");
  Serial.println(lightOn ? "ON" : "OFF");

  delay(200);
}
