<template>
  <div class="create-comment-container">
    <div class="user-avatar">
      <img class="" :src="user.avatarUrl" alt="" />
    </div>
    <div class="post-comment-input">
      <div class="flex">
        <textarea
          @input="onInputChangeHeight"
          @keydown.enter.exact="createComment"
          rows="1"
          placeholder="Viết bình luận công khai..."
          class="comment-input"
          id="create-comment-input"
          v-model="commentInput"
          ref="commentInputEl"
        />
      </div>
      <div class="post-send-btn">
        <button
          class="button-send"
          :disabled="!commentInput"
          @click="createComment"
        >
          <i
            class="pi pi-send text-md"
            :class="commentInput ? 'text-primary' : 'text-gray-400'"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import tokenService from "@/services/token.service";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { onInputChangeHeight } from "@/utilities/inputUtils";

/* eslint-disable */

export default {
  props: {
    storeName: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    // Data variables
    const commentInputEl = ref(null);
    const commentInput = ref(null);
    let defaultHeight;

    // Create comment
    async function createComment(e) {
      e.preventDefault();
      if (commentInput.value && commentInput.value.trim()) {
        commentInputEl.value.style.height = defaultHeight;
        store.dispatch(`${props.storeName}/createComment`, {
          data: {
            content: commentInput.value.trim(),
            postId: props.postId,
          },
          path: null,
        });
            commentInput.value = null;
      }
    }

    onMounted(() => {
      defaultHeight = commentInputEl.value.style.height;
    })

    return {
      user: tokenService.getUser(),
      commentInput,
      commentInputEl,
      createComment,
      onInputChangeHeight,
    };
  },
};
</script>

<style lang="scss" scoped>
.create-comment-container {
  @apply flex items-center p-2;
  .user-avatar {
    @apply w-8 h-8 rounded-full overflow-hidden border border-gray-200;
    img {
      @apply w-full h-full object-cover;
    }
  }

  .post-comment-input {
    @apply relative ms-2 flex-1;
    .comment-input {
      @apply outline-none bg-gray-100 placeholder:text-gray-600 text-15 ps-4 pe-12 py-1.5 rounded-2xl w-full resize-none overflow-hidden;
    }
  }
  .post-send-btn {
    @apply absolute right-2 top-1/2 -translate-y-1/2;
    .button-send {
      @apply flex items-center p-1.5;
    }
  }
}
</style>
