<template>
  <div class="group-feed-container" v-scroll-near-bottom="onGetPost">
    <div class="group-feed-bounded">
      <div class="group-feed-header">
        <div class="feed-header-text">Hoạt động gần đây</div>
      </div>
      <div class="group-feed-post">
        <PostFeed></PostFeed>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();

    let isFetchingData = false;
    async function onGetPost() {
      if (!isFetchingData) {
        isFetchingData = true;
        await store.dispatch("feedPost/getPost");
        isFetchingData = false;
      }
    }

    return {
      onGetPost,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-feed-container {
  @apply h-full overflow-y-auto py-4;

  .group-feed-bounded {
    max-width: 680px;
    @apply mx-auto;

    .group-feed-header {
      @apply mt-4 mb-3;

      .feed-header-text {
        @apply text-15 font-semibold text-gray-700;
      }
    }
    .group-feed-post {
    }
  }
}
</style>
