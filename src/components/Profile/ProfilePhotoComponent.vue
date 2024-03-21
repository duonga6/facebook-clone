<template>
  <div class="profile-photo-container">
    <div class="profile-photo-header">
      <div class="header-title">Ảnh</div>
      <div class="user-action">
        <button class="user-action-btn" v-if="userId == loggedUserId">
          Thêm ảnh/video
        </button>
      </div>
    </div>
    <ul class="profile-photo-list grid grid-cols-6 gap-2">
      <li
        class="profile-photo-item col-span-1"
        v-for="media in photoData"
        :key="media.id"
      >
        <router-link
          class="profile-photo-link"
          :to="{
            name: 'post-detail',
            params: {
              id: media.postId,
            },
            query: {
              mediaId: media.id,
            },
          }"
        >
          <img class="profile-photo-img" :src="media.url" alt="" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import tokenService from "@/services/token.service";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const loggedUserId = tokenService.getUser().id;
    const userId = route.params.id;

    const photoData = computed(() => store.getters["profile/getPhotos"]);

    console.log(photoData.value);

    return {
      loggedUserId,
      userId,
      photoData,
    };
  },
};
</script>

<style lang="scss" scoped>
.profile-photo-container {
  @apply p-4 bg-white border border-gray-200 rounded-lg;
  .profile-photo-header {
    @apply flex items-center justify-between;
    .header-title {
      @apply text-xl font-semibold;
    }
    .user-action {
      .user-action-btn {
        @apply font-semibold text-primary;
      }
    }
  }
  .profile-photo-list {
    .profile-photo-item {
      @apply aspect-square;
      .profile-photo-link {
        @apply w-full h-full;
        .profile-photo-img {
          @apply w-full h-full object-cover;
        }
      }
    }
  }
}
</style>
