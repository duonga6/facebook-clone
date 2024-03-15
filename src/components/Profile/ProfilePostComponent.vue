<template>
  <div class="user-post-list space-y-4">
    <post-component
      v-for="post in posts"
      :key="post.id"
      :post="post"
    ></post-component>
  </div>
</template>
<script>
import { computed, onMounted, onUnmounted } from "vue";
import PostComponent from "../Post/PostComponent.vue";
import { useStore } from "vuex";
import { POST_TYPE } from "@/constants";
export default {
  components: { PostComponent },
  props: {
    userId: {
      type: String,
    },
  },
  async setup(props) {
    const store = useStore();

    onUnmounted(() => {
      store.dispatch("post/reset");
    });

    onMounted(async () => {
      await store.dispatch("post/getPost", {
        postType: POST_TYPE.PROFILE_POST,
        userId: props.userId,
      });
    });

    const posts = computed(() => store.getters["post/getPosts"]);

    return {
      posts,
    };
  },
};
</script>
