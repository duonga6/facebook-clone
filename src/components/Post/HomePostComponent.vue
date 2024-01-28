<template>
  <div class="post-list mt-4">
    <post-component v-for="post in state.posts" :key="post.id" :post="post" />
  </div>
</template>

<script>
import PostComponent from "@/components/Post/PostComponent.vue";
import { useStore } from "vuex";
import { reactive, watch } from "vue";
export default {
  components: { PostComponent },
  setup() {
    const store = useStore();
    const state = reactive({
      posts: store.getters["post/getHomePosts"],
    });

    watch(
      () => store.state.post.homePosts.posts,
      (newVal) => {
        state.posts = store.getters["post/getHomePosts"];
        console.log(newVal);
      }
    );

    store.dispatch("post/getHomePost", {
      pageSize: 20,
      pageNumber: 1,
      searchString: null,
    });

    return {
      state,
    };
  },
};
</script>
