<template>
  <PostDetailComponent v-for="post in posts" :key="post.id" :post="post" />
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { POST_TYPE } from "@/constants";
import { useRoute } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const postId = route.params.id;

    onUnmounted(() => {
      store.dispatch("post/reset");
    });

    onMounted(async () => {
      await store.dispatch("post/getPost", {
        postType: POST_TYPE.SINGLE_POST,
        postId: postId,
      });
    });

    return {
      posts: computed(() => store.getters["post/getPosts"]),
    };
  },
};
</script>
