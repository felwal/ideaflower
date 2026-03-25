#include "wifiSecrets.h"
#include "firebaseSecrets.h"
#include <SPI.h>
#include <WiFiNINA.h>
#include <FlowSensor.h>
#include <Firebase.h>
#include <ArduinoJson.h>

const int PIN_IN_FLOW = 2; // must be D2

const int PULSE_PER_LITER = 600; // approximate value from testing
const int AWAIT_WIFI = 500;
const int AWAIT_WATER = 800; // must be shorter than AWAIT_IDLE
const int AWAIT_IDLE = 1000;
const float VOLUME_FULL_LITER = 0.05; // 50 ml per avg response with GPT3

bool flowDetected = false;
int flowDetectedMillis = 0;
float volumeProgress = 0;

FlowSensor flow(PULSE_PER_LITER, PIN_IN_FLOW);
Firebase firebase(FIREBASE_URL, FIREBASE_AUTH);

//

void setup() {
  Serial.begin(9600);
  Serial.println("\n\n--- NEW RUN ---");

  flow.begin(onFlowCount, false); // false = use internal pull-up resistor
  connectWifi();
  connectFirebase();
}

void loop() {
  if (flowDetected) {
    readFlow();
    writeFirebase();
  }
  else {
    Serial.print(".");
    delay(AWAIT_WATER);
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
    delay(AWAIT_WIFI);
  }

  Serial.println(" ✓");
}

void connectFirebase() {
  // check that it connects successfully
  getFirebaseJson("flowModel/common");
}

void writeFirebase() {
  int idleDuration = millis() - flowDetectedMillis;

  if (idleDuration >= AWAIT_IDLE) {
    // only send to Firebase when watering has stopped
    // – since waiting for connection pauses sensor reading

    Serial.println();
    flowDetected = false;

    JsonDocument commonOld = getFirebaseJson("flowModel/common");
    int wateringCountCloud = commonOld["wateringCount"];
    float volumeProgressCloud = commonOld["waterProgress"];

    if (volumeProgressCloud < 1) {
      JsonDocument commonNew;
      commonNew["wateringCount"] = wateringCountCloud + 1;
      commonNew["waterProgress"] = volumeProgressCloud + volumeProgress;
      setFirebaseJson("flowModel/common", commonNew);
    }

    volumeProgress = 0;
    flow.resetVolume();
    flow.resetPulse();
  }
}

JsonDocument getFirebaseJson(String key) {
  Serial.print("get " + key + " ... ");

  String retrievedString;
  int responseCode = firebase.getJson(key, retrievedString);
  handleFirebaseError(responseCode);

  JsonDocument retrievedJson;
  DeserializationError error = deserializeJson(retrievedJson, retrievedString);
  handleJsonError(error);

  Serial.println(retrievedString);
  return retrievedJson;
}

void setFirebaseJson(String key, JsonDocument val) {
  Serial.print("set " + key + " ... ");

  val.shrinkToFit();
  String valString;
  serializeJson(val, valString);

  int responseCode = firebase.setJson(key, valString);
  handleFirebaseError(responseCode);

  Serial.println(valString);
}

void handleFirebaseError(int responseCode) {
  if (responseCode != 200) {
    Serial.println("Firebase get/set failed: " + String(responseCode));
  }
}

void handleJsonError(DeserializationError error) {
  if (error) {
    Serial.println("Json deserialization failed: " + String(error.c_str()));
  }
}

// sensor

void readFlow() {
  flow.read();
  float volume = flow.getVolume();
  volumeProgress = volume / VOLUME_FULL_LITER;

  // for PULSE_PER_LITER calibration
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
