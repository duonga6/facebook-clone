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
import { scrollToBottom, scrollToBottomWindow } from "@/utilities/scrollEnd";
import Lara from "@/presets/lara";

const app = createApp(App);
registerGlobalComponents(app);
setupInterceptor(store);
app.use(store);
app.use(router);
app.use(PrimeVue, {
  pt: Lara,
});
app.use(ToastService);
app.directive("click-outside", clickOutside);
app.directive("scroll-bottom", scrollToBottom);
app.directive("scroll-bottom-window", scrollToBottomWindow);
app.mount("#app");
