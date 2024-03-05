<template>
  <div class="post-overlay-group" v-if="postData && user">
    <div class="post-overlay-container">
      <div class="post-overlay-header">
        <div class="post-author">Bài viết của {{ user.lastName }}</div>
        <button class="btn-close-overlay">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <hr />
      <div class="post-overlay-main">
        <post-component :post="postData" :isOverlay="true"></post-component>
      </div>
      <div class="post-overlay-create-comment">
        <div class="create-comment-container">
          <div class="user-avatar">
            <img class="" :src="user?.avatarUrl" alt="" />
          </div>
          <div class="post-comment-input">
            <div class="flex">
              <textarea
                @input="onCommentChange"
                rows="1"
                placeholder="Viết bình luận công khai..."
                class="comment-input"
                id="create-comment-input"
                v-model="commentInput"
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
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import PostComponent from "./PostComponent.vue";
export default {
  components: { PostComponent },
  props: {
    postData: {
      type: Object,
    },
  },
  setup() {
    const store = useStore();
    const commentInput = ref(null);
    const user = computed(() => store.getters["user/getUser"]);

    function onCommentChange(e) {
      const textareaElement = e.target;
      textareaElement.style.height = 0;
      textareaElement.style.height = textareaElement.scrollHeight + "px";
    }

    return {
      onCommentChange,
      user,
      commentInput,
    };
  },
};
</script>

<style lang="scss" scoped>
.post-overlay-group {
  @apply fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-gray-200 bg-opacity-80 z-50 flex justify-center;
  .post-overlay-container {
    @apply flex flex-col bg-white rounded-lg shadow-custom-sm my-8 w-700px;
    .post-overlay-header {
      @apply relative;
      .post-author {
        @apply font-bold text-xl py-4 text-center;
      }
      .btn-close-overlay {
        @apply absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 w-9 h-9 rounded-full;
      }
    }

    .post-overlay-main {
      @apply flex-1 relative overflow-y-scroll;

      &::-webkit-scrollbar {
        @apply w-1 left-0;
      }

      &::-webkit-scrollbar-thumb {
        @apply rounded-lg bg-gray-300;
      }

      &::-webkit-scrollbar-track {
        @apply hidden;
      }

      .post-data {
        .post-header {
          @apply flex justify-between p-4 pb-0;
          .post-info {
            @apply flex;
            .post-author-avt {
              @apply w-10 h-10 rounded-full overflow-hidden border border-gray-200;
              img {
                @apply w-full h-full object-cover;
              }
            }
            .post-author-name {
              @apply ms-4 flex flex-col;
              .name-text {
                @apply font-semibold text-15;
              }
              .post-date {
                @apply text-13 text-gray-500 flex items-center space-x-1;
              }
            }
          }
          .post-more {
            .btn-show-post-more {
              @apply w-10 h-10 rounded-full overflow-hidden hover:bg-gray-100;
              .icon {
                @apply font-semibold text-gray-600;
              }
            }
          }
        }
        .post-content {
          @apply text-15 p-4 py-3;
        }
      }
    }
    .post-overlay-create-comment {
      @apply p-5 pt-0;
      .create-comment-container {
        @apply flex items-center mt-2;
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
    }
  }
}
</style>
