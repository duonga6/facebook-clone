<template>
  <div class="group-preview-container">
    <GroupDetails :id="id"></GroupDetails>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();

    return {
      id: route.params?.id,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-preview-container {
  @apply h-full overflow-y-auto;
}
</style>
