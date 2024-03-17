<template>
  <div class="friend-page-container">
    <div class="friend-navbar">
      <div class="navbar-heading">
        <span class="navbar-heading-text">Bạn bè</span>
        <div class="navbar-heading-icon">
          <i class="pi pi-cog" />
        </div>
      </div>
      <ul class="navbar-list">
        <li class="navbar-item active">
          <div class="navbar-item-icon">
            <i
              data-visualcompletion="css-img"
              aria-hidden="true"
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/CRLJEFo9FdO.png?_nc_eui2=AeGIFHGpeofWzn2LIni6V1-JTjs76a6-l_VOOzvprr6X9QbWXmoavjlayCtrJiVNd3sbCC24EjimHcnz9JhGaYFC');
                background-position: 0px -247px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navbar-item-text">Trang chủ</div>
          <div class="navbar-item-arrow"></div>
        </li>
        <router-link
          :to="{
            name: 'friend-request',
            params: null,
          }"
          class="navbar-item"
        >
          <div class="navbar-item-icon">
            <i
              data-visualcompletion="css-img"
              class="x1b0d499 xep6ejk"
              aria-hidden="true"
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/P9mM2ciwWWP.png?_nc_eui2=AeGEZP96V1VC8zTjOCTXfZEcugNPbDBDFjG6A09sMEMWMfqjN0TnZ2ovsFAI6XC0t8hUAjIeGRXvEkXKxHGSi9kJ');
                background-position: 0px -264px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navbar-item-text">Lời mời kết bạn</div>
          <div class="navbar-item-arrow">
            <i class="pi pi-chevron-right"></i>
          </div>
        </router-link>
        <router-link
          :to="{
            name: 'friends-suggests',
            params: null,
          }"
          class="navbar-item"
        >
          <div class="navbar-item-icon">
            <i
              data-visualcompletion="css-img"
              class="x1b0d499 xep6ejk"
              aria-hidden="true"
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/P9mM2ciwWWP.png?_nc_eui2=AeGEZP96V1VC8zTjOCTXfZEcugNPbDBDFjG6A09sMEMWMfqjN0TnZ2ovsFAI6XC0t8hUAjIeGRXvEkXKxHGSi9kJ');
                background-position: 0px -180px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navbar-item-text">Gợi ý</div>
          <div class="navbar-item-arrow">
            <i class="pi pi-chevron-right"></i>
          </div>
        </router-link>
        <router-link
          :to="{
            name: 'friends-list',
            params: null,
          }"
          class="navbar-item"
        >
          <div class="navbar-item-icon">
            <i
              data-visualcompletion="css-img"
              class="x1b0d499 xep6ejk"
              aria-hidden="true"
              style="
                background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/P9mM2ciwWWP.png?_nc_eui2=AeGEZP96V1VC8zTjOCTXfZEcugNPbDBDFjG6A09sMEMWMfqjN0TnZ2ovsFAI6XC0t8hUAjIeGRXvEkXKxHGSi9kJ');
                background-position: 0px -222px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="navbar-item-text">Tất cả bạn bè</div>
          <div class="navbar-item-arrow">
            <i class="pi pi-chevron-right"></i>
          </div>
        </router-link>
      </ul>
    </div>
    <div class="friend-type-list">
      <div class="friend-type-item">
        <div class="friend-type-heading">Lời mời kết bạn</div>
        <ul class="friend-list" v-if="friendAcceptPending.data.length">
          <li
            class="friend-item"
            v-for="item in friendAcceptPending.data"
            :key="item.id"
          >
            <router-link
              :to="{
                name: 'profile',
                params: {
                  id: item.requestUser.id,
                },
              }"
              class="friend-avatar"
            >
              <img
                class="friend-img"
                :src="item.requestUser.avatarUrl"
                alt=""
              />
            </router-link>
            <div class="friend-info">
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: item.requestUser.id,
                  },
                }"
                class="friend-name"
              >
                {{
                  item.requestUser.firstName + " " + item.requestUser.lastName
                }}
              </router-link>
              <div class="friend-action">
                <template v-if="item.status == FRIEND_TYPE.PENDING_OTHER">
                  <button
                    class="friend-btn friend-btn--accept"
                    @click="handleAcceptFriend(item.id)"
                  >
                    Xác nhận
                  </button>
                  <button
                    class="friend-btn friend-btn--remove"
                    @click="handleRefuseFriend(item.id)"
                  >
                    Xóa
                  </button>
                </template>
                <template v-else-if="item.status == FRIEND_TYPE.ACCEPTED">
                  <button class="friend-btn friend-btn--disable" disabled>
                    Đã chấp nhận lời mời
                  </button>
                </template>
              </div>
            </div>
          </li>
        </ul>
        <div class="friend-type-empty" v-else>
          <span>Không có lời mời nào</span>
        </div>
        <button
          class="load-more-btn"
          v-if="
            friendAcceptPending.pageSize * friendAcceptPending.pageNumber <
            friendAcceptPending.total
          "
          @click="getAcceptPending"
        >
          Xem thêm
          <i class="load-more-icon pi pi-angle-down"></i>
        </button>
      </div>
      <div class="friend-type-item">
        <div class="friend-type-heading">Những người bạn có thể biết</div>
        <ul class="friend-list" v-if="suggestionFriend.data">
          <li
            class="friend-item"
            v-for="friend in suggestionFriend.data"
            :key="friend.id"
          >
            <router-link
              :to="{
                name: 'profile',
                params: {
                  id: friend.id,
                },
              }"
              class="friend-avatar"
            >
              <img class="friend-img" :src="friend.avatarUrl" alt="" />
            </router-link>
            <div class="friend-info">
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: friend.id,
                  },
                }"
                class="friend-name"
              >
                {{ friend.firstName + " " + friend.lastName }}
              </router-link>
              <div class="friend-action">
                <template v-if="friend.status == FRIEND_TYPE.PENDING_ME">
                  <button class="friend-btn friend-btn--disable">
                    Đã gửi lời mời kết bạn
                  </button>
                </template>
                <template v-else>
                  <button
                    class="friend-btn friend-btn--accept"
                    @click="handleRequestFriend(friend.id)"
                  >
                    Thêm bạn bè
                  </button>
                  <button
                    class="friend-btn friend-btn--remove"
                    @click="handleDeleteSuggest(friend.id)"
                  >
                    Xóa
                  </button>
                </template>
              </div>
            </div>
          </li>
        </ul>
        <div class="friend-type-empty" v-else>
          <span>Không có gợi ý nào</span>
        </div>
        <div class="load-more-friend">
          <button
            class="load-more-btn"
            v-if="
              suggestionFriend.pageSize * suggestionFriend.pageNumber <
              suggestionFriend.total
            "
            @click="getSuggestFriends"
          >
            Xem thêm
            <i class="load-more-icon pi pi-angle-down"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { friendshipService } from "@/services/friendship.service";
