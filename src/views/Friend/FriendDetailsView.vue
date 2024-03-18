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
        <span
          v-if="friendType == FRIEND_TYPE.PENDING_OTHER"
          class="navbar-heading-text"
          >Lời mời kết bạn</span
        >
        <span
          v-if="friendType == FRIEND_TYPE.NOT_FRIEND"
          class="navbar-heading-text"
          >Gợi ý</span
        >
        <template v-if="friendType == FRIEND_TYPE.ACCEPTED">
          <span class="navbar-heading-text">Tất cả bạn bè</span>
          <div class="navbar-search-container">
            <i class="navbar-search-icon pi pi-search"></i>
            <input
              ref="friendSearchInputEl"
              class="navbar-search-input"
              placeholder="Tìm kiếm bạn bè"
              v-model="friendSearchInput"
            />
          </div>
        </template>
      </div>
      <ul class="friend-list" ref="listFriendsEl">
        <div class="friend-count">
          <span v-if="friendType == FRIEND_TYPE.PENDING_OTHER">
            {{ friendData.total }} Lời mời kết bạn
          </span>
          <span v-else-if="friendType == FRIEND_TYPE.ACCEPTED">
            {{ friendData.total }} Người bạn
          </span>
          <span v-else>Những người bạn có thể biết</span>
        </div>
        <li
          class="friend-item"
          v-for="friend in friendData.data"
          :key="friend.id"
          @click="handleSelectFriendItem(friend.requestUser.id)"
          :class="friendProfileId == friend.requestUser.id ? 'active' : ''"
        >
          <div class="friend-avatar">
            <img :src="friend.requestUser.avatarUrl" alt="" />
          </div>
          <div class="friend-main">
            <div class="friend-info">
              <p class="friend-name">
                {{
                  friend.requestUser.firstName +
                  " " +
                  friend.requestUser.lastName
                }}
              </p>
              <p
                class="friend-date"
                v-if="
                  friend.createdAt instanceof Date &&
                  !isNaN(friend.createdAt.valueOf()) &&
                  friendType != FRIEND_TYPE.ACCEPTED
                "
              >
                {{ convertDateDisplay(friend.createdAt) }}
              </p>
              <template v-if="friendType == FRIEND_TYPE.ACCEPTED">
                <div
                  class="friend-more"
                  @click.stop="handleShowFriendMore(friend)"
                >
                  <div class="friend-more-icon">
                    <i class="pi pi-ellipsis-h"></i>
                  </div>
                  <ul
                    class="friend-more-list"
                    v-if="friend.isShowMore"
                    v-click-outside.stop="() => closeShowFriendMore(friend)"
                  >
                    <li
                      class="friend-more-item"
                      @click.stop="handleUnfriend(friend.id)"
                    >
                      <div class="friend-more-item-icon">
                        <i
                          data-visualcompletion="css-img"
                          aria-hidden="true"
                          style="
                            background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/7kZGnNJZPk5.png?_nc_eui2=AeHznsKx4UNnHqWPKNaxWJ_n1rTbRfn8SnDWtNtF-fxKcMPUSwOWIy3qBpwaABcsN4485NrNJtXi4l12TftYDhCr');
                            background-position: 0px -42px;
                            background-size: auto;
                            width: 20px;
                            height: 20px;
                            background-repeat: no-repeat;
                            display: inline-block;
                          "
                        ></i>
                      </div>
                      <div class="friend-more-item-text">Hủy kêt bạn</div>
                    </li>
                  </ul>
                </div>
              </template>
            </div>
            <div class="friend-action">
              <template v-if="friendType == FRIEND_TYPE.PENDING_OTHER">
                <template v-if="friend.status == FRIEND_TYPE.PENDING_OTHER">
                  <button
                    class="friend-btn friend-btn--primary"
                    @click.stop="handleAcceptFriend(friend.id)"
                  >
                    Xác nhận
                  </button>
                  <button
                    class="friend-btn friend-btn--remove"
                    @click.stop="handleRefusedFriend(friend.id)"
                  >
                    Xóa
                  </button>
                </template>
                <template v-if="friend.status == FRIEND_TYPE.REFUSED">
                  <button class="friend-btn friend-btn--notify" disabled>
                    Đã gỡ lời mời kết bạn
                  </button>
                </template>
                <template v-if="friend.status == FRIEND_TYPE.ACCEPTED">
                  <button class="friend-btn friend-btn--notify" disabled>
                    Đã chấp nhận lời mời kết bạn
                  </button>
                </template>
              </template>
              <template v-if="friendType == FRIEND_TYPE.NOT_FRIEND">
                <template v-if="friend.status == FRIEND_TYPE.NOT_FRIEND">
                  <button
                    class="friend-btn friend-btn--primary"
                    @click.stop="handleSendFriendRequest(friend.requestUser.id)"
                  >
                    Thêm bạn bè
                  </button>
                  <button
                    class="friend-btn friend-btn--remove"
                    @click.stop="
                      handleRemoveFriendSuggest(friend.requestUser.id)
                    "
                  >
                    Xóa
                  </button>
                </template>
                <template v-else-if="friend.status == FRIEND_TYPE.PENDING_ME">
                  <button class="friend-btn friend-btn--notify" disabled>
                    Đã gửi lời mời kết bạn
                  </button>
                </template>
              </template>
              <template
                v-if="
                  friendType == FRIEND_TYPE.ACCEPTED &&
                  friend.status == FRIEND_TYPE.REFUSED
                "
              >
                <button class="friend-btn friend-btn--notify" disabled>
                  Đã hủy kết bạn
                </button>
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
import { toastAlert } from "@/utilities/toastAlert";
import tokenService from "@/services/token.service";
import { onMounted, reactive, ref } from "vue";
import { friendshipService } from "@/services/friendship.service";
import { convertDateDisplay } from "@/utilities/dateUtils";

