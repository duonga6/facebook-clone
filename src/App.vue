<template>
  <Suspense>
    <component :is="layout">
      <router-view :key="$route.fullPath" />
    </component>
  </Suspense>
</template>

<script>
import { computed, onBeforeMount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DEFAULT_LAYOUT } from "@/constants";
import { useStore } from "vuex";
import EventBus from "@/common/EventBus";
import { useToast } from "primevue/usetoast";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const toast = useToast();

    store.dispatch("mediaType/getAll");
    store.dispatch("reaction/getDefaultReaction");

    function logOut() {
      store.dispatch("logout");
      router.push({ name: "login", params: {} });
    }

    onMounted(() => {
      EventBus.on("logout", () => {
        logOut();
      });

      EventBus.on("toastAlert", (type, message) => {
        toast.add({
          severity: type,
          summary: message,
          life: 3000,
        });
      });
    });

    onBeforeMount(() => {
      EventBus.remove("logout");
    });

    return {
      layout: computed(() => (route.meta.layout || DEFAULT_LAYOUT) + "-layout"),
    };
  },
};
</script>
