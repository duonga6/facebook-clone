<template>
  <div class="user-post-list space-y-4">
    <PostComponent
      v-for="post in postData.data"
      :key="post.id"
      :post="post"
      :storeName="'feedPost'"
    ></PostComponent>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();

    return {
      postData: computed(() => store.getters["feedPost/getPosts"]),
    };
  },
};
</script>