export default {
  props: {
    friendType: {
      type: Number,
    },
  },
  async setup(props) {
    const user = tokenService.getUser();
    const friendProfileId = ref(null);
    const friendSearchInput = ref(null);
    const friendSearchInputEl = ref(null);
    let friendSearchTimeout;
    const friendData = reactive({
      total: 0,
      pageSize: 20,
      pageNumber: 0,
      data: [],
      _fetched: false,
    });

    const listFriendsEl = ref(null);

    console.log(friendSearchTimeout);

    async function getAcceptPending() {
      if (
        friendData.pageSize * friendData.pageNumber >= friendData.total &&
        friendData._fetched
      ) {
        return;
      }
      try {
        let friendRes;

        if (props.friendType == FRIEND_TYPE.NOT_FRIEND) {
          friendRes = await friendshipService.getSuggestion({
            pageSize: friendData.pageSize,
            pageNumber: friendData.pageNumber + 1,
          });

          friendRes.data = friendRes.data.map((item) => {
            return {
              id: item.id,
              requestUser: item,
            };
          });
        } else {
          friendRes = await friendshipService.get({
            pageSize: friendData.pageSize,
            pageNumber: friendData.pageNumber + 1,
            type: props.friendType,
            searchString: friendSearchInput.value,
          });
        }

        friendRes.data = friendRes.data.map((item) => {
          switch (item.friendStatus) {
            case 1:
              item.status = FRIEND_TYPE.PENDING_OTHER;
              break;
            case 2:
              item.status = FRIEND_TYPE.ACCEPTED;
              break;
            default:
              item.status = FRIEND_TYPE.NOT_FRIEND;
              break;
          }
          return {
            ...item,
            createdAt: new Date(item.updatedAt),
            isShowMore: false,
          };
        });

        console.log(friendRes);

        friendData.data = [...friendData.data, ...friendRes.data];
        friendData.pageNumber++;
        friendData.total = friendRes.totalItems;
        friendData._fetched = true;
      } catch (err) {
        toastAlert.error(err);
      }
    }

    async function handleSelectFriendItem(id) {
      if (
        !friendProfileId.value ||
        (friendProfileId.value && friendProfileId.value != id)
      ) {
        friendProfileId.value = id;
      }
    }

    async function handleAcceptFriend(id) {
      const friendRequest = friendData.data.find((x) => x.id == id);
      if (friendRequest) {
        try {
          await friendshipService.accept(id);
          friendRequest.status = FRIEND_TYPE.ACCEPTED;
        } catch (err) {
          toastAlert.error(err);
        }
        friendRequest.status = FRIEND_TYPE.ACCEPTED;
      } else {
        toastAlert.error("Không tìm thấy user này");
      }
    }

    async function handleRefusedFriend(id) {
      const friendRequest = friendData.data.find((x) => x.id == id);
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

    async function handleSendFriendRequest(userId) {
      const friendSuggest = friendData.data.find((x) => x.id == userId);
      if (friendSuggest) {
        try {
          await friendshipService.sendRequest({
            targetUserId: userId,
          });
          friendSuggest.status = FRIEND_TYPE.PENDING_ME;
        } catch (error) {
          toastAlert.error(error);
        }
        // friendSuggest.status = FRIEND_TYPE.PENDING_ME;
      }
    }

    async function handleUnfriend(id) {
      const friendItem = friendData.data.find((x) => x.id == id);
      if (friendItem) {
        try {
          await friendshipService.unFriend(id);
          friendItem.isShowMore = false;
          friendItem.status = FRIEND_TYPE.REFUSED;
        } catch (err) {
          toastAlert.error(err);
        }
      } else {
        toastAlert.error("Không tìm thấy user");
      }
    }

    function handleRemoveFriendSuggest(userId) {
      friendData.data = friendData.data.filter((x) => x.id != userId);
    }

    function handleShowFriendMore(friendItem) {
      friendItem.isShowMore = true;
    }

    function closeShowFriendMore(friendItem) {
      friendItem.isShowMore = false;
    }

    onMounted(() => {
      listFriendsEl.value.addEventListener("scroll", () => {
        if (
          listFriendsEl.value.scrollHeight - listFriendsEl.value.scrollTop ===
          listFriendsEl.value.clientHeight
        ) {
          getAcceptPending();
        }
      });

      if (props.friendType == FRIEND_TYPE.ACCEPTED) {
        friendSearchInputEl.value.addEventListener("input", () => {
          clearTimeout(friendSearchTimeout);

          friendSearchTimeout = setTimeout(async () => {
            friendData.data = [];
            friendData.total = 0;
            friendData._fetched = false;
            friendData.pageNumber = 0;

            await getAcceptPending();
          }, 500);
        });
      }
    });

    await getAcceptPending();

    return {
      friendData,
      friendProfileId,
      friendSearchInput,
      user,
      FRIEND_TYPE,
      listFriendsEl,
      friendSearchInputEl,
      convertDateDisplay,
      handleSelectFriendItem,
      handleAcceptFriend,
      handleRefusedFriend,
      handleSendFriendRequest,
      handleRemoveFriendSuggest,
      handleShowFriendMore,
      closeShowFriendMore,
      handleUnfriend,
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
  @apply w-90 border-r border-gray-200 flex flex-col;
  .navbar-heading {
    @apply flex flex-wrap items-center px-2 py-4 pb-2;
    .navbar-heading-text {
      @apply ms-2 text-2xl font-bold;
    }
    .navbar-heading-icon {
      @apply text-md font-bold w-9 h-9 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all cursor-pointer;
    }

    .navbar-search-container {
      @apply w-full relative mt-4 mx-2;
    }
    .navbar-search-icon {
      @apply absolute left-3 top-1/2 -translate-y-1/2 text-gray-400;
    }
    .navbar-search-input {
      @apply w-full outline-none border-none rounded-full bg-gray-100 text-15 p-2 ps-9;
    }
  }

  .friend-list {
    @apply p-2 px-2 overflow-y-auto;

    &::-webkit-scrollbar {
      @apply w-1 left-0;
    }

    &::-webkit-scrollbar-thumb {
      @apply rounded-lg bg-gray-300;
    }

    &::-webkit-scrollbar-track {
      @apply hidden;
    }

    .friend-count {
      @apply font-semibold text-17 mb-2 mx-2 border-t border-gray-200 pt-1;
    }
    .friend-item {
      &.active {
        @apply bg-slate-100;
      }

      @apply p-2 hover:bg-slate-100 rounded-md cursor-pointer transition-all flex items-center;

      .friend-avatar {
        @apply w-15 h-15 rounded-full overflow-hidden;
        img {
          @apply w-full h-full object-cover;
        }
      }

      .friend-main {
        @apply flex flex-col flex-1 ms-3;

        .friend-info {
          @apply flex items-center justify-between relative;

          .friend-name {
            @apply font-semibold text-15;
          }

          .friend-date {
            @apply text-gray-500 text-13;
          }

          .friend-more {
            @apply relative;

            .friend-more-icon {
              @apply w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200;

              i {
                @apply text-13 text-gray-500 font-bold;
              }
            }

            .friend-more-list {
              @apply absolute right-0 top-10 bg-white shadow-custom-sm rounded-lg w-48 p-2 z-20;
              .friend-more-item {
                @apply flex items-center p-2 rounded-lg hover:bg-gray-100;

                .friend-more-item-icon {
                  @apply flex items-center justify-center;
                }

                .friend-more-item-text {
                  @apply text-15 font-semibold ms-2;
                }
              }
            }
          }
        }

        .friend-action {
          @apply flex items-center space-x-2;
          .friend-btn {
            @apply flex-1 p-1.5 rounded-lg font-semibold text-15 text-center mt-1;

            &.friend-btn--primary {
              @apply bg-primary text-white;
            }

            &.friend-btn--remove {
              @apply bg-gray-200;
            }

            &.friend-btn--notify {
              @apply font-normal text-13 text-left bg-none text-gray-500 p-0 mt-0;
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
