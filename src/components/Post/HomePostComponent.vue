<template>
  <div class="post-list mt-4">
    <post-component v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script>
import PostComponent from "@/components/Post/PostComponent.vue";
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
export default {
  components: { PostComponent },
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch("post/getHomePost", {
        pageSize: 20,
        pageNumber: 1,
        searchString: null,
      });
    });

    return {
      posts: computed(() => store.getters["post/getHomePosts"]),
    };
  },
};
</script>
