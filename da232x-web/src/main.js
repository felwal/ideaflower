import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./views/app";
import router from "./router";

const app = createApp(App)
  .use(createPinia())
  .use(router);

app.mount("#app");
