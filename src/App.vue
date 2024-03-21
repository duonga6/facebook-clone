<template>
  <Suspense>
    <component :is="layout">
      <router-view />
      <Toast position="bottom-right" />
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
import Toast from "primevue/toast";

export default {
  components: { Toast },
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
      layout: computed(() => (route.meta.layout || DEFAULT_LAYOUT) + "-layout"),
    };
  },
};
</script>
