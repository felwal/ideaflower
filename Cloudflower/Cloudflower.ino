#include <FlowSensor.h>; // https://github.com/hafidhh/FlowSensor-Arduino

const int PIN_IN_FLOW = 2;

const bool DEBUG = true;

FlowSensor Sensor(700, PIN_IN_FLOW);

//

void setup() {
  Serial.begin(9600);

  Sensor.begin(count);
  pinMode(PIN_OUT_LED, OUTPUT);
}

void loop() {
  Sensor.read();
  int pulse = Sensor.getPulse();
  float volume = Sensor.getVolume();
  d("pulse: " + String(pulse) + "; volume: " + String(volume) + " L");
}

void count()
{
  Sensor.count();
}

//

void d(String s) {
  if (DEBUG) {
    Serial.println("D: " + s);
  }
}
