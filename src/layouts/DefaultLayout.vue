<template>
  <HeaderComponent />
  <slot />
</template>

<script>
import HeaderComponent from "@/components/Header/HeaderComponent.vue";
import { useStore } from "vuex";
export default {
  components: { HeaderComponent },
  setup() {
    const store = useStore();
    store.dispatch("user/getDataUser");
  },
};
</script>
