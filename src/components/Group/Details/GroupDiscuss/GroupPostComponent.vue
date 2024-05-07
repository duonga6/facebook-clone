<template>
  <div class="user-post-list mt-4" v-scroll-near-bottom-window="onGetPost">
    <PostComponent
      v-for="post in postData.data"
      :key="post.id"
      :post="post"
      :storeName="'groupPost'"
    ></PostComponent>
  </div>
  <div
    class="empty-post"
    v-if="!postData.data.length && postData.state.isFetched"
  >
    Chưa có bài viết nào
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    let isFetching = false;
    const postData = reactive({
      data: computed(() => store.getters["groupPost/getPosts"]),
      state: computed(() => store.getters["group/getPostState"]),
    });

    async function onGetPost() {
      if (!isFetching && postData.state?.hasNextPage) {
        isFetching = true;
        await store.dispatch("group/getPost");
        isFetching = false;
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
