<template>
  <div class="user-post-list space-y-4">
    <PostComponent
      v-for="post in postData.data"
      :key="post.id"
      :post="post"
      :storeName="'profilePost'"
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
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { useStore } from "vuex";
export default {
  props: {
    userId: {
      type: String,
    },
  },
  async setup() {
    const store = useStore();
    const postData = reactive({
      data: computed(() => store.getters["profilePost/getPosts"]),
      state: computed(() => store.getters["profile/getPostState"]),
    });

    function handleScrollWindow() {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight
      ) {
        if (
          postData.state.pageNumber != 0 &&
          postData.state.pageSize * postData.state.pageNumber <
            postData.state.total
        ) {
          store.dispatch("profile/getPost");
        }
      }
    }

    onMounted(() => {
      console.log(postData);
      window.addEventListener("scroll", handleScrollWindow);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScrollWindow);
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
