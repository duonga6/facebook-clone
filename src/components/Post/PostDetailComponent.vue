<template>
  <div
    class="post-container"
    :class="isMediaExist ? 'grid-cols-8 h-full-56px' : 'grid-cols-3 mt-20'"
  >
    <div class="post-media col-span-6" v-if="isMediaExist">
      <Gallery :data="post.postMedias"></Gallery>
    </div>
    <div
      class="post-main"
      :class="isMediaExist ? 'col-span-2' : 'col-start-2 col-span-1 rounded-lg'"
    >
      <PostHeader
        :data="post"
        @onClickEditPost="handleShowEditPost"
      ></PostHeader>
      <PostContent :data="post.content"></PostContent>
      <PostShare v-if="post.sharePost" :post="post.sharePost"></PostShare>

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
            <ReactionComponent
              :isShowReaction="isShowReaction"
              @onSelectReaction="handleSelectReaction"
            ></ReactionComponent>
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
          <div class="post-action-text" @click="handleClickCreateComment">
            Bình luận
          </div>
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
        <LoadingComponent
          :classCss="'ms-10 w-6 h-6 mt-2'"
          v-if="isLoadingComment"
        ></LoadingComponent>
        <div v-if="post.comment" class="comment-list space-y-1 mt-2">
          <CommentComponent
            v-for="comment in commentShowBelow"
            :key="comment.id"
            :comment="comment"
            :storeName="storeName"
          >
          </CommentComponent>
        </div>
      </div>
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
    </div>
  </div>
  <PostEditor
    v-if="isShowEditPost"
    :data="post"
    @closePostEditor="onClosePostEditor"
    :action="'Update'"
    @submittedForm="onSubmitUpdatePost"
  ></PostEditor>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import tokenService from "@/services/token.service";
