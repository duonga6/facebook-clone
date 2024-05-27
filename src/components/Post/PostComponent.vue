<template>
  <div class="post-container">
    <PostHeader
      :data="post"
      @onClickEditPost="handleShowEditPost"
      @onClickDeletePost="handleDeletePost"
      @onClickReport="isShowReport = true"
    ></PostHeader>
    <PostContent :data="post.content"></PostContent>
    <PostMedia :data="post.postMedias" :postId="post.id"></PostMedia>
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
            <img :src="reaction.iconUrl" />
          </li>
        </ul>
        <div class="post-reaction-count" v-if="postReactions.total > 1">
          {{ postReactions.total }}
        </div>
      </div>
      <div class="post-comment-count" v-if="post.comment.totalComment > 0">
        {{ post.comment.totalComment }} bình luận
      </div>
    </div>
    <div class="mt-4" v-else></div>
    <div class="post-action">
      <div
        class="post-action-item action--reaction"
        @mouseenter="onHoverReaction"
        @mouseleave="onCloseReaction"
        @click="handleClickReaction"
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
            style="
              background-image: url('/src/images/icons/post-icon.png');
              background-position: 0px -571px;
              background-size: auto;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              display: inline-block;
              filter: invert(8%) sepia(10%) saturate(200%) saturate(200%)
                saturate(166%) hue-rotate(177deg) brightness(104%) contrast(91%);
            "
          ></i>
        </div>
        <div class="post-action-text" @click="handleClickCreateComment">
          Bình luận
        </div>
      </div>
      <!-- <div class="post-action-item action-share" @click="handleSharePost"> -->
      <div
        class="post-action-item action-share"
        @click="isShowShareOptions = !isShowShareOptions"
        v-click-outside="() => (isShowShareOptions = false)"
      >
        <div class="post-action-icon">
          <i
            style="
              background-image: url('/src/images/icons/post-icon.png');
              background-position: 0px -906px;
              background-size: auto;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              display: block;
              filter: invert(8%) sepia(10%) saturate(200%) saturate(200%)
                saturate(166%) hue-rotate(177deg) brightness(104%) contrast(91%);
            "
          ></i>
        </div>
        <div class="post-action-text">Chia sẻ</div>
        <div class="post-share-options" v-if="isShowShareOptions">
          <TriangleArrow
            :style="'bottom: calc(100% - 1px); left: 50%;'"
          ></TriangleArrow>
          <div class="share-option-item">
            <div class="share-option-icon">
              <i
                style="
                  background-image: url('/src/images/icons/post-icon.png');
                  background-position: 0px -592px;
                  background-size: auto;
                  width: 20px;
                  height: 20px;
                  background-repeat: no-repeat;
                  display: block;
                  filter: invert(8%) sepia(10%) saturate(200%) saturate(200%)
                    saturate(166%) hue-rotate(177deg) brightness(104%)
                    contrast(91%);
                "
              ></i>
            </div>
            <div class="share-option-text" @click="handleSharePost">
              Chia sẻ lên bảng tin
            </div>
          </div>
          <div class="share-option-item">
            <div class="share-option-icon">
              <i
                style="
                  background-image: url('/src/images/icons/post-icon.png');
                  background-position: 0px -655px;
                  background-size: auto;
                  width: 20px;
                  height: 20px;
                  background-repeat: no-repeat;
                  display: inline-block;
                  filter: invert(8%) sepia(10%) saturate(200%) saturate(200%)
                    saturate(166%) hue-rotate(177deg) brightness(104%)
                    contrast(91%);
                "
              ></i>
            </div>
            <div
              class="share-option-text"
              @click="isShowSelectGroupShare = true"
            >
              Chia sẻ lên nhóm
            </div>
          </div>
        </div>
      </div>
    </div>
    <PostComment
      :comment="post.comment"
      :postId="post.id"
      :storeName="storeName"
    ></PostComment>
    <CreateComment :storeName="storeName" :postId="post.id"></CreateComment>
  </div>
  <PostEditor
    v-if="isShowPostEditor"
    :data="post"
    :action="actionPostEditor"
    :groupShareId="groupShareId"
    @closePostEditor="onClosePostEditor"
    @submittedForm="onSubmitPostEditor"
  ></PostEditor>
  <SelectGroupShare
    v-if="isShowSelectGroupShare"
    @onSeletedGroup="onSeletedGroupShare"
    @onClose="() => (isShowSelectGroupShare = false)"
  ></SelectGroupShare>
  <ReportComponent
    v-if="isShowReport"
    :title="'Báo cáo bài viết'"
    :reportType="REPORT_TYPE.POST"
    :relationId="post.id"
    @onClose="isShowReport = false"
    @onSubmit="isShowReport = false"
  ></ReportComponent>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import tokenService from "@/services/token.service";
