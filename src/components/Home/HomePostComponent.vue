<template>
  <div class="post-list flex flex-col mt-4">
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
import { computed, onMounted, reactive } from "vue";
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
      _isFetched: computed(() => store.getters["homePost/getFecthStatus"]),
    });

    async function getPosts() {
      const posts = await PostUtils.getPostWithDependent({
        type: POST_TYPE.HOME_POST,
        pageSize: postData.pageSize,
        pageNumber: postData.pageNumber,
      });

      postData.pageNumber++;
      store.dispatch("homePost/setPosts", posts);
    }

    onMounted(async () => {
      if (!postData._isFetched) {
        await getPosts();
      }
    });

    return {
      postData,
    };
  },
};
</script>
