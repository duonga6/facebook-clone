<template>
  <div class="comment-item">
    <div :class="isChild ? 'w-7 h-7' : 'w-8 h-8'" class="user-avatar">
      <img :src="comment.user.avatarUrl" alt="" />
    </div>
    <div class="main-comment">
      <div
        class="comment-content"
        @mouseenter="onHoverComment"
        @mouseleave="onLeaveComment"
      >
        <div class="user-name">
          {{ comment.user.firstName + comment.user.lastName }}
        </div>
        <div class="main-content">
          {{ comment.content }}
        </div>
        <div
          v-if="commentReactions.reactions.length > 0"
          class="comment-reaction-container"
        >
          <div class="comment-reaction-list">
            <div
              v-for="reaction in commentReactions.reactions"
              :key="reaction.id"
              class="comment-reaction-item"
            >
              <div class="reaction-img">
                <img :src="reaction.iconUrl" alt="" />
              </div>
            </div>
            <div
              class="comment-reaction-total"
              v-if="commentReactions.total > 1"
            >
              {{ commentReactions.total }}
            </div>
          </div>
        </div>
        <div
          v-show="isShowCommentMore"
          @click="handleShowCommentMore"
          class="comment-more-container"
          :class="isShowCommentMoreList ? 'bg-gray-100' : ''"
        >
          <div class="comment-more-icon">
            <i class="pi pi-ellipsis-h"></i>
          </div>
          <ul v-show="isShowCommentMoreList" class="comment-more-list">
            <svg
              class="absolute top-0 left-1/2 -translate-x-1/2 -mt-5"
              fill="#fff"
              width="32px"
              height="32px"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 20.695l7.997-11.39L24 20.695z" />
            </svg>
            <li
              v-if="user?.id == comment.user.id"
              @click.stop="handleDeleteComment"
              class="comment-more-item"
            >
              Xóa
            </li>
          </ul>
        </div>
      </div>
      <div class="comment-info">
        <div class="day-ago">
          {{ convertDateDisplay(new Date(comment.createdAt)) }}
        </div>
        <div
          class="reaction font-bold cursor-pointer relative"
          @mouseenter="onHoverReaction"
          @mouseleave="onCloseReaction"
          @click="onClickReaction"
        >
          <div v-if="userReacted.reaction">
            <span
              class="hover:underline"
              :style="{
                color: userReacted.reaction.colorCode,
                'text-decoration-color': userReacted.reaction.colorCode,
              }"
              >{{ userReacted.reaction.name }}</span
            >
          </div>
          <div v-else><span class="hover:underline">Thích</span></div>
          <div
            class="absolute bottom-4 -left-5 transition-all duration-200 z-50"
            :class="
              isShowReaction
                ? 'visible opacity-100 translate-y-0'
                : 'invisible opacity-0 translate-y-3'
            "
          >
            <reaction-component
              @onSelectReaction="handleSelectReaction"
            ></reaction-component>
          </div>
        </div>
        <div @click="handleShowReplyComment" class="reply-comment">
          Phản hồi
        </div>
      </div>
      <div
        class="child-comment-list"
        v-if="comment.childComment && comment.childComment.total > 0"
      >
        <div
          v-if="
            !isShowChildComment &&
            comment.childComment.total > comment.childComment.comments.length
          "
          class="btn-show-child-comment"
          @click="showChildComment"
        >
          <i
            class="pi pi-reply text-12 font-semibold"
            style="transform: rotateX(180deg)"
          />
          Xem
          <span v-if="comment.childComment.total > 1">thêm </span>
          {{
            comment.childComment.total - comment.childComment.comments.length
          }}
          phản hồi
        </div>
        <loading-component
          :classCss="'ms-10 w-6 h-6'"
          v-if="isLoadingChildComment"
        ></loading-component>
        <comment-component
          v-for="childComment in comment.childComment.comments"
          :key="childComment.id"
          :comment="childComment"
          :isChild="true"
        ></comment-component>
      </div>
      <div
        v-show="isShowReplyComment"
        class="reply-comment-container flex items-center my-1"
      >
        <div class="user-avatar w-7 h-7 rounded-full overflow-hidden">
          <img
            class="w-full h-full object-cover"
            :src="user.avatarUrl"
            alt=""
          />
        </div>
        <div class="reply-comment-input relative ms-2 flex-1">
          <form @submit.prevent="handleCreateReplyComment">
            <div class="flex">
              <textarea
                @input="onCommentChange"
                rows="1"
                placeholder="Viết phản hồi"
                class="comment-input outline-none bg-gray-100 placeholder:text-gray-600 text-15 ps-4 pe-12 py-1.5 rounded-2xl w-full resize-none overflow-hidden"
                v-model="commentInput"
                ref="commentInputEl"
              />
            </div>
            <div
              class="reply-send-btn absolute right-2 top-1/2 -translate-y-1/2"
            >
              <button
                type="submit"
                class="button-send flex items-center p-1.5"
                :disabled="!commentInput"
                @click="createComment"
              >
                <i
                  class="pi pi-send text-md"
                  :class="commentInput ? 'text-primary' : 'text-gray-400'"
                ></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { convertDateDisplay } from "@/utilities/dateUtils";
