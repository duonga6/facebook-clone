<template>
  <div class="friend-page-container">
    <div class="friend-navbar">
      <div class="navbar-heading">
        <div class="navbar-heading-icon">
          <i class="pi pi-arrow-left"></i>
        </div>
        <span class="navbar-heading-text">Lời mời kết bạn</span>
      </div>
      <ul class="friend-list">
        <div class="friend-count">33 Lời mời kết bạn</div>
        <li
          class="friend-item"
          v-for="friend in friendAcceptPending.data"
          :key="friend.id"
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
              <div class="friend-btn friend-btn--primary">Xác nhận</div>
              <div class="friend-btn friend-btn--remove">Xóa</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { FRIEND_TYPE } from "@/constants";
import { userService } from "@/services/user.service";
import { toastAlert } from "@/utilities/toastAlert";
import tokenService from "@/services/token.service";
import { reactive } from "vue";
import { friendshipService } from "@/services/friendship.service";
import { convertDateDisplay } from "@/utilities/dateUtils";

export default {
  setup() {
    const user = tokenService.getUser();
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

        console.log(userPendingMapped);

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
    getAcceptPending();

    return {
      friendAcceptPending,
      user,
      convertDateDisplay,
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
      @apply px-2 py-3 hover:bg-slate-100 rounded-lg cursor-pointer transition-all;
      @apply flex items-center;
      .friend-avatar {
        @apply w-14 h-14 rounded-full overflow-hidden;
        img {
          @apply w-full h-full object-cover;
        }
      }
      .friend-main {
        @apply flex flex-col flex-1 ms-3;
        .friend-info {
          @apply flex items-center justify-between mb-2;
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
            @apply flex-1 p-2 rounded-lg font-semibold text-15 text-center;

            &.friend-btn--primary {
              @apply bg-primary text-white;
            }

            &.friend-btn--remove {
              @apply bg-gray-200;
            }

            &.friend-btn-disabled {
              @apply bg-gray-200 text-gray-500;
            }
          }
        }
      }
    }
  }
}
</style>
