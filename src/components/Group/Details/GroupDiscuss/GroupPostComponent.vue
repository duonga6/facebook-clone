<template>
  <div class="mt-4"></div>
  <div class="user-post-list space-y-4">
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
    const postData = reactive({
      data: computed(() => store.getters["groupPost/getPosts"]),
      state: computed(() => store.getters["group/getPostState"]),
    });

    return {
      postData,
    };
  },
};
</script>

<style lang="scss" scoped>
.empty-post {
  @apply rounded-lg border border-gray-200 bg-white text-17 font-semibold text-center py-4;
}
</style>
