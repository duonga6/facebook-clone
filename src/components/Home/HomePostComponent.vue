<template>
  <div class="post-list flex flex-col space-y-2 mt-4">
    <PostComponent v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onUnmounted } from "vue";
import { POST_TYPE } from "@/constants";

export default {
  setup() {
    const store = useStore();
    const posts = computed(() => store.getters["post/getPosts"]);

    store.dispatch("post/getPost", {
      postType: POST_TYPE.HOME_POST,
    });

    onUnmounted(() => {
      store.dispatch("post/reset");
    });

    return {
      posts,
    };
  },
};
</script>
