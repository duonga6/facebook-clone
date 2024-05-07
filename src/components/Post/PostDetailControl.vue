<template>
  <PostDetailComponent
    v-if="post.data[0]"
    :post="post.data[0]"
    :storeName="'singlePost'"
  />
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { POST_TYPE } from "@/constants";

export default {
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    // eslint-disable-next-line vue/no-setup-props-destructure
    const postId = props.postId;
    const post = computed(() => store.getters["singlePost/getPosts"]);

    onMounted(async () => {
      if (!post.value.postType) {
        store.dispatch("singlePost/initStore", {
          postType: POST_TYPE.SINGLE_POST,
          postId: postId,
        });
      }

      if (post.value.hasNextPage) {
        await store.dispatch("singlePost/getPost");
      }
      //
    });

    onUnmounted(() => {
      store.dispatch("singlePost/reset");
    });

    return {
      post,
    };
  },
};
</script>
