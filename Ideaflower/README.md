# Ideaflower Arduino

## Make [FirebaseArduino](https://github.com/Rupakpoddar/FirebaseArduino/) compatible with Arduino Uno WiFi Rev2

In `Firebase.h`, add:

```cpp
#elif defined(ARDUINO_AVR_UNO_WIFI_REV2)
    #include <WiFiNINA.h>
```

```cpp
#elif defined(ARDUINO_AVR_UNO_WIFI_REV2)
    WiFiSSLClient _httpsClient;
```

In `Firebase.cpp`, edit to:

```cpp
#if !(defined(ARDUINO_UNOWIFIR4) || defined(ARDUINO_AVR_UNO_WIFI_REV2))
    _httpsClient.setInsecure();
#endif
```
