<template>
  <div class="comment-item flex">
    <div class="user-avatar w-8 h-8 rounded-full overflow-hidden">
      <img
        class="w-full h-full object-cover"
        :src="commentsData.user.avatarUrl"
        alt=""
      />
    </div>
    <div class="main-comment ms-2">
      <div
        class="comment-content inline-flex flex-col bg-gray-100 rounded-2xl py-1.5 px-4 relative"
      >
        <div class="user-name text-13 font-semibold leading-15">
          {{ commentsData.user.fullName }}
        </div>
        <div class="main-content text-15">
          {{ commentsData.content }}
        </div>
        <div
          v-if="
            commentsData.reaction &&
            commentsData.reaction.reactionTypes.length > 0
          "
          class="absolute -bottom-1 left-92"
        >
          <div class="comment-reaction-list flex">
            <div
              v-for="reaction in commentsData.reaction.reactionTypes"
              :key="reaction.id"
              class="comment-reaction-item"
            >
              <div
                class="reaction-img w-5 h-5 bg-white rounded-full p-0.5 -ms-0.5"
              >
                <img :src="reaction.iconUrl" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="comment-info mt-0.5 flex space-x-2 ms-4 text-12 text-gray-500"
      >
        <div class="day-ago hover:underline cursor-pointer">
          {{ convertDateDisplay(commentsData.createdAt) }}
        </div>
        <div
          class="reaction font-bold cursor-pointer relative"
          @mouseenter="onHoverReaction"
          @mouseleave="onCloseReaction"
          @click="onClickReaction"
        >
          <template
            v-if="commentsData.reaction && commentsData.reaction.userReacted"
          >
            <span
              class="hover:underline"
              :style="{
                color: commentsData.reaction.userReacted.reaction.colorCode,
                'text-decoration-color':
                  commentsData.reaction.userReacted.reaction.colorCode,
              }"
              >{{ commentsData.reaction.userReacted.reaction.name }}</span
            >
          </template>
          <template v-else><span class="hover:underline">Thích</span></template>
          <div
            class="absolute bottom-4 -left-5 transition-all duration-200"
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
        <div class="reply-comment font-bold hover:underline cursor-pointer">
          Phản hồi
        </div>
      </div>
      <!-- <div v-if="comment.childrenComment" class="comment-child-list mt-1">
          <comment-component
            :comments="comment.childrenComment"
          ></comment-component>
        </div> -->
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { convertDateDisplay } from "@/utilities/dateUtils";
import CommentReactionService from "@/services/comment-reaction.service";
import ReactionComponent from "@/components/Reaction/ReactionComponent.vue";
export default {
  components: { ReactionComponent },
  props: {
    comment: {
      type: Object,
    },
  },
  setup(props) {
    const isShowReaction = ref(false);
    const commentsData = reactive(props.comment);

    function loadOverviewReaction() {
      CommentReactionService.getOverviewPostCommentReaction(commentsData.id)
        .then((res) => {
          commentsData.reaction = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }

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
      if (commentsData.reaction.userReacted) {
        if (commentsData.reaction.userReacted.reaction.id == id) {
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
      if (commentsData.reaction.userReacted) {
        deleteReaction();
      } else {
        createReaction(1);
      }
    }

    // CRUD reaction
    function deleteReaction() {
      CommentReactionService.deletePostCommentReaction(
        commentsData.reaction.userReacted.id
      )
        .then(() => {
          loadOverviewReaction();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function createReaction(id) {
      CommentReactionService.createPostCommentReaction({
        commentId: commentsData.id,
        reactionId: id,
      })
        .then(() => {
          loadOverviewReaction();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function updateReaction(id) {
      CommentReactionService.updatePostCommentReaction(
        commentsData.reaction.userReacted.id,
        {
          reactionId: id,
        }
      )
        .then(() => {
          loadOverviewReaction();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    onMounted(() => {
      loadOverviewReaction();
    });

    return {
      commentsData,
      convertDateDisplay,
      onHoverReaction,
      onCloseReaction,
      isShowReaction,
      handleSelectReaction,
      onClickReaction,
    };
  },
};
</script>
