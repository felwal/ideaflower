#include "wifiSecrets.h"
#include "firebaseSecrets.h"
#include <SPI.h>
#include <WiFiNINA.h>
#include <FlowSensor.h>
#include <Firebase.h>

const int PIN_IN_FLOW = 2; // must be D2

const int PULSE_PER_LITER = 700; // approximate value from testing
const int AWAIT_WATER = 1000;
const int AWAIT_IDLE = 1500;
const int AWAIT_FIREBASE = 10000; // TODO: longer for home study, shorter for user study
float VOLUME_FULL_LITER = 0.05; // will be set via Firebase on startup

bool firebaseSynced = true;
bool flowDetected = false;
int flowDetectedMillis = 0;
float volumeProgress = 0; // -1 for "no ideas to water"
float volumeProgressStart = 0;

FlowSensor flow(PULSE_PER_LITER, PIN_IN_FLOW);
Firebase firebase(FIREBASE_URL, FIREBASE_AUTH);

//

void setup() {
  Serial.begin(9600);
  Serial.println("\n\n--- NEW RUN ---");

  flow.begin(onFlowCount, false); // use internal pull-up resistor

  connectWifi();
  connectFirebase();
}

void loop() {
  if (volumeProgress >= 0 && (volumeProgress < 1 || !firebaseSynced)) {
    // only measure flow if not already fully watered
    // TODO: contintue to accumulate, if user has multiple ungrown seeds?
    readFlow();
    writeFirebase();

    if (!flowDetected) {
      Serial.print(".");
      delay(AWAIT_WATER);
    }
  }
  else if (volumeProgress < 0 || firebaseSynced) {
    // wait for water progress to be resetted via Firebase / web interface
    // – should only happen when progress >1
    float volumeProgressInFirebase = getFirebaseFloat("flowModel/waterProgress");

    if (volumeProgressInFirebase != volumeProgress) {
      volumeProgressStart = volumeProgressInFirebase;
      volumeProgress = volumeProgressInFirebase;

      flow.resetVolume();
      flow.resetPulse();
    }
    else {
      Serial.print("…");
      delay(AWAIT_FIREBASE);
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

  Serial.println(" ✓");
}

void connectFirebase() {
  VOLUME_FULL_LITER = getFirebaseFloat("flowModel/WATER_FULL_LITER");
  volumeProgressStart = getFirebaseFloat("flowModel/waterProgress");
  volumeProgress = volumeProgressStart;
}

void writeFirebase() {
  int idleDuration = millis() - flowDetectedMillis;

  if (flowDetected && idleDuration >= AWAIT_IDLE) {
    // only send to Firebase when watering has stopped
    Serial.println();

    flowDetected = false;
    firebaseSynced = true;
    setFirebaseFloat("flowModel/waterProgress", volumeProgress);
  }
}

float getFirebaseFloat(String key) {
  Serial.print("get " + key + " ... ");

  float retrievedFloat;
  int responseCode = firebase.getFloat(key, retrievedFloat);
  handleFirebaseError(responseCode);

  Serial.println(retrievedFloat);
  return retrievedFloat;
}

void setFirebaseFloat(String key, float val) {
  Serial.print("set " + key + " ... ");

  int responseCode = firebase.setFloat(key, val);
  handleFirebaseError(responseCode);

  Serial.println(val);
}

void handleFirebaseError(int responseCode) {
  if (responseCode != 200) {
    Serial.println("Firebase get/set failed with code " + String(responseCode));
  }
}

// sensors

void readFlow() {
  flow.read();
  float volume = flow.getVolume();
  volumeProgress = volumeProgressStart + volume / VOLUME_FULL_LITER;
  firebaseSynced = false;

  // for callibration
  //int pulse = flow.getPulse();
  //Serial.println("pulse: " + String(pulse) + "; volume: " + String(volume) + " L; progress: " + String(volumeProgress));
}

void onFlowCount() {
  if (!flowDetected) {
    Serial.println();
  }

  flow.count();
  flowDetected = true;
  flowDetectedMillis = millis();

  Serial.print("~");
}
