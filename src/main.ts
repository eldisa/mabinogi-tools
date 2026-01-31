import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import App from "./App.vue";
// @ts-ignore
import router from "./router";
import "./index.css";
import "./styles/design-tokens.css";
import "./styles/element-dark-theme.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

const pinia = createPinia();
app.use(pinia);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
