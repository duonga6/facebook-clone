<template>
  <div class="group-feed-container" v-scroll-near-bottom="onGetPost">
    <div class="group-feed-bounded">
      <div class="group-feed-header">
        <div class="feed-header-text">Hoạt động gần đây</div>
      </div>
      <div class="group-feed-post">
        <PostFeed></PostFeed>
      </div>
    </div>
  </div>
</template>

<script>
import { PostUtils } from "@/store/postUtils";
import { POST_TYPE } from "@/constants";
import { useStore } from "vuex";
import { onMounted, reactive } from "vue";
import { toastAlert } from "@/utilities/toastAlert";
export default {
  setup() {
    const store = useStore();
    const postControl = reactive({
      endCursor: null,
      hasNextPage: true,
    });

    let isFetching = false;

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

    async function onGetPost() {
      if (!isFetching) {
        isFetching = true;
        try {
          await getPost();
        } catch (err) {
          console.log(err);
          toastAlert.error("Có lỗi khi tải bài viết");
        } finally {
          isFetching = false;
        }
      }
    }

    onMounted(async () => {
      if (!store.getters["feedPost/getFecthStatus"]) {
        await getPost();
      }
    });

    return {
      onGetPost,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-feed-container {
  @apply h-full overflow-y-auto py-4;

  .group-feed-bounded {
    max-width: 680px;
    @apply mx-auto;

    .group-feed-header {
      @apply mt-4 mb-3;

      .feed-header-text {
        @apply text-15 font-semibold text-gray-700;
      }
    }
    .group-feed-post {
    }
  }
}
</style>
