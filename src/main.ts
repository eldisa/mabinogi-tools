import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import App from "./App.vue";
// @ts-ignore
import router from "./router";
import "./index.css";

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
