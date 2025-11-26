const bool DEBUG = true;

//

void setup() {
  Serial.begin(9600);
}

void loop() {
}

//

void d(String s) {
  if (DEBUG) {
    Serial.println("D: " + s);
  }
}
