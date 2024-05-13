<template>
  <div class="group-discuss-container" v-if="groupInfo">
    <div class="group-discuss-post">
      <GroupCreatePost
        v-if="groupInfo && groupInfo.currentMember"
      ></GroupCreatePost>
      <GroupPost></GroupPost>
      <div
        class="group-notification-join"
        v-if="!groupInfo.isPublic && !groupInfo.currentMember"
      >
        <div class="group-notification-image">
          <img src="/src/images/icons/permission-denied.svg" alt="" />
        </div>
        <div class="group-notification-info">
          <div class="notification-info-header">Đây là nhóm riêng tư</div>
          <div class="notification-info-content">
            Hãy tham gia nhóm này để xem hoặc cùng thảo luận nhé.
          </div>
        </div>
      </div>
    </div>
    <div class="group-discuss-info" v-if="groupInfo">
      <div class="group-introduce">
        <div class="group-introduce-heading">
          <div class="introduce-heading-text">Giới thiệu</div>
          <div
            class="introduce-heading-action"
            v-if="groupInfo.currentMember?.isSuperAdmin"
          >
            <button class="introduce-action-btn" @click="handleShowEditGroup">
              <i class="introduce-action-icon pi pi-pencil" />
            </button>
          </div>
        </div>
        <div class="group-introduce-name">{{ groupInfo.name }}</div>
        <div class="group-introduce-type" v-if="groupInfo.isPublic">
          <i
            class="group-type-icon"
            style="
              background-image: url('/src/images/icons/group-icon.png');
              background-position: 0px -361px;
              background-size: auto;
              width: 16px;
              height: 16px;
              background-repeat: no-repeat;
              display: block;
            "
          ></i>
          <div class="group-type-info">
            <div class="group-type-name">Công khai</div>
            <div class="group-type-desc">
              Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì
              họ đăng.
            </div>
          </div>
        </div>
        <div class="group-introduce-type" v-else>
          <i
            class="group-type-icon"
            style="
              background-image: url('/src/images/icons/group-icon2.png');
              background-position: 0px -271px;
              background-size: auto;
              width: 16px;
              height: 16px;
              background-repeat: no-repeat;
              display: block;
            "
          ></i>
          <div class="group-type-info">
            <div class="group-type-name">Riêng tư</div>
            <div class="group-type-desc">
              Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ
              đăng.
            </div>
          </div>
        </div>
      </div>
      <div
        class="group-new-media"
        v-if="!(!groupInfo.isPublic && !groupInfo.currentMember)"
      >
        <div class="new-media-heading">File phương tiện mới đây</div>
        <div class="new-media-list">
          <router-link
            :to="{
              name: 'post-detail',
              params: {
                id: media.postId,
              },
              query: {
                mediaId: media.id,
              },
            }"
            class="new-media-item"
            v-for="media in mediaNew.data.slice(0, 4)"
            :key="media.id"
          >
            <img v-if="media.mediaTypeId == 2" :src="media.url" alt="" />
            <video v-if="media.mediaTypeId == 3" :src="media.url"></video>
          </router-link>
        </div>
        <router-link
          :to="{
            name: 'group-details-media',
            params: {
              id: groupInfo.id,
            },
          }"
          v-if="mediaNew.total > 4"
          class="new-media-show-more btn"
        >
          Xem tất cả
        </router-link>
      </div>
    </div>
  </div>
  <EditGroup
    v-if="isShowEditGroup"
    :data="groupInfo"
    @onClose="prehandleCloseEditGroup"
    @onSubmit="onSubmitedEditGroup"
  ></EditGroup>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const groupInfo = computed(() => store.getters["group/getGroupInfo"]);
    const mediaNew = computed(() => store.getters["group/getMediaState"]);
    const isShowEditGroup = ref(false);

    function handleShowEditGroup() {
      if (groupInfo.value) {
        isShowEditGroup.value = true;
      }
    }

    function prehandleCloseEditGroup() {
      isShowEditGroup.value = false;
    }

    function onSubmitedEditGroup(data) {
      console.log(data);
    }

    return {
      groupInfo,
      mediaNew,
      isShowEditGroup,
      handleShowEditGroup,
      prehandleCloseEditGroup,
      onSubmitedEditGroup,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-discuss-container {
  max-width: 1250px;
  @apply px-8 mx-auto grid grid-cols-10 gap-4 bg-gray-200;

  .group-discuss-post {
    @apply col-span-6;

    .group-notification-join {
      @apply bg-white rounded-lg border border-gray-100 p-4;

      .group-notification-image {
        @apply w-40 h-40 mx-auto;

        img {
          @apply w-full h-full object-contain;
        }
      }
      .group-notification-info {
        @apply text-center;

        .notification-info-header {
          @apply font-bold text-gray-600 text-xl;
        }

        .notification-info-content {
          @apply text-15 text-gray-600;
        }
      }
    }
  }

  .group-discuss-info {
    @apply col-span-4;

    .group-introduce {
      @apply p-4 rounded-lg border bg-white;

      .group-introduce-heading {
        @apply flex items-center justify-between;

        .introduce-heading-text {
          @apply font-semibold text-17;
        }

        .introduce-heading-action {
          .introduce-action-btn {
            @apply w-8 h-8 flex items-center justify-center;

            .introduce-action-icon {
              @apply text-15 font-semibold;
            }
          }
        }
      }

      .group-introduce-name {
        @apply text-15 mt-2;
      }

      .group-introduce-type {
        @apply flex items-start mt-4;
        .group-type-icon {
          @apply my-1;
        }
        .group-type-info {
          @apply ms-3 flex-1;

          .group-type-name {
            @apply text-17 font-semibold leading-6;
          }
          .group-type-desc {
            @apply text-15 leading-5;
          }
        }
      }
    }
    .group-new-media {
      @apply mt-4 p-4 bg-white rounded-lg;

      .new-media-heading {
        @apply text-17 font-semibold;
      }

      .new-media-list {
        @apply grid grid-cols-2 gap-2 mt-2;

        .new-media-item {
          @apply col-span-1 rounded-lg overflow-hidden;

          img,
          video {
            @apply w-full h-full aspect-square object-cover;
          }
        }
      }

      .new-media-show-more {
        @apply bg-gray-200 text-center mt-4 block;
      }
    }
  }
}
</style>
