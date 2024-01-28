import { defineAsyncComponent } from "vue";
import Dropdown from "primevue/dropdown";

export function registerGlobalComponents(app) {
  app.component(
    "auth-layout",
    defineAsyncComponent(() => import("@/layouts/AuthLayout"))
  );

  app.component(
    "default-layout",
    defineAsyncComponent(() => import("@/layouts/DefaultLayout"))
  );

  app.component("drop-down", Dropdown);
}
