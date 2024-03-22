<template>
  <div class="profile-container" v-if="userData">
    <div class="top-section">
      <div class="top-info">
        <div class="cover-image">
          <img
            v-if="userData.coverImageUrl"
            :src="userData.coverImageUrl"
            alt=""
          />
          <div v-else class="cover-image-none"></div>
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
            <template v-if="friendShip.status == FRIEND_TYPE.NOT_FRIEND">
              <button
                class="add-friend-btn btn--primary"
                @click="handleRequestFriend"
              >
                <img
                  class="btn-icon"
                  src="https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/r2FA830xjtI.png?_nc_eui2=AeF8FiEA9JN6wBCKRYj0KLFCLvJBHXhZHNwu8kEdeFkc3AFyf9KO7QelJ1VsfggLZ_H2aExODmvyZfN2IPZJeEPt"
                  alt=""
                  height="16"
                  width="16"
                />
                <span class="btn-text">Thêm bạn bè</span>
              </button>
            </template>
            <template
              v-else-if="friendShip.status == FRIEND_TYPE.PENDING_OTHER"
            >
              <button
                class="add-friend-btn btn--primary"
                @click="handleAcceptFriend"
              >
                <span class="btn-text">Chấp nhận lời mời</span>
              </button>
              <button
                class="add-friend-btn btn--secondary"
                @click="handleRefuseFriend"
              >
                <span class="btn-text">Xóa lời mời</span>
              </button>
            </template>
            <template v-else-if="friendShip.status == FRIEND_TYPE.PENDING_ME">
              <button
                class="add-friend-btn btn--primary"
                @click="handleCancelRequest"
              >
                <img
                  class="btn-icon"
                  src="https://static.xx.fbcdn.net/rsrc.php/v3/yo/r/Qg9sXPTnmFb.png?_nc_eui2=AeHPOLXvfCjmO8mg2ATf3Goo70XPseqSZArvRc-x6pJkCrqKooLPT71xgMEXyo1TeOvUzjc2nBQq5VXqAZkeosB1"
                  alt=""
                  height="16"
                  width="16"
                />
                <span class="btn-text">Hủy lời mời</span>
              </button>
            </template>
            <template v-else-if="friendShip.status == FRIEND_TYPE.ACCEPTED">
              <button
                class="add-friend-btn btn--secondary cursor-pointer"
                disabled
              >
                <img
                  class="btn-icon"
                  src="https://static.xx.fbcdn.net/rsrc.php/v3/yF/r/5nzjDogBZbf.png?_nc_eui2=AeFgCUS7kICqGJnL23ZuvyGBr5jr7d_7UXGvmOvt3_tRcZHrN7Yoq1SqiKqcusNCNC0FpGaBVOaJc1ATKqGZNNvt"
                  alt=""
                  height="16"
                  width="16"
                />
                <span class="btn-text">Bạn bè</span>
              </button>
              <button
                class="add-friend-btn btn--primary"
                @click="handleAcceptFriend"
              >
                <img
                  class="btn-icon"
                  src="https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/YjBUcSAL8TC.png?_nc_eui2=AeGST8v48r_KM_1wK_FJk7NOYWMzpYRsku5hYzOlhGyS7tQP2I7aYMXxMEgeIAEI8mywcGMW2-cptWU44nI_Vb_p"
                  alt=""
                  height="16"
                  width="16"
                />
                <span class="btn-text">Nhắn tin</span>
              </button>
            </template>
          </div>
        </div>
        <ul class="user-navbar-list">
          <li>
            <router-link
              class="user-navbar-item active"
              :to="{
                name: 'profile-post',
                params: {
                  id: userId,
                },
              }"
              >Bài viết</router-link
            >
          </li>
          <li class="">
            <router-link
              class="user-navbar-item"
              :to="{
                name: 'profile-post',
                params: {
                  id: id,
                },
              }"
            >
              Giới thiệu
            </router-link>
          </li>
          <li class="">
            <router-link
              :to="{
                name: 'profile-photo',
                params: {
                  id: userId,
                },
              }"
              class="user-navbar-item"
              >Ảnh</router-link
            >
          </li>
          <li class="user-navbar-item">Video</li>
          <li class="user-navbar-item">Bạn bè</li>
        </ul>
      </div>
    </div>
    <div class="bottom-section">
      <div class="bottom-section-container">
        <div class="bottom-left col-span-4" v-if="isShowIntroduceTab">
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
              <router-link
                :to="{
                  name: 'profile-photo',
                  params: {
                    id: userId,
                  },
                }"
                class="user-data-button"
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
              <div class="user-data-button">Xem tất cả bạn bè</div>
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
        <div
          class="bottom-right"
          :class="isShowIntroduceTab ? ' col-span-6' : 'col-span-10'"
          v-if="userData.id"
        >
          <!-- <ProfilePost :userId="userData.id"></ProfilePost> -->
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/user.service";
import { useRoute } from "vue-router";
import tokenService from "@/services/token.service";
import { computed, reactive, ref } from "vue";
import { FRIEND_TYPE } from "@/constants";
import { friendshipService } from "@/services/friendship.service";
import { toastAlert } from "@/utilities/toastAlert";
import { useStore } from "vuex";
export default {
  props: {
    id: {
      type: String,
    },
  },
  async setup(props) {
    const store = useStore();
    const route = useRoute();
    const loggedUserId = tokenService.getUser().id;
    const isShowIntroduceTab = computed(() => route.name == "profile-post");

    const userId = props.id
      ? props.id
      : !route.params.id || route.params.id == ""
      ? loggedUserId
      : route.params.id;

    store.dispatch("profile/initStore", {
      userId: userId,
    });

    const userData = ref({});
    const userPhotos = ref({
      total: 0,
      data: [],
    });
    const userFriends = ref({
      data: [],
      total: 0,
    });

    const friendShip = reactive({
      id: null,
      status: null,
    });

    async function loadUser() {
      try {
        // User info
        const userRes = await userService.getById(userId);
        userData.value = userRes.data;

        const photoRes = await userService.getPhoto(userId, {
          pageSize: 9,
          pageNumber: 1,
        });

        // User photo

        userPhotos.value.data = photoRes.data;
        userPhotos.value.total = photoRes.totalItems;

        // User's friends

        const userFriendRes = await friendshipService.get({
          pageSize: 9,
          pageNumber: 1,
          type: FRIEND_TYPE.ACCEPTED,
          userId: userId,
        });

        const userFriendMapped = userFriendRes.data.map((item) => {
          return item.requestUser.id == userId
            ? item.targetUser
            : item.requestUser;
        });

        userFriends.value.total = userFriendRes.totalItems;
        userFriends.value.data = userFriendMapped;

        // friendShip

        if (userId == loggedUserId) {
          friendShip.status = FRIEND_TYPE.SELF;
        } else {
          const friendShipRes = await friendshipService.getInfo(userId);
          if (!friendShipRes.data) {
            friendShip.status = FRIEND_TYPE.NOT_FRIEND;
          } else {
            friendShip.id = friendShipRes.data.id;

            switch (friendShipRes.data.friendStatus) {
              case 1:
                friendShip.status =
                  friendShipRes.data.requestUserId == loggedUserId
                    ? FRIEND_TYPE.PENDING_ME
                    : FRIEND_TYPE.PENDING_OTHER;
                break;
              case 2:
                friendShip.status = FRIEND_TYPE.ACCEPTED;
                break;
              case 3:
                friendShip.status = FRIEND_TYPE.BLOCKED;
                break;
            }
          }
        }
      } catch (err) {
        toastAlert.error(err);
      }
    }

    async function handleRequestFriend() {
      try {
        const res = await friendshipService.sendRequest({
          targetUserId: userId,
        });

        friendShip.id = res.data.id;
        friendShip.status = FRIEND_TYPE.PENDING_ME;
      } catch (err) {
        toastAlert.error(err);
      }
    }

    async function handleAcceptFriend() {
      try {
        await friendshipService.accept(friendShip.id);
        friendShip.status = FRIEND_TYPE.ACCEPTED;
      } catch (err) {
        toastAlert.error(err);
      }
    }

    async function handleRefuseFriend() {
      try {
        await friendshipService.refuseFriend(friendShip.id);
        friendShip.status = FRIEND_TYPE.NOT_FRIEND;
      } catch (error) {
        toastAlert.error(error);
      }
    }

    async function handleCancelRequest() {
      try {
        await friendshipService.cancelSendRequest(friendShip.id);
        friendShip.status = FRIEND_TYPE.NOT_FRIEND;
      } catch (error) {
        toastAlert.error(error);
      }
    }

    await loadUser();

    return {
      userData,
      userPhotos,
      userFriends,
      friendShip,
      loggedUserId,
      userId,
      FRIEND_TYPE,
      isShowIntroduceTab,
      handleRequestFriend,
      handleAcceptFriend,
      handleRefuseFriend,
      handleCancelRequest,
    };
  },
};
</script>

<style lang="scss" scoped>
.profile-container {
  @apply w-full mt-14;
  .top-section {
    @apply shadow-lg bg-white;
    .top-info {
      width: 1260px;
      @apply mx-auto;

      .cover-image {
        @apply rounded-bl-lg rounded-br-lg overflow-hidden;
        height: 460px;
        img {
          @apply w-full object-cover;
        }
        .cover-image-none {
          @apply w-full h-full bg-gray-100;
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
          @apply ms-auto flex items-center space-x-2;
          .add-friend-btn {
            @apply flex space-x-2 items-center py-2 rounded-md px-3;

            &.btn--primary {
              @apply text-white bg-primary;

              .btn-icon {
                filter: invert(1);
              }
            }

            &.btn--secondary {
              @apply bg-gray-200;
            }

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
        .user-post-list {
        }
      }
    }
  }
}
</style>
