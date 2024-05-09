<template>
  <div
    class="user-post-list mt-4"
    v-scroll-near-bottom-window="onGetPost"
    v-if="postData.data.length"
  >
    <PostComponent
      v-for="post in postData.data"
      :key="post.id"
      :post="post"
      :storeName="'groupPost'"
    ></PostComponent>
  </div>
  <div class="empty-post" v-if="!postData.data.length && !postData.hasNextPage">
    Chưa có bài viết nào
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const postData = computed(() => store.getters["groupPost/getPosts"]);

    let isFetchingData = false;
    async function onGetPost() {
      if (!isFetchingData) {
        isFetchingData = true;
        await store.dispatch("groupPost/getPost");
        isFetchingData = false;
      }
    }

    return {
      postData,
      onGetPost,
    };
  },
};
</script>

<style lang="scss" scoped>
.empty-post {
  @apply rounded-lg border border-gray-200 bg-white text-17 font-semibold text-center py-4;
}
</style>
