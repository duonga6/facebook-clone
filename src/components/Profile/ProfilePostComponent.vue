<template>
  <div
    class="user-post-list space-y-4"
    v-scroll-near-bottom-window="onScrollEnd"
  >
    <PostComponent
      v-for="post in post.data"
      :key="post.id"
      :post="post"
      :storeName="'profilePost'"
    ></PostComponent>
  </div>
  <div class="empty-post" v-if="!post.data.length && !post.hasNextPage">
    Chưa có bài viết nào
  </div>
</template>
<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { POST_TYPE } from "@/constants";
export default {
  props: {
    userId: {
      type: String,
    },
  },
  async setup(props) {
    const store = useStore();
    const isFetching = ref(false);
    const post = computed(() => store.getters["profilePost/getPosts"]);

    async function onScrollEnd() {
      if (!isFetching.value && post.value.hasNextPage) {
        isFetching.value = true;
        await store.dispatch("profilePost/getPost");
        isFetching.value = false;
      }
    }

    onMounted(async () => {
      if (!post.value.postType) {
        store.dispatch("profilePost/initStore", {
          postType: POST_TYPE.PROFILE_POST,
          userId: props.userId,
          pageSize: 5,
        });
      }

      if (post.value.hasNextPage) {
        await store.dispatch("profilePost/getPost");
      }
    });

    return {
      post,
      onScrollEnd,
    };
  },
};
</script>

<style lang="scss" scoped>
.empty-post {
  @apply rounded-lg border border-gray-200 bg-white text-17 font-semibold text-center py-4;
}
</style>
