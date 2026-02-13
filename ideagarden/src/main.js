import { createApp } from "vue";
import { createPinia } from "pinia";
import { setUpFirebase } from "./persistance/firebaseModel";
import App from "./views/App";
import router from "./router";
import { createHead } from "@vueuse/head";

const app = createApp(App)
  .use(createHead())
  .use(createPinia())
  .use(router);

app.mount("#app");
setUpFirebase();
