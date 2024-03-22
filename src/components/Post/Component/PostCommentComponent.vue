<template>
  <div class="post-comment">
    <button
      v-if="comment.hasNextPage && !isLoadingComment"
      class="font-semibold text-gray-500 text-15 mt-2 hover:underline"
      @click="handleClickShowMoreComment"
    >
      Xem thêm bình luận
    </button>
    <LoadingComponent
      :classCss="'ms-10 w-6 h-6 mt-2'"
      v-if="isLoadingComment"
    ></LoadingComponent>
    <div class="comment-list space-y-1 mt-2">
      <CommentComponent
        v-for="comment in commentShowBelow"
        :key="comment.id"
        :comment="comment"
        :storeName="storeName"
      >
      </CommentComponent>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { PostUtils } from "@/store/postUtils";
import { useStore } from "vuex";
import { toastAlert } from "@/utilities/toastAlert";
import tokenService from "@/services/token.service";
export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const isLoadingComment = ref(false);
    const user = tokenService.getUser();

    const commentShowBelow = computed(() => {
      return props.comment.comments;
    });

    async function handleClickShowMoreComment() {
      try {
        isLoadingComment.value = true;
        const res = await PostUtils.getCommentChild(
          props.postId,
          props.comment.pageSize,
          props.comment.endCursor
        );

        store.dispatch(`${props.storeName}/setComments`, {
          path: null,
          postId: props.postId,
          data: res,
        });
      } catch (error) {
        toastAlert.error(error);
      } finally {
        isLoadingComment.value = false;
      }
    }

    return {
      isLoadingComment,
      commentShowBelow,
      user,
      handleClickShowMoreComment,
    };
  },
};
</script>

<style lang="scss" scoped>
.post-comment {
  @apply mx-4  border-t;
}
</style>
