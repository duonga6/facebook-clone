<template>
  <div class="post-list flex flex-col space-y-2 mt-4">
    <post-component v-for="post in posts" :key="post.id" :post="post" />
  </div>
  <div class="relavite">
    <!-- <post-overlay-component :postData="posts[0]"></post-overlay-component> -->
  </div>
</template>

<script>
import PostComponent from "@/components/Post/PostComponent.vue";
import { useStore } from "vuex";
import { computed, onBeforeUnmount, onMounted } from "vue";
export default {
  components: { PostComponent },
  setup() {
    const store = useStore();
    const posts = computed(() => store.getters["homePost/getHomePosts"]);

    onMounted(() => {
      store.dispatch("homePost/getHomePost");
    });

    onBeforeUnmount(() => {
      posts.value.length = 0;
    });

    return {
      posts,
    };
  },
};
</script>
