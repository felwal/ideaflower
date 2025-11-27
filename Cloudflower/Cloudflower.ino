#include "wifiSecrets.h";
#include "firebaseSecrets.h";
#include <SPI.h>;
#include <WiFiNINA.h>;
#include <FlowSensor.h>;

const int PIN_IN_FLOW = 2;
const int PIN_OUT_LED_1 = 4;
const int PIN_OUT_LED_2 = 5;
const int PIN_OUT_LED_3 = 6;

const float VOLUME_THRESHOLD = 0.5;
const bool DEBUG = true;

FlowSensor flowSensor(700, PIN_IN_FLOW);
WiFiSSLClient client;

//

void setup() {
  Serial.begin(9600);
  Serial.println("\n--- NEW RUN ---");

  flowSensor.begin(onFlowCount);
  pinMode(PIN_OUT_LED_1, OUTPUT);
  pinMode(PIN_OUT_LED_2, OUTPUT);
  pinMode(PIN_OUT_LED_3, OUTPUT);

  connectWifi();
  connectFirebase();
}

void loop() {
  readFlow();
  delay(500);
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
  Serial.print("connecting to host " + String(FIREBASE_DB_URL) + " ...");
  client.connect(FIREBASE_DB_URL, 443);
  Serial.println(client.connected() ? " success" : " failed");

  String path = "/myString.json?auth=" + String(FIREBASE_AUTH_TOKEN);
  client.println("GET " + path + " HTTP/1.1");
  client.println("Host: " + String(FIREBASE_DB_URL));
  client.println("Connection: close");
  client.println();
  String response = client.readString();
  Serial.println("response: " + response);
}

// sensors

void readFlow() {
  flowSensor.read();
  int pulse = flowSensor.getPulse();
  float volume = flowSensor.getVolume();
  d("pulse: " + String(pulse) + "; volume: " + String(volume) + " L");

  writeLights(volume);

  if (volume >= VOLUME_THRESHOLD) {
    //flowSensor.resetVolume();
    d("threshold reached");
  }
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
