<p align="center"><img width="128" src="logo.svg"></p>

<h1 align="center">Ideaflower</h1>

Human-plant interaction for speculative slow care in co-creative AI

## Hardware

- [Arduino Uno WiFi Rev2](https://docs.arduino.cc/hardware/uno-wifi-rev2/)
- [G3&4" Water Flow sensor](https://www.seeedstudio.com/G3-4-Water-Flow-Sensor-p-1083.html)

## Software

Arduino:

- [WiFiNINA](https://docs.arduino.cc/libraries/wifinina/)
- [FlowSensor](https://github.com/hafidhh/FlowSensor-Arduino/)
- [FirebaseArduino](https://github.com/Rupakpoddar/FirebaseArduino/)

Web:

- [Vue](https://vuejs.org/), [Vite](https://vite.dev/), [Vue Router](https://router.vuejs.org/), [Pinia](https://pinia.vuejs.org/), [VueUse](https://vueuse.org/)
- [Firebase](https://firebase.google.com/) database and hosting
- [OpenAI](https://developers.openai.com/api/docs), [GPT-4.1](https://developers.openai.com/api/docs/models/gpt-4.1)
- [Blobshape](https://github.com/lokesh-coder/blobshape) shape generator
- [Lucide](https://lucide.dev/) icons

## Develop

```
npm install
firebase init
npm run dev
```

## Deploy

```
npm run build
firebase deploy
```