import { toastAlert } from "@/utilities/toastAlert";
import { PostUtils } from "@/store/postUtils";
import { POST_EDITOR_TYPE, REPORT_TYPE } from "@/constants";

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
    const isShowPostEditor = ref(false);
    const actionPostEditor = ref(null);
    const isShowShareOptions = ref(false);
    const isShowSelectGroupShare = ref(false);
    const isShowReport = ref(false);

    // Data variables
    const groupShareId = ref(null);
    const commentInputEl = ref(null);
    const commentInput = ref(null);
    const commentShowOverviewCount = ref(0);
    const user = tokenService.getUser();
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

    const postMediaShow = props.post.postMedias.slice(0, 4);

    const postDate = new Date(props.post.createdAt);

    // Timer show reaction
    let timerHoverReaction;

    // Hiện chọn reaction khi hover nút like
    function onHoverReaction() {
      if (!isShowReaction.value) {
        timerHoverReaction = setTimeout(() => {
          isShowReaction.value = true;
        }, 500);
      }
    }

    // Ẩn chọn reaction
    function onCloseReaction() {
      clearTimeout(timerHoverReaction);
      setTimeout(() => {
        isShowReaction.value = false;
      }, 200);
    }

    // Click nút like, User đã thả reaction ? xóa : thêm
    function handleClickReaction() {
      onCloseReaction();

      if (!userReacted.value.reaction) {
        createReaction();
      } else {
        deleteReaction();
      }
    }

    // User chọn reaction khi hover nút like
    function handleSelectReaction(id) {
      clearTimeout(timerHoverReaction);
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

    function onClosePostEditor() {
      isShowPostEditor.value = false;
    }

    function handleShowEditPost() {
      actionPostEditor.value = POST_EDITOR_TYPE.UPDATE;
      isShowPostEditor.value = true;
    }

    async function onSubmitPostEditor(payLoad) {
      if (payLoad.action == POST_EDITOR_TYPE.SHARE) {
        await store.dispatch(`${props.storeName}/createPost`, payLoad.data);

        console.log(payLoad);
      } else {
        const postMedias = payLoad.data.postMedias;

        const currentPostMediasId = props.post.postMedias.map((x) => x.id);
        const newPostMediasId = postMedias.map((x) => x.id);

        const postMediasRemove = currentPostMediasId.filter(
          (x) => !newPostMediasId.includes(x)
        );

        const postMediasAdd = postMedias.filter(
          (x) => !currentPostMediasId.includes(x.id)
        );

        const updatePostData = {
          content: payLoad.data.content,
          mediasDelete: postMediasRemove,
          mediasAdd: postMediasAdd,
          access: payLoad.data.access,
        };

        await store.dispatch(`${props.storeName}/updatePost`, {
          id: props.post.id,
          data: updatePostData,
        });
      }
      isShowPostEditor.value = false;
    }

    function handleDeletePost() {
      store.dispatch(`${props.storeName}/deletePost`, {
        id: props.post.id,
      });
    }

    function onSeletedGroupShare(id) {
      isShowSelectGroupShare.value = false;
      groupShareId.value = id;
      actionPostEditor.value = POST_EDITOR_TYPE.SHARE;
      isShowPostEditor.value = true;
    }

    function handleSharePost() {
      actionPostEditor.value = POST_EDITOR_TYPE.SHARE;
      isShowPostEditor.value = true;
    }

    return {
      isLoaded,
      isShowReaction,
      isLoadingComment,
      isShowPostEditor,
      isShowShareOptions,
      postDate,
      userReacted,
      postReactions,
      user,
      commentInput,
      commentInputEl,
      commentShowOverviewCount,
      commentShowBelow,
      postMediaShow,
      actionPostEditor,
      isShowSelectGroupShare,
      groupShareId,
      isShowReport,
      REPORT_TYPE,
      onHoverReaction,
      onCloseReaction,
      onCommentChange,
      createComment,
      handleSelectReaction,
      handleClickReaction,
      handleClickShowMoreComment,
      onSubmitPostEditor,
      handleClickCreateComment,
      generateClassMedias,
      onClosePostEditor,
      handleShowEditPost,
      handleDeletePost,
      onSeletedGroupShare,
      handleSharePost,
    };
  },
};

function generateClassMedias(totalItems, index = null) {
  if (index == null) {
    return `grid-cols-2`;
  }

  if (totalItems % 2 == 1 && index == 0) {
    return "col-span-2";
  }

  return "col-span-1";
}
</script>

<style lang="scss" scoped>
.post-container {
  @apply bg-white py-2.5 pb-0 rounded-lg border border-gray-200 mb-4;

  .post-reaction-comment {
    @apply mx-4 py-3 flex justify-between items-center;

    .post-reaction {
      @apply flex items-center;

      .post-reaction-list {
        @apply flex;

        .post-reaction-item {
          img {
            width: 18px;
            height: 18px;
          }
        }
      }
      .post-reaction-count {
        @apply text-15 leading-15 text-gray-500 ms-1 cursor-default;
      }
    }

    .post-comment-count {
      @apply text-15 text-gray-500;
    }
  }

  .post-action {
    @apply mx-4 py-1 border-t border-b;

    @apply flex justify-around;

    .post-action-item {
      @apply flex-1 flex items-center justify-center py-0.5 rounded-lg  cursor-pointer text-gray-600 transition-all relative;

      &:not(:has(.post-share-options:hover)):hover {
        @apply bg-gray-100;
      }

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

      .post-share-options {
        @apply absolute top-12 right-0 w-52 bg-white rounded-lg shadow-custom-md z-11 p-2;

        .share-option-item {
          @apply flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-all;

          .share-option-icon {
          }
          .share-option-text {
            @apply text-15 font-semibold;
          }
        }
      }
    }
  }

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
}
</style>