import ReactionComponent from "@/components/Post/Reaction/ReactionComponent.vue";
import LoadingComponent from "@/components/Utils/LoadingComponent.vue";
import { useStore } from "vuex";
export default {
  components: { ReactionComponent, LoadingComponent },
  props: {
    comment: {
      type: Object,
    },
    isChild: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const reactions = computed(() => store.getters["reaction/getReactions"]);

    // Status variables
    const isShowReaction = ref(false);
    const isShowCommentMore = ref(false);
    const isShowCommentMoreList = ref(false);
    const isShowReplyComment = ref(false);
    const isLoadingChildComment = ref(false);
    const isShowChildComment = ref(false);

    // Data variables
    const user = computed(() => store.getters["user/getUser"]);
    const commentInput = ref(null);
    const commentInputEl = ref(null);
    const commentsData = reactive({
      ...props.comment,
      childComment: {
        comments: [],
        total: 0,
        pageSize: 10,
        pageNumber: 0,
      },
    });

    const commentReactions = computed(() => {
      const commentReactionIds = props.comment.reaction?.reactionTypes
        ? props.comment.reaction.reactionTypes
        : null;

      return {
        reactions: reactions.value.filter((x) =>
          commentReactionIds?.includes(x.id)
        ),
        total: props.comment.reaction?.total ? props.comment.reaction.total : 0,
      };
    });

    const userReacted = computed(() => {
      const userReactedId = props.comment.reaction?.userReacted
        ? props.comment.reaction.userReacted.reactionId
        : null;

      return {
        reaction: reactions.value.find((x) => x.id == userReactedId),
        id: props.comment.reaction?.userReacted?.id,
      };
    });

    // Show child comment
    function showChildComment() {
      isShowChildComment.value = true;
      isLoadingChildComment.value = true;
      store
        .dispatch("post/getComment", {
          postId: props.comment.postId,
          pageSize: props.comment.childComment.pageSize,
          parentId: props.comment.id,
          endCursor: props.comment.childComment.endCursor,
          path: props.comment.path,
        })
        .then(() => {
          isLoadingChildComment.value = false;
        });
    }

    // Handle comment more
    function handleShowCommentMore() {
      isShowCommentMoreList.value = !isShowCommentMoreList.value;
    }

    function onLeaveComment() {
      if (!isShowCommentMoreList.value) {
        isShowCommentMore.value = false;
      }
    }

    function onHoverComment() {
      isShowCommentMore.value = true;
    }

    // Handle reaction

    let hoverTimer;

    function onHoverReaction() {
      if (!isShowReaction.value) {
        hoverTimer = setTimeout(() => {
          isShowReaction.value = true;
        }, 500);
      }
    }

    function onCloseReaction() {
      clearTimeout(hoverTimer);
      setTimeout(() => {
        isShowReaction.value = false;
      }, 200);
    }

    function handleSelectReaction(id) {
      clearTimeout(hoverTimer);
      isShowReaction.value = false;
      if (userReacted.value.id) {
        if (userReacted.value.id == id) {
          deleteReaction();
        } else {
          updateReaction(id);
        }
      } else {
        createReaction(id);
      }
    }

    function onClickReaction() {
      onCloseReaction();
      if (userReacted.value.id) {
        deleteReaction();
      } else {
        createReaction(1);
      }
    }

    // CRUD reaction
    function deleteReaction() {
      store.dispatch("post/deleteCommentReaction", {
        path: props.comment.path,
        commentReactionId: userReacted.value.id,
        postId: props.comment.postId,
      });
    }

    function createReaction(id) {
      store.dispatch("post/createCommentReaction", {
        path: props.comment.path,
        data: {
          commentId: props.comment.id,
          reactionId: id,
        },
        postId: props.comment.postId,
      });
    }

    function updateReaction(id) {
      store.dispatch("post/updateCommentReaction", {
        path: props.comment.path,
        data: {
          reactionId: id,
        },
        commentReactionId: userReacted.value.id,
        postId: props.comment.postId,
      });
    }

    // CRUD comment
    function handleShowReplyComment() {
      isShowReplyComment.value = true;
      setTimeout(() => {
        commentInputEl.value.focus();
      }, 1);
    }

    function handleCreateReplyComment() {
      if (commentInput.value) {
        if (
          store.dispatch("post/createComment", {
            data: {
              content: commentInput.value,
              postId: props.comment.postId,
              parentCommentId: props.comment.id,
            },
            path: props.comment.path,
          })
        ) {
          commentInput.value = null;
        }
      }
    }

    // Text area auto height
    function onCommentChange(e) {
      const textareaElement = e.target;
      textareaElement.style.height = 0;
      textareaElement.style.height = textareaElement.scrollHeight + "px";
    }

    function handleDeleteComment() {
      store.dispatch("post/deleteComment", {
        commentId: props.comment.id,
        postId: props.comment.postId,
        path: props.comment.path,
      });
    }

    function onDeleteComment(commentId) {
      commentsData.childComment.comments =
        commentsData.childComment.comments.filter(
          (item) => item.id != commentId
        );
      commentsData.childComment.total--;
    }

    return {
      commentsData,
      convertDateDisplay,
      onHoverReaction,
      onCloseReaction,
      isShowReaction,
      isShowCommentMore,
      isShowCommentMoreList,
      isShowReplyComment,
      user,
      handleSelectReaction,
      onClickReaction,
      handleShowCommentMore,
      handleDeleteComment,
      isShowChildComment,
      onLeaveComment,
      onHoverComment,
      commentInput,
      commentInputEl,
      handleShowReplyComment,
      handleCreateReplyComment,
      onDeleteComment,
      onCommentChange,
      showChildComment,
      commentReactions,
      userReacted,
      isLoadingChildComment,
    };
  },
};
</script>

