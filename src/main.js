/* eslint-disable */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { registerGlobalComponents } from "./components/importComponent";
import "@/assets/styles/index.css";
import setupInterceptor from "@/services/setupInterceptor";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import { clickOutside } from "./utilities/clickOutSide";

const app = createApp(App);
registerGlobalComponents(app);
setupInterceptor(store);
app.use(store);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.directive("click-outside", clickOutside);
app.mount("#app");

// createApp(App).use(store).use(router).mount("#app");
