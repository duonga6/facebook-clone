<template>
  <div class="group-discuss-bg">
    <div class="group-discuss-container">
      <div class="group-discuss-post">
        <GroupCreatePost></GroupCreatePost>
        <GroupPost></GroupPost>
      </div>
      <div class="group-discuss-info" v-if="groupInfo">
        <div class="group-introduce">
          <div class="group-introduce-heading">Giới thiệu</div>
          <div class="group-introduce-name">{{ groupInfo.name }}</div>
          <div class="group-introduce-type">
            <i class="group-type-icon pi pi-globe"></i>
            <div class="group-type-info" v-if="groupInfo.isPublic">
              <div class="group-type-name">Công khai</div>
              <div class="group-type-desc">
                Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì
                họ đăng.
              </div>
            </div>
            <div class="group-type-info" v-else>
              <div class="group-type-name">Riêng tư</div>
              <div class="group-type-desc">
                Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ
                đăng.
              </div>
            </div>
          </div>
        </div>
        <div class="group-new-media">
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
            to="#"
            v-if="mediaNew.total > 4"
            class="new-media-show-more btn"
          >
            Xem tất cả
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const groupInfo = computed(() => store.getters["group/getGroupInfo"]);
    const mediaNew = computed(() => store.getters["group/getMediaState"]);

    return {
      groupInfo,
      mediaNew,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-discuss-bg {
  @apply bg-gray-200;
}
.group-discuss-container {
  max-width: 1250px;
  @apply px-8 pt-4 mx-auto grid grid-cols-10 gap-4 bg-gray-200;

  .group-discuss-post {
    @apply col-span-6;
  }

  .group-discuss-info {
    @apply col-span-4;

    .group-introduce {
      @apply p-4 rounded-lg border bg-white;

      .group-introduce-heading {
        @apply font-semibold text-17;
      }
      .group-introduce-name {
        @apply text-15 mt-4;
      }

      .group-introduce-type {
        @apply flex items-start mt-4;
        .group-type-icon {
          @apply font-semibold leading-6;
        }
        .group-type-info {
          @apply ms-3;

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
