<template>
  <div class="friend-page-container">
    <div class="friend-navbar">
      <div class="navbar-heading">
        <router-link
          :to="{
            name: 'friends',
            params: null,
          }"
          class="navbar-heading-icon"
        >
          <i class="pi pi-arrow-left"></i>
        </router-link>
        <span class="navbar-heading-text">Lời mời kết bạn</span>
      </div>
      <ul class="friend-list">
        <div class="friend-count">
          {{ friendAcceptPending.data.length }} Lời mời kết bạn
        </div>
        <li
          class="friend-item"
          v-for="friend in friendAcceptPending.data"
          :key="friend.id"
          @click="showfriendProfileId(friend.user.id)"
          :class="friendProfileId == friend.user.id ? 'active' : ''"
        >
          <div class="friend-avatar">
            <img :src="friend.user.avatarUrl" alt="" />
          </div>
          <div class="friend-main">
            <div class="friend-info">
              <p class="friend-name">
                {{ friend.user.firstName + " " + friend.user.lastName }}
              </p>
              <p class="friend-date">
                {{ convertDateDisplay(friend.createdAt) }}
              </p>
            </div>
            <div class="friend-action">
              <template v-if="friend.status == FRIEND_TYPE.PENDING_OTHER">
                <button
                  class="friend-btn friend-btn--primary"
                  @click.stop="handleAcceptFriend(friend.id)"
                >
                  Xác nhận
                </button>
                <button
                  class="friend-btn friend-btn--remove"
                  @click.stop="handleRemoveFriend(friend.id)"
                >
                  Xóa
                </button>
              </template>
              <template v-else-if="friend.status == FRIEND_TYPE.ACCEPTED">
                <button
                  class="friend-btn friend-btn--notify"
                  disabled
                  @click.stop=""
                >
                  Đã chấp nhận lời mời
                </button>
              </template>
              <template v-else-if="friend.status == FRIEND_TYPE.REFUSED">
                <span class="friend-btn friend-btn--notify">Đã gỡ lời mời</span>
              </template>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="friend-profile">
      <ProfileComponent
        v-if="friendProfileId"
        :id="friendProfileId"
      ></ProfileComponent>
      <div v-else class="friend-profile-empty">
        <div class="profile-empty-img">
          <img
            src="https://www.facebook.com/images/comet/empty_states_icons/people/null_states_people_gray_wash.svg"
            alt=""
          />
        </div>
        <div class="profile-empty-text">
          Chọn tên của người mà bạn muốn xem trước trang cá nhân.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FRIEND_TYPE } from "@/constants";
import { userService } from "@/services/user.service";
import { toastAlert } from "@/utilities/toastAlert";
import tokenService from "@/services/token.service";
import { reactive, ref } from "vue";
import { friendshipService } from "@/services/friendship.service";
import { convertDateDisplay } from "@/utilities/dateUtils";

export default {
  async setup() {
    const user = tokenService.getUser();
    const friendProfileId = ref(null);
    const friendAcceptPending = reactive({
      total: 0,
      pageSize: 14,
      pageNumber: 0,
      data: [],
    });

    async function getAcceptPending() {
      try {
        const res = await friendshipService.get({
          pageSize: friendAcceptPending.pageSize,
          pageNumber: friendAcceptPending.pageNumber + 1,
          type: FRIEND_TYPE.PENDING_OTHER,
        });

        const userPendingMapped = await Promise.all(
          res.data.map(async (item) => {
            const userOtherId =
              item.requestUserId == user.id
                ? item.targetUserId
                : item.requestUserId;
            const userOtherData = await userService.getById(userOtherId);

            return {
              id: item.id,
              createdAt: item.updatedAt,
              user: userOtherData.data,
              status: FRIEND_TYPE.PENDING_OTHER,
            };
          })
        );

        friendAcceptPending.data = [
          ...friendAcceptPending.data,
          ...userPendingMapped,
        ];
        friendAcceptPending.pageNumber++;
        friendAcceptPending.total = res.totalItems;
      } catch (err) {
        toastAlert.error(err);
      }
    }

    async function showfriendProfileId(id) {
      if (
        !friendProfileId.value ||
        (friendProfileId.value && friendProfileId.value != id)
      ) {
        friendProfileId.value = id;
      }
    }

    async function handleAcceptFriend(id) {
      const friendRequest = friendAcceptPending.data.find((x) => x.id == id);
      if (friendRequest) {
        try {
          await friendshipService.accept(id);
          friendRequest.status = FRIEND_TYPE.ACCEPTED;
        } catch (err) {
          toastAlert.error(err);
        }
      } else {
        toastAlert.error("Không tìm thấy user này");
      }
    }

    async function handleRemoveFriend(id) {
      const friendRequest = friendAcceptPending.data.find((x) => x.id == id);
      if (friendRequest) {
        try {
          await friendshipService.refuseFriend(id);
          friendRequest.status = FRIEND_TYPE.REFUSED;
        } catch (err) {
          toastAlert.error(err);
        }
      } else {
        toastAlert.error("Không tìm thấy user này");
      }
    }

    await getAcceptPending();

    return {
      friendAcceptPending,
      friendProfileId,
      user,
      FRIEND_TYPE,
      convertDateDisplay,
      showfriendProfileId,
      handleAcceptFriend,
      handleRemoveFriend,
    };
  },
};
</script>

<style lang="scss" scoped>
.friend-page-container {
  height: calc(100vh - 56px);
  @apply flex;
}

.friend-navbar {
  @apply w-90 border-r border-gray-200;
  .navbar-heading {
    @apply flex items-center p-2;
    .navbar-heading-text {
      @apply ms-2 text-2xl font-bold;
    }
    .navbar-heading-icon {
      @apply text-md font-bold w-9 h-9 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all cursor-pointer;
    }
  }

  .friend-list {
    @apply p-2 px-2;
    .friend-count {
      @apply font-semibold mb-2;
    }
    .friend-item {
      &.active {
        @apply bg-slate-100;
      }

      @apply p-2.5 hover:bg-slate-100 rounded-md cursor-pointer transition-all flex items-center;
      .friend-avatar {
        @apply w-16 h-16 rounded-full overflow-hidden;
        img {
          @apply w-full h-full object-cover;
        }
      }
      .friend-main {
        @apply flex flex-col flex-1 ms-3;
        .friend-info {
          @apply flex items-center justify-between mb-1.5;
          .friend-name {
            @apply font-semibold text-15;
          }

          .friend-date {
            @apply text-gray-500 text-13;
          }
        }

        .friend-action {
          @apply flex items-center space-x-2;
          .friend-btn {
            @apply flex-1 p-1.5 rounded-lg font-semibold text-15 text-center;

            &.friend-btn--primary {
              @apply bg-primary text-white;
            }

            &.friend-btn--remove {
              @apply bg-gray-200;
            }

            &.friend-btn--notify {
              @apply font-normal text-left bg-none text-gray-500 py-1.5;
            }
          }
        }
      }
    }
  }
}

.friend-profile {
  @apply flex-1 h-full bg-gray-200 flex items-center justify-center overflow-y-auto;
  .friend-profile-empty {
    .profile-empty-img {
      @apply flex justify-center;
      img {
        @apply w-24 h-24 object-cover;
      }
    }
    .profile-empty-text {
      @apply font-bold text-xl text-gray-600;
    }
  }
}
</style>
