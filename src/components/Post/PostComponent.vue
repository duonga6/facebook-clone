<template>
  <div
    class="post-container"
    :class="{ 'rounded-lg border border-gray-200 shadow-sm': !isOverlay }"
  >
    <div class="post-header">
      <div class="post-author">
        <div class="author-img">
          <img :src="post.user.avatarUrl" alt="" />
        </div>
        <div class="author-info">
          <p class="author-name">
            {{ post.user.firstName + " " + post.user.lastName }}
          </p>
          <div class="date-post">
            <div class="post-time">
              {{
                post.createdAt.getDate() +
                " tháng " +
                (post.createdAt.getMonth() + 1) +
                " lúc " +
                post.createdAt.getHours() +
                ":" +
                (post.createdAt.getMinutes() < 10
                  ? "0" + post.createdAt.getMinutes()
                  : post.createdAt.getMinutes())
              }}
            </div>
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
              <title>Đã chia sẻ với Công khai</title>
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
      <div class="post-more"></div>
    </div>
    <div class="post-content">{{ post.content }}</div>
    <div class="post-media">
      <template v-if="post.postMedias.length >= 4">
        <div class="grid grid-cols-2 gap-1">
          <div class="h-1/2" v-for="index in 4" :key="index">
            <img
              class="w-full h-62 object-cover"
              :src="post.postMedias[index].url"
              alt=""
            />
          </div>
        </div>
      </template>
    </div>
    <div
      class="post-reaction-comment"
      v-if="postReactions.reactions.length > 0 || post.totalComment"
    >
      <div class="post-reaction" v-if="postReactions.reactions.length > 0">
        <ul class="post-reaction-list">
          <li
            class="post-reaction-item"
            v-for="reaction in postReactions.reactions"
            :key="reaction.id"
          >
            <img
              class="x16dsc37"
              height="18"
              role="presentation"
              :src="reaction.iconUrl"
              width="18"
            />
          </li>
        </ul>
        <div class="post-reaction-count">
          {{ postReactions.total }}
        </div>
      </div>
      <div class="post-comment-count" v-if="post.comment.totalComment > 0">
        {{ post.comment.totalComment }} bình luận
      </div>
    </div>
    <div class="post-action">
      <div
        class="post-action-item action--reaction"
        @mouseenter="onHoverReaction"
        @mouseleave="onCloseReaction"
        @click="onHandleClickReaction"
      >
        <template v-if="userReacted.reaction">
          <div class="post-action-icon">
            <img :src="userReacted.reaction.iconUrl" alt="" />
          </div>
          <div
            class="post-action-text"
            :style="{ color: userReacted.reaction.colorCode }"
          >
            {{ userReacted.reaction.name }}
          </div>
        </template>
        <template v-else>
          <div class="post-action-icon">
            <i
              data-visualcompletion="css-img"
              class="x1b0d499 x1d69dk1"
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yM/r/hkTW1TGOL4u.png?_nc_eui2=AeGkMalMnnCuQjq8wSweaCGhK0oghgF2B60rSiCGAXYHrf3usIKQVB_Hb0JAAS9ieq067UAb5z7pJNRlrypKAvUe');
                background-position: 0px -739px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="post-action-text">Thích</div>
        </template>
        <!-- Hover hiện chọn reaction -->
        <div
          class="post-reaction-create transition-all duration-200"
          :class="
            isShowReaction
              ? 'visible opacity-100 translate-y-0'
              : 'invisible opacity-0 translate-y-3'
          "
        >
          <reaction-component
            :isShowReaction="isShowReaction"
            @onSelectReaction="handleSelectReaction"
          ></reaction-component>
        </div>
      </div>
      <div class="post-action-item action--comment">
        <div class="post-action-icon">
          <i
            data-visualcompletion="css-img"
            class="x1b0d499 x1d69dk1"
            style="
              background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yM/r/hkTW1TGOL4u.png?_nc_eui2=AeGkMalMnnCuQjq8wSweaCGhK0oghgF2B60rSiCGAXYHrf3usIKQVB_Hb0JAAS9ieq067UAb5z7pJNRlrypKAvUe');
              background-position: 0px -550px;
              background-size: auto;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              display: inline-block;
            "
          ></i>
        </div>
        <div class="post-action-text">Bình luận</div>
      </div>
      <div class="post-action-item action-share">
        <div class="post-action-icon">
          <i
            data-visualcompletion="css-img"
            class="x1b0d499 x1d69dk1"
            style="
              background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yM/r/hkTW1TGOL4u.png?_nc_eui2=AeGkMalMnnCuQjq8wSweaCGhK0oghgF2B60rSiCGAXYHrf3usIKQVB_Hb0JAAS9ieq067UAb5z7pJNRlrypKAvUe');
              background-position: 0px -886px;
              background-size: auto;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              display: inline-block;
            "
          ></i>
        </div>
        <div class="post-action-text">Chia sẻ</div>
      </div>
    </div>
    <div class="post-comment">
      <button
        v-if="post.comment.hasNextPage && !isLoadingComment"
        class="font-semibold text-gray-500 text-15 mt-2 hover:underline"
        @click="handleClickShowMoreComment"
      >
        Xem thêm bình luận
      </button>
      <loading-component
        :classCss="'ms-10 w-6 h-6 mt-2'"
        v-if="isLoadingComment"
      ></loading-component>
      <div v-if="post.comment" class="comment-list space-y-1 mt-2">
        <comment-component
          v-for="comment in commentShowBelow"
          :key="comment.id"
          :comment="comment"
        >
        </comment-component>
      </div>
      <div v-if="!isOverlay" class="create-comment-container mt-2">
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
</template>

