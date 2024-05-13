<template>
  <SearchComponent :key="key"></SearchComponent>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    return {
      key: computed(() => route.query.s),
    };
  },
};
</script>
