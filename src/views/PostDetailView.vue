<template>
  <PostDetailComponent
    v-for="post in postData.posts"
    :key="post.id"
    :post="post"
    :storeName="'singlePost'"
  />
</template>

<script>
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { useStore } from "vuex";
import { POST_TYPE } from "@/constants";
import { useRoute } from "vue-router";
import { PostUtils } from "@/store/postUtils";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const postId = route.params.id;

    const postData = reactive({
      total: 0,
      posts: computed(() => store.getters["singlePost/getPosts"]),
      pageSize: 1,
      pageNumber: 1,
      _isFetched: false,
    });

    async function getPosts() {
      const posts = await PostUtils.getPostWithDependent({
        type: POST_TYPE.SINGLE_POST,
        postId: postId,
      });

      postData._isFetched = true;
      store.dispatch("singlePost/setPosts", posts.data);
    }

    onUnmounted(() => {
      store.dispatch("singlePost/reset");
    });

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
