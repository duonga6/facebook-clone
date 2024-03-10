import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { registerGlobalComponents } from "./utilities/importComponent";
import "@/assets/styles/index.css";
import setupInterceptor from "@/services/setupInterceptor";
import PrimeVue from "primevue/config";
import lara from "./presets/lara";
import ToastService from "primevue/toastservice";

const app = createApp(App);
registerGlobalComponents(app);
setupInterceptor(store);
app.use(store);
app.use(router);
app.use(PrimeVue, {
  unstyled: true,
  pt: lara,
});
app.use(ToastService);
app.mount("#app");

// createApp(App).use(store).use(router).mount("#app");