<script>
import { computed, onMounted, ref } from "vue";
import ReactionComponent from "@/components/Reaction/ReactionComponent.vue";
import { useStore } from "vuex";
import CommentComponent from "@/components/Comment/CommentComponent.vue";
import LoadingComponent from "@/components/Utils/LoadingComponent.vue";

export default {
  components: { ReactionComponent, CommentComponent, LoadingComponent },
  props: {
    post: {
      type: Object,
      required: true,
    },
    isOverlay: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const isLoadingComment = ref(false);
    const isLoaded = ref(false);
    const isShowReaction = ref(false);

    const commentInput = ref(null);
    const createCommentInput = ref(null);
    const commentShowOverviewCount = ref(0);
    const user = computed(() => store.getters["user/getUser"]);
    const reactions = computed(() => store.getters["reaction/getReactions"]);
    const userReacted = computed(() => {
      const userReactedId = props.post.reaction.userReacted
        ? props.post.reaction.userReacted.reactionId
        : null;

      return {
        reaction: reactions.value.find((x) => x.id == userReactedId),
        id: props.post.reaction.userReacted?.id,
      };
    });

    const postReactions = computed(() => {
      const postReactionIds = props.post.reaction.reactionTypes
        ? props.post.reaction.reactionTypes
        : [];

      return {
        reactions: reactions.value.filter((x) =>
          postReactionIds.includes(x.id)
        ),
        total: props.post.reaction.total,
      };
    });

    const commentShowBelow = computed(() => {
      return props.post.comment.comments;
      // return props.post.comment.comments.slice(-1);
    });

    let timerHover;

    // Hiện chọn reaction khi hover nút like
    function onHoverReaction() {
      if (!isShowReaction.value) {
        timerHover = setTimeout(() => {
          isShowReaction.value = true;
        }, 500);
      }
    }

    // Ẩn chọn reaction
    function onCloseReaction() {
      clearTimeout(timerHover);
      setTimeout(() => {
        isShowReaction.value = false;
      }, 200);
    }

    // Click nút like, User đã thả reaction ? xóa : thêm
    function onHandleClickReaction() {
      onCloseReaction();

      if (!userReacted.value.reaction) {
        createReaction();
      } else {
        deleteReaction();
      }
    }

    // User chọn reaction khi hover nút like
    function handleSelectReaction(id) {
      clearTimeout(timerHover);
      isShowReaction.value = false;

      // User chưa reaction ? thêm : cập nhật | xóa
      if (!userReacted.value.reaction) {
        createReaction(id);
      } else {
        // Reaction được chọn = reaction đã thêm ? xóa : update
        if (id != userReacted.value.reaction.id) {
          updateReaction(id);
        } else {
          deleteReaction();
        }
      }
    }

    // Set tự động height cho comment input
    function onCommentChange(e) {
      const textareaElement = e.target;
      textareaElement.style.height = 0;
      textareaElement.style.height = textareaElement.scrollHeight + "px";
    }

    // ---- Reaction CRUD

    function createReaction(id = 1) {
      store.dispatch("homePost/createUserReaction", {
        postId: props.post.id,
        reactionId: id,
      });
    }

    function updateReaction(id) {
      store.dispatch("homePost/updateUserReaction", {
        postReactionId: userReacted.value.id,
        data: {
          reactionId: id,
        },
      });
    }

    function deleteReaction() {
      if (userReacted.value) {
        store.dispatch("homePost/deleteUserReacted", {
          postReactionId: userReacted.value.id,
          postId: props.post.id,
        });
      } else {
        console.log("Lỗi: Không tìm thấy user reacted");
      }
    }

    // Create comment
    function createComment() {
      if (commentInput.value) {
        if (
          store.dispatch("homePost/createComment", {
            data: {
              content: commentInput.value,
              postId: props.post.id,
            },
            path: null,
          })
        ) {
          commentInput.value = null;
        }
      }
    }

    function handleClickShowMoreComment() {
      isLoadingComment.value = true;
      store
        .dispatch("homePost/getComment", {
          postId: props.post.id,
          pageSize: props.post.comment.pageSize,
          parent: null,
          endCursor: props.post.comment.endCursor,
        })
        .then(() => {
          isLoadingComment.value = false;
        });
    }

    onMounted(() => {
      createCommentInput.value = document.querySelector(
        "#create-comment-input"
      );
    });

    return {
      userReacted,
      postReactions,
      isLoaded,
      isShowReaction,
      isLoadingComment,
      user,
      commentInput,
      createCommentInput,
      onHoverReaction,
      onCloseReaction,
      handleSelectReaction,
      onHandleClickReaction,
      onCommentChange,
      commentShowBelow,
      commentShowOverviewCount,
      handleClickShowMoreComment,
      createComment,
    };
  },
};
</script>

