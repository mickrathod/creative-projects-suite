/*
  Smart Plant Watering System (Arduino, low-cost build)
  =======================================================
  Automatically waters a plant when the soil gets too dry, using
  the cheapest common parts: a soil moisture sensor + a small 5V
  water pump (or 5V solenoid valve) switched through a relay.

  Also includes a manual "water now" push button for on-demand use.

  Approx. parts cost (very budget-friendly):
    - Arduino Uno/Nano (often already owned)          ~$3-6 (clone)
    - Soil moisture sensor (resistive, 2-prong)        ~$1
    - 1-channel 5V relay module                        ~$1-2
    - Small 5V submersible/mini water pump             ~$2-4
    - Push button + silicone tubing + wires            ~$1
    - 5V power source for the pump (USB power bank works)

  Hardware:
    - Soil moisture sensor AO -> A0
    - Manual water button     -> D3 (with INPUT_PULLUP, button to GND)
    - Relay IN                -> D7  (relay switches the pump's power)
    - Status LED (optional)   -> D13 (built-in LED on most boards)

  Wiring notes:
    - Soil sensor: VCC->5V, GND->GND, AO->A0
    - Push button: one leg -> D3, other leg -> GND (uses internal pullup,
      no external resistor needed)
    - Relay module: VCC->5V, GND->GND, IN->D7
      Relay COM/NO wired in series with the pump's positive power line
      (pump powered from its own 5V supply, NOT from the Arduino's 5V pin,
      to avoid drawing too much current through the board)
    - Most cheap relay boards are ACTIVE-LOW (LOW = relay energized) -
      set RELAY_ACTIVE_LOW below to match your board.

  How it decides to water:
    - Reads soil moisture every loop.
    - If moisture reading indicates "dry" (above DRY_THRESHOLD - resistive
      sensors read HIGHER when drier) for a sustained period, it runs the
      pump for WATER_DURATION_MS, then waits COOLDOWN_MS before checking
      again - this prevents overwatering from a single noisy reading and
      stops the pump from running continuously if the sensor stays dry
      right after watering (soil takes time to absorb water).
    - Manual button always triggers a single watering pulse immediately,
      regardless of moisture reading (e.g. for repotting, fertilizing).
*/

const int SOIL_PIN = A0;       // Soil moisture sensor analog input
const int BUTTON_PIN = 3;      // Manual "water now" button
const int RELAY_PIN = 7;       // Relay controlling the pump
const int STATUS_LED = 13;     // Built-in LED, blinks while watering

const int DRY_THRESHOLD = 600;         // Higher = drier for most resistive sensors. Tune with Serial Monitor.
const unsigned long WATER_DURATION_MS = 3000;   // How long the pump runs per watering cycle
const unsigned long COOLDOWN_MS = 60UL * 60UL * 1000UL; // 1 hour minimum between auto-waterings
const unsigned long CHECK_INTERVAL_MS = 5000;   // How often to check soil moisture

const bool RELAY_ACTIVE_LOW = true;

unsigned long lastCheckTime = 0;
unsigned long lastWateredTime = 0;
bool hasWateredOnce = false;

void setPump(bool on) {
  if (RELAY_ACTIVE_LOW) {
    digitalWrite(RELAY_PIN, on ? LOW : HIGH);
  } else {
    digitalWrite(RELAY_PIN, on ? HIGH : LOW);
  }
  digitalWrite(STATUS_LED, on ? HIGH : LOW);
}

void runWateringCycle(const char* reason) {
  Serial.print("Watering now (");
  Serial.print(reason);
  Serial.println(")...");
  setPump(true);
  delay(WATER_DURATION_MS);
  setPump(false);
  lastWateredTime = millis();
  hasWateredOnce = true;
  Serial.println("Done watering.");
}

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(STATUS_LED, OUTPUT);
  setPump(false);

  Serial.begin(9600);
  Serial.println("Smart Plant Watering System booting...");
}

void loop() {
  unsigned long now = millis();

  // Manual override button (active LOW due to INPUT_PULLUP)
  if (digitalRead(BUTTON_PIN) == LOW) {
    runWateringCycle("manual button");
    delay(500); // simple debounce so one press doesn't trigger repeatedly
  }

  // Automatic moisture-based watering
  if (now - lastCheckTime >= CHECK_INTERVAL_MS) {
    lastCheckTime = now;

    int moisture = analogRead(SOIL_PIN);
    bool isDry = moisture > DRY_THRESHOLD;
    bool cooldownElapsed = !hasWateredOnce || (now - lastWateredTime >= COOLDOWN_MS);

    Serial.print("Soil reading: ");
    Serial.print(moisture);
    Serial.print(" | Dry: ");
    Serial.print(isDry ? "Y" : "N");
    Serial.print(" | Cooldown elapsed: ");
    Serial.println(cooldownElapsed ? "Y" : "N");

    if (isDry && cooldownElapsed) {
      runWateringCycle("soil dry");
    }
  }
}