import { reactive } from "vue";
import { FRIEND_TYPE } from "@/constants";
import { toastAlert } from "@/utilities/toastAlert";

export default {
  setup() {
    const friendAcceptPending = reactive({
      total: 0,
      pageSize: 14,
      pageNumber: 0,
      data: [],
    });

    const suggestionFriend = reactive({
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

        const userPendingMapped = res.data.map((item) => {
          return {
            ...item,
            status: FRIEND_TYPE.PENDING_OTHER,
          };
        });

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

    async function getSuggestFriends() {
      try {
        const res = await friendshipService.getSuggestion({
          pageSize: suggestionFriend.pageSize,
          pageNumber: suggestionFriend.pageNumber + 1,
        });

        const suggestFriendMapped = res.data.map((user) => {
          return {
            ...user,
            status: null,
          };
        });

        suggestionFriend.pageNumber++;
        suggestionFriend.total = res.totalItems;
        suggestionFriend.data = [
          ...suggestionFriend.data,
          ...suggestFriendMapped,
        ];
      } catch (err) {
        toastAlert.error(err);
      }
    }

    async function handleAcceptFriend(id) {
      const friendPending = friendAcceptPending.data.find((x) => x.id == id);
      if (friendPending) {
        try {
          const res = await friendshipService.accept(id);

          if (res.success) {
            friendPending.status = FRIEND_TYPE.ACCEPTED;
          }
        } catch (err) {
          toastAlert.error(err);
        }
      } else {
        toastAlert.error("Không tìm thấy user này");
      }
    }

    function handleRefuseFriend(id) {
      const friendPending = friendAcceptPending.data.find((x) => x.id == id);
      if (friendPending) {
        try {
          const res = friendshipService.refuseFriend(id);

          if (res.success) {
            friendAcceptPending.data = friendAcceptPending.data.filter(
              (x) => x.id != id
            );
          }
        } catch (err) {
          toastAlert.error(err);
        }
      } else {
        toastAlert.error("Không tìm thấy user này");
      }
    }

    async function handleRequestFriend(id) {
      const user = suggestionFriend.data.find((x) => x.id == id);
      if (user) {
        try {
          const res = await friendshipService.sendRequest({
            targetUserId: id,
          });

          if (res.success) {
            user.status = FRIEND_TYPE.PENDING_ME;
          }
        } catch (err) {
          toastAlert.error(err);
        }
      } else {
        toastAlert.error("Không tìm thấy user này");
      }
    }

    function handleDeleteSuggest(id) {
      const user = suggestionFriend.data.find((x) => x.id == id);
      if (user) {
        suggestionFriend.data = suggestionFriend.data.filter((x) => x.id != id);
      } else {
        toastAlert.error("Không tìm thấy user này");
      }
    }

    getAcceptPending();
    getSuggestFriends();

    return {
      FRIEND_TYPE,
      friendAcceptPending,
      suggestionFriend,
      handleAcceptFriend,
      handleRefuseFriend,
      handleRequestFriend,
      handleDeleteSuggest,
      getAcceptPending,
      getSuggestFriends,
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
  @apply w-90 border-r border-gray-200 bg-white;
  .navbar-heading {
    @apply flex items-center justify-between px-4 py-2;
    .navbar-heading-text {
      @apply text-2xl font-bold;
    }
    .navbar-heading-icon {
      @apply text-xl font-bold w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center;
    }
  }

  .navbar-list {
    @apply p-2;
    .navbar-item {
      @apply flex items-center p-2 hover:bg-gray-100 hover:cursor-pointer transition-all rounded-lg;

      &.active {
        @apply bg-gray-100;

        .navbar-item-icon {
          @apply bg-primary;

          i {
            filter: invert(100%);
          }
        }
      }

      .navbar-item-icon {
        @apply w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center;
      }
      .navbar-item-text {
        @apply font-semibold ms-2 text-17;
      }
      .navbar-item-arrow {
        @apply text-lg ms-auto text-gray-500;
      }
    }
  }
}

.friend-type-list {
  @apply flex flex-col flex-1 space-y-6 bg-gray-200 px-9 py-8 overflow-y-auto;
  .friend-type-item {
    .friend-type-heading {
      @apply text-xl font-bold;
    }
    .friend-list {
      @apply mt-4 grid grid-cols-7 gap-3;
      .friend-item {
        @apply rounded-lg overflow-hidden h-86 flex flex-col border border-gray-300;
        .friend-avatar {
          @apply aspect-square;
          .friend-img {
            @apply w-full h-full object-cover;
          }
        }
        .friend-info {
          @apply p-3 bg-white flex-1 flex flex-col border-t border-gray-300;
          .friend-name {
            @apply text-17 font-semibold;
          }
          .friend-action {
            @apply mt-auto flex flex-col space-y-2;
            .friend-btn {
              @apply w-full rounded-lg p-1.5 text-15 font-semibold;
              &.friend-btn--accept {
                @apply bg-primary text-white;
              }

              &.friend-btn--remove {
                @apply bg-gray-200;
              }

              &.friend-btn--disable {
                @apply bg-gray-200 text-gray-400;
              }
            }
          }
        }
      }
    }

    .friend-type-empty {
      @apply h-32 flex items-center justify-center font-semibold;
    }

    .load-more-friend {
      @apply flex justify-center;
      .load-more-btn {
        @apply flex items-center text-17 font-semibold text-primary hover:bg-gray-300 p-2 px-4 rounded-lg;
        .load-more-icon {
          @apply text-lg ms-1;
        }
      }
    }
  }
}
</style>
