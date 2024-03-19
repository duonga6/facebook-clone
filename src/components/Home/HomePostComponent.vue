<template>
  <div class="post-list flex flex-col space-y-2 mt-4">
    <PostComponent
      v-for="post in postData.posts"
      :key="post.id"
      :post="post"
      :storeName="'homePost'"
    />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { POST_TYPE } from "@/constants";
import { PostUtils } from "@/store/postUtils";

export default {
  async setup() {
    const store = useStore();

    const postData = reactive({
      total: 0,
      posts: computed(() => store.getters["homePost/getPosts"]),
      pageSize: 20,
      pageNumber: 0,
      _isFetched: false,
    });

    async function getPosts() {
      const posts = await PostUtils.getPostWithDependent({
        type: POST_TYPE.HOME_POST,
        pageSize: postData.pageSize,
        pageNumber: postData.pageNumber,
      });

      postData.pageNumber++;
      postData._isFetched = true;

      store.dispatch("homePost/setPosts", posts);
    }

    onUnmounted(() => {
      store.dispatch("homePost/reset");
    });

    onMounted(async () => {
      if (!postData._isFetched) {
        await getPosts();
      }
    });

    return {
      posts: computed(() => store.getters["post/getPosts"]),
      postData,
    };
  },
};
</script>
