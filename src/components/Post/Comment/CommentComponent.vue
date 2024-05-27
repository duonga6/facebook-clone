<template>
  <div class="comment-item" v-if="post">
    <div :class="isChild ? 'w-7 h-7' : 'w-8 h-8'" class="user-avatar">
      <img :src="comment.user.avatarUrl" alt="" />
    </div>
    <div class="main-comment" v-if="!isShowEditComment">
      <div
        class="comment-content"
        @mouseenter="onHoverComment"
        @mouseleave="onLeaveComment"
      >
        <router-link
          :to="{
            name: 'profile',
            params: {
              id: comment.user.id,
            },
          }"
          class="user-name"
        >
          {{ comment.user.firstName + " " + comment.user.lastName }}
        </router-link>
        <pre class="main-content">{{ comment.content }}</pre>
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
              v-if="user.id == comment.user.id"
              @click="handleEditComment"
              class="comment-more-item"
            >
              Chỉnh sửa
            </li>
            <li
              v-if="user.id == comment.user.id || user.id == post.user.id"
              @click="handleDeleteComment"
              class="comment-more-item"
            >
              Xóa
            </li>
            <li @click="isShowReport = true" class="comment-more-item">
              Báo cáo
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
            <ReactionComponent
              @onSelectReaction="handleSelectReaction"
            ></ReactionComponent>
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
        <LoadingComponent
          :classCss="'ms-10 w-6 h-6'"
          v-if="isLoadingChildComment"
        ></LoadingComponent>
        <CommentComponent
          v-for="childComment in comment.childComment.comments"
          :key="childComment.id"
          :comment="childComment"
          :isChild="true"
          :storeName="storeName"
        ></CommentComponent>
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
                @keydown.enter.exact="handleCreateReplyComment"
                @input="onInputChangeHeight"
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
    <EditComment
      v-if="isShowEditComment"
      :data="comment.content"
      @onSubmitEditComment="onSubmitEditComment"
      @onCancelEditComment="onCancelEditComment"
    ></EditComment>
  </div>

  <ReportComponent
    v-if="isShowReport"
    :title="'Báo cáo bình luận'"
    :reportType="REPORT_TYPE.COMMENT"
    :relationId="comment.id"
    @onClose="isShowReport = false"
    @onSubmit="isShowReport = false"
  ></ReportComponent>
</template>

<script>
import { computed, onMounted, reactive, ref } from "vue";
import { convertDateDisplay } from "@/utilities/dateUtils";
import { useStore } from "vuex";
import tokenService from "@/services/token.service";
import { toastAlert } from "@/utilities/toastAlert";
import { PostUtils } from "@/store/postUtils";
import { onInputChangeHeight } from "@/utilities/inputUtils";
import { REPORT_TYPE } from "@/constants/index";

export default {
  props: {
    comment: {
      type: Object,
    },
    isChild: {
      type: Boolean,
      default: false,
    },
    storeName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const reactions = computed(() => store.getters["reaction/getReactions"]);
    const post = computed(() =>
      store.getters[props.storeName + "/getPostById"](props.comment.postId)
    );

    // Status variables
    const isShowReaction = ref(false);
    const isShowCommentMore = ref(false);
    const isShowCommentMoreList = ref(false);
    const isShowReplyComment = ref(false);
    const isLoadingChildComment = ref(false);
    const isShowChildComment = ref(false);
    const isShowEditComment = ref(false);
    const isShowReport = ref(false);

    // Data variables
    const user = tokenService.getUser();
    const commentInput = ref(null);
    const commentInputEl = ref(null);
    let defaultHeightInput;
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
      const commentReactionIds = props.comment.reaction.reactions
        ? props.comment.reaction.reactions.map((item) => item.reactionId)
        : null;

      return {
        reactions: reactions.value.filter((x) =>
          commentReactionIds?.includes(x.id)
        ),
        total: props.comment.reaction.reactions.reduce(
          (total, item) => total + item.total,
          0
        ),
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
    async function showChildComment() {
      try {
        isShowChildComment.value = true;
        isLoadingChildComment.value = true;
        const res = await PostUtils.getCommentChild(
          props.comment.postId,
          props.comment.childComment.pageSize,
          props.comment.childComment.endCursor,
          props.comment.id,
          props.comment.path
        );

        store.dispatch(`${props.storeName}/setComments`, {
          path: props.comment.path,
          postId: props.comment.postId,
          data: res,
        });
      } catch (error) {
        toastAlert.error(error);
      } finally {
        isLoadingChildComment.value = false;
      }
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
      store.dispatch(`${props.storeName}/deleteCommentReaction`, {
        path: props.comment.path,
        postId: props.comment.postId,
        reactionId: userReacted.value.reaction.id,
        commentReactionId: userReacted.value.id,
      });
    }

    function createReaction(id) {
      store.dispatch(`${props.storeName}/createCommentReaction`, {
        path: props.comment.path,
        data: {
          commentId: props.comment.id,
          reactionId: id,
        },
        postId: props.comment.postId,
      });
    }

    function updateReaction(id) {
      store.dispatch(`${props.storeName}/updateCommentReaction`, {
        postId: props.comment.postId,
        path: props.comment.path,
        reactionIdOld: userReacted.value.reaction.id,
        data: {
          reactionId: id,
        },
        commentReactionId: userReacted.value.id,
      });
    }

    // CRUD comment
    function handleShowReplyComment() {
      isShowReplyComment.value = true;
      setTimeout(() => {
        commentInputEl.value.focus();
      }, 1);
    }

    function handleCreateReplyComment(e) {
      e.preventDefault();
      if (commentInput.value && commentInput.value.trim()) {
        commentInputEl.value.style.height = defaultHeightInput;
        isShowReplyComment.value = false;
        store.dispatch(`${props.storeName}/createComment`, {
          data: {
            content: commentInput.value.trim(),
            postId: props.comment.postId,
            parentCommentId: props.comment.id,
          },
          path: props.comment.path,
        });
        commentInput.value = null;
      }
    }

    function handleEditComment() {
      isShowEditComment.value = true;
    }

    async function onSubmitEditComment(data) {
      await store.dispatch(props.storeName + "/updateComment", {
        content: data.trim(),
        commentId: props.comment.id,
        path: props.comment.path,
      });

      isShowEditComment.value = false;
    }

    function onCancelEditComment() {
      isShowEditComment.value = false;
    }

    function handleDeleteComment() {
      store.dispatch(`${props.storeName}/deleteComment`, {
        commentId: props.comment.id,
        postId: props.comment.postId,
        path: props.comment.path,
      });
    }

    onMounted(() => {
      defaultHeightInput = commentInputEl.value.style.height;
    });

    return {
      isShowReport,
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
      showChildComment,
      commentReactions,
      userReacted,
      isLoadingChildComment,
      post,
      isShowEditComment,
      onSubmitEditComment,
      onCancelEditComment,
      handleEditComment,
      onInputChangeHeight,
      REPORT_TYPE,
    };
  },
};
</script>

<style lang="scss" scoped>
.comment-item {
  @apply flex z-10;

  .user-avatar {
    @apply rounded-full overflow-hidden border border-gray-200 me-2;

    img {
      @apply w-full h-full object-cover;
    }
  }

  .main-comment {
    @apply flex-1;

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

      @apply inline-flex flex-col bg-gray-100 rounded-xl py-1.5 px-3 pr-5 relative;

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
