import { createApp } from "vue";
import { createPinia } from "pinia";
import { setUpFirebase } from "./persistance/firebaseModel";
import App from "./views/App";
import router from "./router";

const app = createApp(App)
  .use(createPinia())
  .use(router);

app.mount("#app");
setUpFirebase();
