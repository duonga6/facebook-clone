<template>
  <div class="profile-container" v-if="userData">
    <div class="top-section">
      <div class="top-info">
        <div class="cover-image">
          <img :src="userData.coverImageUrl" alt="" />
        </div>
        <div class="user-info">
          <div class="user-avatar">
            <img :src="userData.avatarUrl" alt="" />
          </div>
          <div class="user-name">
            <div class="main-name">
              {{ userData.firstName + " " + userData.lastName }}
            </div>
            <div class="friend-count" v-if="userFriends.total > 0">
              {{ userFriends.total }} bạn bè
            </div>
          </div>
          <div class="user-action">
            <button class="add-friend-btn" v-if="loggedUserId != userId">
              <i class="btn-icon pi pi-plus"></i>
              <span class="btn-text">Kết bạn</span>
            </button>
          </div>
        </div>
        <ul class="user-navbar-list">
          <li class="user-navbar-item active">Bài viết</li>
          <li class="user-navbar-item">Giới thiệu</li>
          <li class="user-navbar-item">Ảnh</li>
          <li class="user-navbar-item">Bạn bè</li>
        </ul>
      </div>
    </div>
    <div class="bottom-section">
      <div class="bottom-section-container">
        <div class="bottom-left">
          <div class="user-introduce user-data-section">
            <div class="user-data-title">
              <div class="user-data-heading">Giới thiệu</div>
            </div>
            <ul class="user-introduce-list">
              <li class="user-introduce-item">
                <i class="user-introduce-icon pi pi-map-marker"></i>
                <div class="user-introduce-text">
                  Đến từ
                  <span class="user-introduce-strong">{{
                    userData.address
                  }}</span>
                </div>
              </li>
              <li class="user-introduce-item">
                <i class="user-introduce-icon pi pi-user"></i>
                <div class="user-introduce-text">
                  Giới tính
                  <span class="user-introduce-strong">{{
                    userData.gender
                  }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="user-images user-data-section">
            <div class="user-data-title">
              <div class="user-data-heading">Ảnh</div>
              <router-link to="/" class="user-data-button"
                >Xem tất cả ảnh</router-link
              >
            </div>
            <ul class="user-image-list">
              <li
                v-for="photo in userPhotos.data"
                :key="photo.id"
                class="user-image-item"
              >
                <img :src="photo.url" alt="" class="image-item-img" />
              </li>
            </ul>
          </div>
          <div class="user-friends user-data-section">
            <div class="user-data-title">
              <div class="user-data-heading">Bạn bè</div>
              <router-link to="/" class="user-data-button"
                >Xem tất cả bạn bè</router-link
              >
            </div>
            <ul class="user-friend-list">
              <li
                class="user-friend-item"
                v-for="friend in userFriends.data"
                :key="friend.id"
              >
                <router-link
                  :to="{
                    name: 'profile',
                    params: {
                      id: friend.id,
                    },
                  }"
                >
                  <div class="user-friend-img">
                    <img :src="friend.avatarUrl" alt="" />
                  </div>
                  <div class="user-friend-name">
                    {{ friend.firstName + " " + friend.lastName }}
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="bottom-right" v-if="userData.id">
          <profile-post :userId="userData.id"></profile-post>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/user.service";
