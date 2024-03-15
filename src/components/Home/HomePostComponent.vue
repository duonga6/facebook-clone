<template>
  <div class="post-list flex flex-col space-y-2 mt-4">
    <PostComponent v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted, onUnmounted } from "vue";
import { POST_TYPE } from "@/constants";

export default {
  async setup() {
    const store = useStore();

    onUnmounted(() => {
      store.dispatch("post/reset");
    });

    onMounted(async () => {
      await store.dispatch("post/getPost", {
        postType: POST_TYPE.HOME_POST,
      });
    });

    return {
      posts: computed(() => store.getters["post/getPosts"]),
    };
  },
};
</script>
