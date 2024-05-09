<template>
  <div class="group-preview-container" v-scroll-near-bottom="onGetGroupPost">
    <GroupDetails :id="id"></GroupDetails>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
export default {
  setup() {
    const route = useRoute();
    const store = useStore();

    let isFetchingData = false;
    async function onGetGroupPost() {
      if (!isFetchingData) {
        isFetchingData = true;
        await store.dispatch("groupPost/getPost");
        isFetchingData = false;
      }
    }

    return {
      id: route.params?.id,
      onGetGroupPost,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-preview-container {
  @apply h-full overflow-y-auto;
}
</style>
