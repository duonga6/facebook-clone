<template>FEED</template>

<script>
import { PostUtils } from "@/store/postUtils";
import { POST_TYPE } from "@/constants";
import { useStore } from "vuex";
import { onMounted, onUnmounted, reactive } from "vue";
export default {
  setup() {
    const store = useStore();
    const postControl = reactive({
      endCursor: null,
      hasNextPage: true,
    });

    async function getPost() {
      if (postControl.hasNextPage) {
        const res = await PostUtils.getPostCursorWithDependent({
          type: POST_TYPE.GROUP_FEED,
          pageSize: 10,
          cursor: postControl.endCursor,
        });

        postControl.endCursor = res.endCursor;
        postControl.hasNextPage = res.hasNextPage;

        await store.dispatch("feedPost/setPosts", res.data);
      }
    }

    onMounted(async () => {
      await getPost();
    });

    onUnmounted(() => {
      store.dispatch("feedPost/reset");
    });
  },
};
</script>
