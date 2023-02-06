// import { createApp } from "vue";
// import App from "./App.vue";
// import store from "./store";

// createApp(App).use(store).mount("#app");

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");
