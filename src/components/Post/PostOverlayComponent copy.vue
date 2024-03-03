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
        <div class="post-data">
          <div class="post-header">
            <div class="post-info">
              <div class="post-author-avt">
                <img class="" :src="user.avatarUrl" />
              </div>
              <div class="post-author-name">
                <span class="name-text">{{
                  user.firstName + " " + user.lastName
                }}</span>
                <div class="post-date">
                  <span>{{
                    postData.createdAt.getDate() +
                    " tháng " +
                    (postData.createdAt.getMonth() + 1) +
                    " lúc " +
                    postData.createdAt.getHours() +
                    ":" +
                    (postData.createdAt.getMinutes() < 10
                      ? "0" + postData.createdAt.getMinutes()
                      : postData.createdAt.getMinutes())
                  }}</span>
                  <div class="">.</div>
                  <svg
                    viewBox="0 0 16 16"
                    width="12"
                    height="12"
                    fill="currentColor"
                    title="Đã chia sẻ với Công khai"
                    class="x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq"
                    style="--color: var(--secondary-icon)"
                  >
                    <g fill-rule="evenodd" transform="translate(-448 -544)">
                      <g>
                        <path
                          d="M109.5 408.5c0 3.23-2.04 5.983-4.903 7.036l.07-.036c1.167-1 1.814-2.967 2-3.834.214-1 .303-1.3-.5-1.96-.31-.253-.677-.196-1.04-.476-.246-.19-.356-.59-.606-.73-.594-.337-1.107.11-1.954.223a2.666 2.666 0 0 1-1.15-.123c-.007 0-.007 0-.013-.004l-.083-.03c-.164-.082-.077-.206.006-.36h-.006c.086-.17.086-.376-.05-.529-.19-.214-.54-.214-.804-.224-.106-.003-.21 0-.313.004l-.003-.004c-.04 0-.084.004-.124.004h-.037c-.323.007-.666-.034-.893-.314-.263-.353-.29-.733.097-1.09.28-.26.863-.8 1.807-.22.603.37 1.166.667 1.666.5.33-.11.48-.303.094-.87a1.128 1.128 0 0 1-.214-.73c.067-.776.687-.84 1.164-1.2.466-.356.68-.943.546-1.457-.106-.413-.51-.873-1.28-1.01a7.49 7.49 0 0 1 6.524 7.434"
                          transform="translate(354 143.5)"
                        ></path>
                        <path
                          d="M104.107 415.696A7.498 7.498 0 0 1 94.5 408.5a7.48 7.48 0 0 1 3.407-6.283 5.474 5.474 0 0 0-1.653 2.334c-.753 2.217-.217 4.075 2.29 4.075.833 0 1.4.561 1.333 2.375-.013.403.52 1.78 2.45 1.89.7.04 1.184 1.053 1.33 1.74.06.29.127.65.257.97a.174.174 0 0 0 .193.096"
                          transform="translate(354 143.5)"
                        ></path>
                        <path
                          fill-rule="nonzero"
                          d="M110 408.5a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-1 0a7 7 0 1 0-14 0 7 7 0 0 0 14 0z"
                          transform="translate(354 143.5)"
                        ></path>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <div class="post-more">
              <button class="btn-show-post-more">
                <i class="icon pi pi-ellipsis-h"></i>
              </button>
            </div>
          </div>
          <div class="post-content">
            {{ postData.content }}
          </div>
          <div class="post-media">
            <template v-if="postData.postMedias.length >= 4">
              <div class="grid grid-cols-2 gap-1">
                <div class="h-1/2" v-for="index in 4" :key="index">
                  <img
                    class="w-full h-62 object-cover"
                    :src="postData.postMedias[index].url"
                    alt=""
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="post-overlay-create-comment p-5 pt-2">
        <div class="create-comment-container mt-2">
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
export default {
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
        @apply w-1 absolute left-0;
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
    .create-comment-container {
      @apply flex items-center;
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
</style>
