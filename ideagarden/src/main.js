import "@/css/index.css";
import "@/css/general.css";
import "@/css/sitewide.css";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createHead } from "@vueuse/head";
import { setUpFirebase } from "@/persistance/firebaseModel";
import router from "@/router";
import App from "@/views/App";

const app = createApp(App)
  .use(createHead())
  .use(createPinia())
  .use(router);

app.mount("#app");
setUpFirebase();
