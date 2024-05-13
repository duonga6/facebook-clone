<template>
  <div class="post-header" v-if="data.user">
    <div class="post-author">
      <div class="author-image">
        <div
          class="author-img image--user"
          :class="isSharedPost ? 'w-8 h-8' : 'w-10 h-10'"
          v-if="!data.group"
        >
          <img :src="data.user.avatarUrl" alt="" />
        </div>
        <div class="author-img image--group" v-else>
          <img class="group-img" :src="data.group.coverImage" alt="" />
          <img class="user-img" :src="data.user.avatarUrl" alt="" />
        </div>
      </div>
      <div
        class="author-info"
        v-if="data.group && data.group.name && !isInGroup"
      >
        <router-link
          :to="{
            name: 'group-details-post',
            params: {
              id: data.group.id,
            },
          }"
          class="author-name"
        >
          {{ data.group.name }}
        </router-link>
        <div class="date-post">
          <router-link
            :to="{
              name: 'profile',
              params: {
                id: data.user.id,
              },
            }"
            class="author-name"
            >{{ data.user.firstName + " " + data.user.lastName }}</router-link
          >
          <DotSplit></DotSplit>
          <div class="post-time">
            {{ convertDatePostDisplay(new Date(data.createdAt)) }}
          </div>
          <DotSplit></DotSplit>
          <AccessIcon :value="data.access"></AccessIcon>
        </div>
      </div>
      <div class="author-info" v-else>
        <p class="author-name">
          {{ data.user.firstName + " " + data.user.lastName }}
        </p>
        <div class="date-post">
          <div class="post-time">
            {{ convertDatePostDisplay(new Date(data.createdAt)) }}
          </div>
          <DotSplit></DotSplit>
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="currentColor"
            title="Đã chia sẻ với Công khai"
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
    <div
      class="post-more"
      v-if="!isSharedPost"
      v-click-outside="() => (isShowPostMore = false)"
    >
      <button
        class="post-more-btn"
        :class="isShowPostMore ? 'bg-gray-100' : ''"
        @click="handleClickShowPostMore"
      >
        <i class="post-more-icon pi pi-ellipsis-h"></i>
      </button>
      <ul class="post-more-list" v-show="isShowPostMore">
        <svg
          class="absolute top-0 right-0 -mt-5"
          fill="#fff"
          width="32px"
          height="32px"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 20.695l7.997-11.39L24 20.695z" />
        </svg>
        <li
          v-show="user.id == data.user.id"
          class="post-more-item"
          @click="handleShowEditPost"
        >
          <i class="post-more-icon pi pi-pencil"></i>
          <p class="post-more-text">Chỉnh sửa bài viết</p>
        </li>
        <li
          v-show="user.id == data.user.id"
          class="post-more-item"
          @click="handleDeletePost"
        >
          <i class="post-more-icon pi pi-trash"></i>
          <p class="post-more-text">Xóa bài viết</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import tokenService from "@/services/token.service";
import { convertDatePostDisplay } from "@/utilities/dateUtils";
import { useStore } from "vuex";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    isSharedPost: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["onClickEditPost", "onClickDeletePost"],
  setup(_, { emit }) {
    const user = tokenService.getUser();
    const isShowPostMore = ref(false);
    const store = useStore();

    const isInGroup = computed(() => store.getters["group/getGroupInfo"]);

    function handleClickShowPostMore() {
      isShowPostMore.value = !isShowPostMore.value;
    }

    function handleShowEditPost() {
      isShowPostMore.value = false;
      emit("onClickEditPost");
    }

    function handleDeletePost() {
      isShowPostMore.value = false;
      emit("onClickDeletePost");
    }

    return {
      isShowPostMore,
      user,
      isInGroup,
      handleClickShowPostMore,
      handleShowEditPost,
      convertDatePostDisplay,
      handleDeletePost,
    };
  },
};
</script>

<style lang="scss" scoped>
.post-header {
  @apply px-4 flex justify-between;

  .post-author {
    @apply flex items-center;

    .author-image {
      .author-img {
        &.image--user {
          @apply rounded-full border border-gray-200 overflow-hidden;

          img {
            @apply w-full h-full object-cover;
          }
        }

        &.image--group {
          @apply relative;

          .group-img {
            @apply w-10 h-10 rounded-lg object-cover;
          }

          .user-img {
            @apply absolute -bottom-1 -right-1 w-6 h-6 rounded-full border border-gray-50;
          }
        }
      }
    }

    .author-info {
      @apply ms-2;

      .author-name {
        @apply text-15 font-semibold leading-5;
      }

      .date-post {
        @apply text-13 text-gray-500 flex items-center space-x-1 leading-17;

        .author-name {
          @apply text-13 leading-17;
        }
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
</style>