<style lang="scss" scoped>
.comment-item {
  @apply flex z-10;

  .user-avatar {
    @apply rounded-full overflow-hidden border border-gray-200;

    img {
      @apply w-full h-full object-cover;
    }
  }

  .main-comment {
    @apply ms-2 flex-1;

    .comment-content {
      @apply relative;

      &::before {
        position: absolute;
        content: "";
        display: block;
        width: 20px;
        top: 0;
        bottom: 0;
        left: 100%;
      }

      @apply inline-flex flex-col bg-gray-100 rounded-2xl py-1.5 px-4 pr-5 relative;

      .user-name {
        @apply text-13 font-semibold leading-15;
      }

      .main-content {
        @apply text-15 leading-18;
      }

      .comment-reaction-container {
        @apply absolute -bottom-0.5 left-85;

        .comment-reaction-list {
          @apply flex items-center bg-white rounded-full ps-0.5 shadow-md border border-gray-50;

          .comment-reaction-item {
            .reaction-img {
              @apply w-5 h-5  p-0.5 -ms-0.5;
            }
          }

          .comment-reaction-total {
            @apply leading-15 ms-0.5 pe-1 text-13 text-gray-500;
          }
        }
      }

      .comment-more-container {
        @apply absolute left-full ms-2 right-0 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 hover:bg-gray-100 flex items-center justify-center cursor-pointer z-50;

        .comment-more-icon {
          i {
            @apply text-13 text-gray-500;
          }
        }

        .comment-more-list {
          @apply absolute top-0 mt-10 bg-white p-2 rounded-lg shadow-custom-sm;

          .comment-more-item {
            @apply px-2 py-1 rounded-md text-15 font-semibold min-w-44 hover:bg-gray-100;
          }
        }
      }
    }

    .child-comment-list {
      @apply mt-1 space-y-2;

      .btn-show-child-comment {
        @apply font-semibold text-15 text-gray-500 cursor-pointer hover:underline;
      }
    }
  }
  .comment-info {
    @apply mt-0.5 flex space-x-2 ms-4 text-12 text-gray-500;

    .day-ago {
      @apply hover:underline cursor-pointer;
    }

    .reaction {
      @apply font-bold cursor-pointer relative;
    }

    .reply-comment {
      @apply font-bold hover:underline cursor-pointer;
    }
  }
}
</style>