import { toastAlert } from "@/utilities/toastAlert";
import { PostUtils } from "@/store/postUtils";

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    // Status variables
    const isLoadingComment = ref(false);
    const isLoaded = ref(false);
    const isShowReaction = ref(false);
    const isShowPostMore = ref(false);
    const isShowEditPost = ref(false);
    const isMediaExist = computed(() => props.post.postMedias.length > 0);

    // Data variables
    const user = tokenService.getUser();
    const reactions = computed(() => store.getters["reaction/getReactions"]);
    const commentInputEl = ref(null);
    const commentInput = ref(null);

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
      const postReactionIds = props.post.reaction.reactions
        ? props.post.reaction.reactions.map((item) => item.reactionId)
        : [];

      return {
        reactions: reactions.value.filter((x) =>
          postReactionIds.includes(x.id)
        ),
        total: props.post.reaction.reactions.reduce(
          (total, item) => total + item.total,
          0
        ),
      };
    });

    const commentShowBelow = computed(() => {
      return props.post.comment.comments;
    });

    const postDate = new Date(props.post.createdAt);

    function handleClickShowPostMore() {
      isShowPostMore.value = !isShowPostMore.value;
    }

    // Timer show reaction
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

    // ---- Reaction CRUD

    function createReaction(id = 1) {
      store.dispatch(`${props.storeName}/createUserReaction`, {
        postId: props.post.id,
        reactionId: id,
      });
    }

    function updateReaction(id) {
      store.dispatch(`${props.storeName}/updateUserReaction`, {
        id: userReacted.value.id,
        data: {
          reactionId: id,
        },
        oldReactionId: userReacted.value.reaction.id,
        postId: props.post.id,
      });
    }

    function deleteReaction() {
      if (userReacted.value) {
        store.dispatch(`${props.storeName}/deleteUserReaction`, {
          id: userReacted.value.id,
          postId: props.post.id,
          reactionId: userReacted.value.reaction.id,
        });
      } else {
        toastAlert.error("Có lỗi!");
      }
    }

    // Create comment
    function createComment() {
      if (commentInput.value) {
        if (
          store.dispatch(`${props.storeName}/createComment`, {
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

    function handleClickCreateComment() {
      commentInputEl.value.focus();
    }

    async function handleClickShowMoreComment() {
      try {
        isLoadingComment.value = true;
        const res = await PostUtils.getCommentChild(
          props.post.id,
          props.post.comment.pageSize,
          props.post.comment.endCursor
        );

        store.dispatch(`${props.storeName}/setComments`, {
          path: null,
          postId: props.post.id,
          data: res,
        });
      } catch (error) {
        toastAlert.error(error);
      } finally {
        isLoadingComment.value = false;
      }
    }

    // Set tự động height cho comment input
    function onCommentChange(e) {
      const textareaElement = e.target;
      textareaElement.style.height = 0;
      textareaElement.style.height = textareaElement.scrollHeight + "px";
    }

    // POST  Edit post

    function handleShowEditPost() {
      isShowEditPost.value = true;
      isShowPostMore.value = false;
    }

    function onClosePostEditor() {
      isShowEditPost.value = false;
    }

    function onSubmitUpdatePost(data) {
      const postMediasFilter = data.postMedias.map((item) => {
        return {
          id: item.id,
          title: item.title,
          mediaTypeId: item.mediaTypeId,
          url: item.url,
        };
      });

      const currentPostMediasId = props.post.postMedias.map((x) => x.id);
      const newPostMediasId = postMediasFilter.map((x) => x.id);

      const postMediasRemove = currentPostMediasId.filter(
        (x) => !newPostMediasId.includes(x)
      );

      const postMediasAdd = postMediasFilter.filter(
        (x) => !currentPostMediasId.includes(x.id)
      );

      const updatePostData = {
        content: data.content,
        mediasDelete: postMediasRemove,
        mediasAdd: postMediasAdd,
      };

      store
        .dispatch(`${props.storeName}/updatePost`, {
          id: props.post.id,
          data: updatePostData,
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          isShowEditPost.value = false;
        });
    }

    return {
      isLoaded,
      isShowReaction,
      isLoadingComment,
      isShowPostMore,
      isShowEditPost,
      postDate,
      userReacted,
      postReactions,
      user,
      commentInput,
      commentInputEl,
      commentShowBelow,
      isMediaExist,
      onHoverReaction,
      onCloseReaction,
      handleSelectReaction,
      onHandleClickReaction,
      onCommentChange,
      handleClickShowMoreComment,
      createComment,
      handleClickShowPostMore,
      handleShowEditPost,
      onClosePostEditor,
      onSubmitUpdatePost,
      handleClickCreateComment,
    };
  },
};
</script>

<style lang="scss" scoped>
.post-container {
  .post-media {
    @apply h-full;
  }
  @apply grid gap-0;
  .post-main {
    @apply bg-white py-2.5 pb-0 border border-gray-100 h-full flex flex-col overflow-y-hidden;
    .post-header {
      @apply px-4 flex justify-between;
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
        @apply relative;
        .post-more-btn {
          @apply w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all;
          .post-more-icon {
            @apply font-semibold text-17 text-gray-500;
          }
        }

        .post-more-list {
          @apply absolute top-10 right-0 bg-white shadow-custom-sm p-2 w-80 z-50 rounded-md;
          .post-more-item {
            @apply flex items-center space-x-4 px-3 p-2 hover:cursor-pointer hover:bg-gray-100 transition-all rounded-md;
            .post-more-icon {
              @apply font-semibold;
            }
            .post-more-text {
              @apply font-semibold text-15;
            }
          }
        }
      }
    }

    .post-content {
      @apply mt-2 px-4 text-15 leading-18 mb-2;
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
      @apply mx-4 py-2 pt-0 border-t border-gray-300 overflow-y-auto;

      &::-webkit-scrollbar {
        @apply w-1 left-0;
      }

      &::-webkit-scrollbar-thumb {
        @apply rounded-lg bg-gray-300;
      }

      &::-webkit-scrollbar-track {
        @apply hidden;
      }
    }

    .create-comment-container {
      @apply sticky bottom-0 flex items-center bg-white p-2 border-t border-gray-200;

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
