/**
 * main.ts
 *
 * registerPlugins 에서 Vuetify, Pinia, Vue Router 플러그인 가져옴
 */

import App from "./App.vue";
import { createApp } from "vue";
import { registerPlugins } from "./plugins";

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
