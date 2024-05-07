<template>
  <div
    class="post-list flex flex-col mt-4"
    v-scroll-near-bottom-window="onScrollEnd"
  >
    <PostComponent
      v-for="post in post.data"
      :key="post.id"
      :post="post"
      :storeName="'homePost'"
    />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";

export default {
  async setup() {
    const store = useStore();
    const isFetching = ref(false);

    const post = computed(() => store.getters["homePost/getPosts"]);

    async function onScrollEnd() {
      if (!isFetching.value && post.value.hasNextPage) {
        isFetching.value = true;
        await store.dispatch("homePost/getPost");
        isFetching.value = false;
      }
    }

    onMounted(async () => {
      if (!post.value.postType) {
        store.dispatch("homePost/initStore");
      }

      if (post.value.hasNextPage && !post.value.isFetched) {
        store.dispatch("homePost/getPost");
      }
    });

    return {
      post,
      onScrollEnd,
    };
  },
};
</script>
