<template>
  <div class="user-post-list space-y-4">
    <PostComponent
      v-for="post in postData.posts"
      :key="post.id"
      :post="post"
      :storeName="'profilePost'"
    ></PostComponent>
  </div>
</template>
<script>
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { useStore } from "vuex";
import { POST_TYPE } from "@/constants";
import { PostUtils } from "@/store/postUtils";
import tokenService from "@/services/token.service";
export default {
  props: {
    userId: {
      type: String,
    },
  },
  async setup(props) {
    const store = useStore();

    // Id của user nếu props ko có thì là user đã log => lấy ở token
    const id = props.userId == "" ? tokenService.getUser().id : props.userId;

    const postData = reactive({
      total: 0,
      posts: computed(() => store.getters["profilePost/getPosts"]),
      pageSize: 20,
      pageNumber: 0,
      _isFetched: false,
    });

    async function getPost() {
      const res = await PostUtils.getPostWithDependent({
        type: POST_TYPE.PROFILE_POST,
        pageSize: postData.pageSize,
        pageNumber: postData.pageNumber,
        userId: id,
      });

      postData.pageNumber++;
      postData._isFetched = true;

      store.dispatch("profilePost/setPosts", res);
    }

    onUnmounted(() => {
      store.dispatch("profilePost/reset");
    });

    onMounted(async () => {
      if (!postData._isFetched) {
        await getPost();
      }
    });

    return {
      postData,
    };
  },
};
</script>
