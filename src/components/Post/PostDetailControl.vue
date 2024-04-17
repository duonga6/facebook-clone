<template>
  <PostDetailComponent
    v-if="postData.data[0]"
    :post="postData.data[0]"
    :storeName="'singlePost'"
  />
</template>

<script>
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { useStore } from "vuex";
import { POST_TYPE } from "@/constants";
import { PostUtils } from "@/store/postUtils";

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

    const postData = reactive({
      data: computed(() => store.getters["singlePost/getPosts"]),
      _isFetched: computed(() => store.getters["singlePost/getFecthStatus"]),
    });

    async function getPosts() {
      const posts = await PostUtils.getPostWithDependent({
        type: POST_TYPE.SINGLE_POST,
        postId: postId,
      });

      store.dispatch("singlePost/setPosts", posts.data);
    }

    onUnmounted(() => {
      store.dispatch("singlePost/reset");
    });

    onMounted(async () => {
      if (!postData._isFetched) {
        await getPosts();
      }
    });

    return {
      postData,
    };
  },
};
</script>
