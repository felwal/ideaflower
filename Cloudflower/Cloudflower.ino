#include <FlowSensor.h>; // https://github.com/hafidhh/FlowSensor-Arduino

const int PIN_IN_FLOW = 2;
const int PIN_OUT_LED_1 = 4;
const int PIN_OUT_LED_2 = 5;
const int PIN_OUT_LED_3 = 6;

const float VOLUME_THRESHOLD = 0.5;
const bool DEBUG = true;

FlowSensor flowSensor(700, PIN_IN_FLOW);

//

void setup() {
  Serial.begin(9600);

  flowSensor.begin(onFlowCount);
  pinMode(PIN_OUT_LED_1, OUTPUT);
  pinMode(PIN_OUT_LED_2, OUTPUT);
  pinMode(PIN_OUT_LED_3, OUTPUT);
}

void loop() {
  flowSensor.read();
  int pulse = flowSensor.getPulse();
  float volume = flowSensor.getVolume();
  d("pulse: " + String(pulse) + "; volume: " + String(volume) + " L");

  writeLights(volume);

  if (volume >= VOLUME_THRESHOLD) {
    //flowSensor.resetVolume();
    d("threshold reached");
  }

  delay(500);
}

void onFlowCount() {
  flowSensor.count();
  d("flow detected");
}

void writeLights(float volume) {
  float volumeProgress = volume / VOLUME_THRESHOLD;

  if (volumeProgress < 0.33) {
    digitalWrite(PIN_OUT_LED_1, LOW);
    digitalWrite(PIN_OUT_LED_2, LOW);
    digitalWrite(PIN_OUT_LED_3, LOW);
  }
  else if (volumeProgress < 0.66) {
    digitalWrite(PIN_OUT_LED_1, HIGH);
    digitalWrite(PIN_OUT_LED_2, LOW);
    digitalWrite(PIN_OUT_LED_3, LOW);
  }
  else if (volumeProgress < 1.0) {
    digitalWrite(PIN_OUT_LED_1, HIGH);
    digitalWrite(PIN_OUT_LED_2, HIGH);
    digitalWrite(PIN_OUT_LED_3, LOW);
  }
  else {
    digitalWrite(PIN_OUT_LED_1, HIGH);
    digitalWrite(PIN_OUT_LED_2, HIGH);
    digitalWrite(PIN_OUT_LED_3, HIGH);
  }
}

//

void d(String s) {
  if (DEBUG) {
    Serial.println("D: " + s);
  }
}