import { useRoute } from "vue-router";
import ProfilePost from "./ProfilePostComponent.vue";
import tokenService from "@/services/token.service";
import { ref } from "vue";
import { FRIENDSHIP_STATUS, FRIEND_TYPE } from "@/constants";
import { friendshipService } from "@/services/friendship.service";
export default {
  components: { ProfilePost },
  async setup() {
    const route = useRoute();
    const loggedUserId = tokenService.getUser().id;
    const userId =
      !route.params.id || route.params.id == ""
        ? loggedUserId
        : route.params.id;
    const userData = ref({});

    const userPhotos = ref({
      total: 0,
      data: [],
    });

    const userFriends = ref({
      data: [],
      total: 0,
    });

    const friendStatus = ref({});

    async function loadUser() {
      const userRes = await userService.getById(userId);
      userData.value = userRes.data;

      const photoRes = await userService.getPhoto(userId, {
        pageSize: 9,
        pageNumber: 1,
      });

      userPhotos.value.data = photoRes.data;
      userPhotos.value.total = photoRes.totalItems;

      const userFriendRes = await friendshipService.get({
        pageSize: 9,
        pageNumber: 1,
        type: FRIEND_TYPE.ACCEPTED,
      });

      const userFriendMapped = await Promise.all(
        userFriendRes.data.map(async (item) => {
          const targetUserId =
            item.requestUserId == userId
              ? item.targetUserId
              : item.requestUserId;

          const targetUserRes = await userService.getById(targetUserId);

          return targetUserRes.data;
        })
      );

      userFriends.value.total = userFriendRes.totalItems;
      userFriends.value.data = userFriendMapped;

      if (userId == loggedUserId) {
        friendStatus.value = FRIENDSHIP_STATUS.SELF;
      } else {
        const friendStatusRes = await friendshipService.getInfo(userId);
        switch (friendStatusRes.data) {
          case null:
            friendStatus.value = FRIENDSHIP_STATUS.NOT_FRIEND;
            break;
          case 1:
            friendStatus.value = FRIENDSHIP_STATUS.PENDING;
            break;
          case 2:
            friendStatus.value = FRIENDSHIP_STATUS.ACCEPTED;
            break;
          case 3:
            friendStatus.value = FRIENDSHIP_STATUS.BLOCKED;
            break;
        }
      }
    }

    await loadUser();

    return {
      userData,
      userPhotos,
      userFriends,
      friendStatus,
      loggedUserId,
      userId,
    };
  },
};
</script>

<style lang="scss" scoped>
.profile-container {
  .top-section {
    @apply shadow-lg;
    .top-info {
      width: 1260px;
      @apply mx-auto;

      .cover-image {
        img {
          height: 460px;
          @apply w-full object-cover rounded-bl-lg rounded-br-lg;
        }
      }
      .user-info {
        @apply flex items-center mx-8 py-2 border-b-2 border-gray-200;
        .user-avatar {
          @apply w-44 h-44 -mt-24 rounded-full overflow-hidden border-4 border-white;
          img {
            @apply w-full h-full object-cover;
          }
        }
        .user-name {
          @apply ms-4;
          .main-name {
            @apply text-3xl font-bold;
          }
          .friend-count {
            @apply text-gray-500 font-semibold;
          }
        }
        .user-action {
          @apply bg-primary rounded-md px-3 ms-auto;
          .add-friend-btn {
            @apply flex items-center py-2 text-white;
            .btn-icon {
              @apply text-13 font-bold;
            }
            .btn-text {
              @apply text-15 ms-1 font-semibold;
            }
          }
        }
      }

      .user-navbar-list {
        @apply flex items-center mx-8;
        .user-navbar-item {
          @apply my-1 px-4 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-all;

          &.active {
            @apply text-primary relative;

            &::after {
              content: "";
              @apply block absolute left-0 right-0 top-full h-0.75 bg-primary;
            }
          }
        }
      }
    }
  }

  .bottom-section {
    @apply bg-gray-100;
    .bottom-section-container {
      width: 1220px;
      @apply mx-auto grid grid-cols-10 gap-4 pt-4;

      .bottom-left {
        @apply col-span-4;

        .user-data-section {
          @apply p-4 bg-white rounded-lg border border-gray-200 mb-4;
          .user-data-title {
            @apply flex items-center justify-between;
            .user-data-heading {
              @apply text-xl font-bold;
            }
            .user-data-button {
              @apply text-17 text-primary rounded-lg px-2 py-1 hover:bg-gray-100 transition-all;
            }
          }
        }

        .user-introduce-list {
          @apply mt-2;
          .user-introduce-item {
            @apply flex items-center py-0.5;
            .user-introduce-icon {
              @apply text-gray-500 text-xl;
            }
            .user-introduce-text {
              @apply text-gray-700 ms-2;
            }

            .user-introduce-strong {
              @apply font-semibold;
            }
          }
        }
        .user-images {
          .user-image-list {
            @apply grid grid-cols-3 gap-1 rounded-lg overflow-hidden mt-4;
            .user-image-item {
              @apply aspect-square;
              .image-item-img {
                @apply w-full h-full object-cover;
              }
            }
          }
        }
        .user-friends {
          .user-friend-list {
            @apply grid grid-cols-3 gap-3 mt-4;
            .user-friend-item {
              @apply mb-2;
              .user-friend-img {
                @apply aspect-square;
                img {
                  @apply w-full h-full rounded-lg object-cover;
                }
              }

              .user-friend-name {
                @apply text-13 font-semibold leading-6;
              }
            }
          }
        }
      }

      .bottom-right {
        @apply col-span-6;
        .user-post-list {
        }
      }
    }
  }
}
</style>
