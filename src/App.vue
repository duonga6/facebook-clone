<template>
  <Suspense>
    <component :is="layout">
      <router-view />
      <Toast position="bottom-right" />
    </component>
  </Suspense>
</template>

<script>
/* eslint-disable */
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import EventBus from "@/common/EventBus";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { DEFAULT_LAYOUT } from "./constants";

export default {
  components: { Toast },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const toast = useToast();

    const layoutReady = ref(false);
    const layout = computed(() => {
      const layoutName = route.meta.layout || DEFAULT_LAYOUT;
      return layoutName + "-layout";
    });

    store.dispatch("mediaType/getAll");
    store.dispatch("reaction/getDefaultReaction");

    async function logOut() {
      await router.push({ name: "login", params: {} });
      store.dispatch("logout");
    }

    onMounted(() => {
      EventBus.on("logout", () => {
        logOut();
      });

      EventBus.on("toastAlert", (data) => {
        toast.add({
          severity: data.type,
          summary: data.summary,
          detail: data.message,
          life: 5000,
        });
      });
    });

    onBeforeMount(() => {
      EventBus.remove("logout");
      EventBus.remove("toastAlert");
    });

    return {
      layout,
      layoutReady,
    };
  },
};
</script>