<style lang="scss" scoped>
.post-container {
  @apply bg-white py-2.5 pb-0;
  .post-header {
    @apply px-4;
    .post-author {
      @apply flex items-center;
      .author-img {
        @apply rounded-full w-10 h-10 border border-gray-200;
        img {
          @apply w-full h-full object-cover rounded-full;
        }
      }
      .author-info {
        @apply ms-2;
        .author-name {
          @apply text-15 font-semibold;
        }
        .date-post {
          @apply text-13 text-gray-500 flex items-center space-x-1;
        }
      }
    }
    .post-more {
    }
  }

  .post-content {
    @apply mt-2 px-4 text-15 leading-18;
  }

  .post-media {
    @apply mt-4;
  }

  .post-reaction-comment {
    @apply px-4 py-3 flex justify-between items-center;
    .post-reaction {
      @apply flex items-center;

      .post-reaction-list {
        @apply flex;

        .post-reaction-item {
          img {
          }
        }
      }
      .post-reaction-count {
        @apply text-15 text-gray-500 ms-1 cursor-default;
      }
    }
    .post-comment-count {
      @apply text-15 text-gray-500;
    }
  }

  .post-action {
    @apply border-t mx-4 py-1 border-gray-300;
    @apply flex justify-around;
    .post-action-item {
      @apply flex-1 flex items-center justify-center py-0.5 rounded-lg  cursor-pointer text-gray-600 hover:bg-gray-100 transition-all relative;
      .post-action-icon {
        @apply mt-1;

        img {
          @apply w-6 h-6 -mt-1;
        }
      }
      .post-action-text {
        @apply ms-2 font-semibold;
      }
      .post-reaction-create {
        @apply absolute bottom-full left-0;
      }
    }
  }

  .post-comment {
    @apply mx-4 py-2 pt-0 border-t border-gray-300;
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
