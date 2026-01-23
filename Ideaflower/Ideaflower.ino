#include "wifiSecrets.h"
#include "firebaseSecrets.h"
#include <SPI.h>
#include <WiFiNINA.h>
#include <FlowSensor.h>
#include <Firebase.h>

const int PIN_IN_FLOW = 2;
const int PIN_OUT_LED = 4;

const int PULSE_PER_LITER = 700; // approximate value from testing
const int DELAY_WATERING = 500;
const int DELAY_IDLE = 1000;
const int DELAY_FULL = 2000;
const bool DEBUG = true;

float volumeProgress = 0;
float volumeFullLiter = 0.5; // will be set via Firebase

FlowSensor flow(PULSE_PER_LITER, PIN_IN_FLOW);
Firebase firebase(FIREBASE_URL, FIREBASE_AUTH);

//

void setup() {
  Serial.begin(9600);
  Serial.println("\n--- NEW RUN ---");

  flow.begin(onFlowCount);
  pinMode(PIN_OUT_LED, OUTPUT);

  connectWifi();
  connectFirebase();
}

void loop() {
  if (volumeProgress < 1) {
    // only measure flow if not already fully watered
    // TODO: contintue to accumulate, if user has multiple ungrown seeds?
    readFlow();
    delay(DELAY_WATERING); // TODO: shorter delay if watered recently, otherwise longer
  }
  else {
    // wait for water progress to be resetted via Firebase / web interface
    float waterProgressInFirebase = getFirebaseFloat("flowModel/waterProgress");

    if (waterProgressInFirebase == 0) {
      digitalWrite(PIN_OUT_LED, LOW);
      flow.resetVolume();
      volumeProgress = 0;
      delay(DELAY_IDLE);
    }
    else {
      // waiting for user to be active on the web interface
      delay(DELAY_FULL);
    }
  }
}

// connectivity

void connectWifi() {
  WiFi.disconnect();
  delay(1000);

  Serial.print("connecting to wifi " + String(WIFI_SSID) + " ...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println(" success");
}

void connectFirebase() {
  Serial.print("connecting to Firebase " + String(FIREBASE_URL) + " ...");
  volumeFullLiter = getFirebaseFloat("flowModel/WATER_FULL_LITER");
}

float getFirebaseFloat(String key) {
  float retrievedFloat;
  int responseCode = firebase.getFloat(key, retrievedFloat);
  handleFirebaseError(responseCode);
  return retrievedFloat;
}

void setFirebaseFloat(String key, float val) {
  int responseCode = firebase.setFloat(key, val);
  handleFirebaseError(responseCode);
}

void handleFirebaseError(responseCode) {
  if (responseCode != 200) {
    Serial.print("Firebase get/set failed with code ");
    Serial.println(responseCode);
  }
}

// sensors

void readFlow() {
  flow.read();
  float volume = flow.getVolume();
  //int pulse = flow.getPulse();
  //Serial.println("pulse: " + String(pulse) + "; volume: " + String(volume) + " L");

  volumeProgress = volume / volumeFullLiter;
  setFirebaseFloat("flowModel/waterProgress", volumeProgress);

  if (volumeProgress >= 1) {
    Serial.println("fully watered");
    digitalWrite(PIN_OUT_LED, HIGH);
  }
}

void onFlowCount() {
  flow.count();
  Serial.println("flow detected");
}
