<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import { computed, onBeforeMount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DEFAULT_LAYOUT } from "@/constants";
import { useStore } from "vuex";
import EventBus from "@/common/EventBus";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

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
