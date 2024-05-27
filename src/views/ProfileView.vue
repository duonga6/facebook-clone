<template :key="userId">
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
          <button
            v-if="userData.id == loggedUserId"
            class="change-image-btn"
            @click="handleChangeImage('cover')"
          >
            <i class="change-image-icon pi pi-camera"></i>
          </button>
        </div>
        <div class="user-info">
          <div class="user-avatar">
            <img :src="userData.avatarUrl" alt="" />
            <button
              v-if="userData.id == loggedUserId"
              class="change-image-btn"
              @click="handleChangeImage('avatar')"
            >
              <i class="change-image-icon pi pi-camera"></i>
            </button>
          </div>
          <div class="user-name">
            <div class="main-name">
              {{ userData.firstName + " " + userData.lastName }}
            </div>
            <div class="friend-count" v-if="userFriends.total > 0">
              {{ userFriends.total }} bạn bè
            </div>
          </div>
          <div class="user-action" v-if="friendShip">
            <template v-if="friendShip.status == FRIEND_TYPE.NOT_FRIEND">
              <button
                class="add-friend-btn btn--primary"
                @click="handleRequestFriend"
              >
                <img
                  class="btn-icon"
                  src="/src/images/icons/friend/friend-add.png"
                  alt=""
                  height="16"
                  width="16"
                />
                <span class="btn-text">Thêm bạn bè</span>
              </button>
            </template>
            <template v-else-if="friendShip.status == FRIEND_TYPE.PENDING_ME">
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
            <template
              v-else-if="friendShip.status == FRIEND_TYPE.PENDING_OTHER"
            >
              <button
                class="add-friend-btn btn--primary"
                @click="handleCancelRequest"
              >
                <img
                  class="btn-icon"
                  src="/src/images/icons/friend/friend-cancel.png"
                  alt=""
                  height="16"
                  width="16"
                />
                <span class="btn-text">Hủy lời mời</span>
              </button>
            </template>
            <template v-else-if="friendShip.status == FRIEND_TYPE.ACCEPTED">
              <button
                class="add-friend-btn btn--secondary"
                @click="isShowFriendAcceptedMore = !isShowFriendAcceptedMore"
                v-click-outside="() => (isShowFriendAcceptedMore = false)"
              >
                <img
                  class="btn-icon"
                  src="/src/images/icons/friend/friend-accepted.png"
                  alt=""
                  height="16"
                  width="16"
                />
                <span class="btn-text">Bạn bè</span>
                <div
                  class="friend-action-more"
                  v-show="isShowFriendAcceptedMore"
                >
                  <TriangleArrow
                    :css="'bottom-full right-3 mt-0.5'"
                  ></TriangleArrow>
                  <div class="friend-action-list">
                    <div class="friend-action-item" @click="handleUnFriend">
                      Hủy kết bạn
                    </div>
                  </div>
                </div>
              </button>
              <button
                class="add-friend-btn btn--primary"
                @click="handleStartConversation"
              >
                <img
                  class="btn-icon"
                  src="/src/images/icons/friend/friend-message.png"
                  alt=""
                  height="16"
                  width="16"
                />
                <span class="btn-text">Nhắn tin</span>
              </button>
            </template>
            <div
              class="add-friend-btn btn--secondary"
              v-click-outside="() => (isShowMore = false)"
            >
              <i
                class="nav-search-icon pi pi-ellipsis-h p-1 px-0.5 cursor-pointer"
                @click="isShowMore = !isShowMore"
              ></i>
              <div class="user-more-list" v-if="isShowMore">
                <div class="user-more-item" @click="isShowReport = true">
                  Báo cáo người dùng
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul class="user-navbar-list">
          <li>
            <router-link
              class="user-navbar-item"
              :class="{ active: !currentTab }"
              :to="{
                name: currentRoute.name,
                params: currentRoute.params,
                query: currentRoute.query,
              }"
              >Bài viết</router-link
            >
          </li>
          <li class="">
            <router-link
              class="user-navbar-item"
              :class="{ active: currentTab == 'profile-introduce' }"
              :to="{
                name: currentRoute.name,
                params: currentRoute.params,
                query: currentRoute.query,
              }"
            >
              Giới thiệu
            </router-link>
          </li>
          <li class="">
            <router-link
              class="user-navbar-item"
              :class="{ active: currentTab == 'friend' }"
              :to="{
                name: currentRoute.name,
                params: currentRoute.params,
                query: {
                  ...currentRoute.query,
                  tab: 'friend',
                },
              }"
            >
              Bạn bè
            </router-link>
          </li>
          <li class="">
            <router-link
              :to="{
                name: currentRoute.name,
                params: currentRoute.params,
                query: {
                  ...currentRoute.query,
                  tab: 'photo',
                },
              }"
              class="user-navbar-item"
              :class="{ active: currentTab == 'photo' }"
              >Ảnh</router-link
            >
          </li>
          <!-- <li class="user-navbar-item">Video</li> -->
        </ul>
      </div>
    </div>
    <div class="bottom-section">
      <div class="bottom-section-container">
        <div class="col-span-10" v-show="currentTab == 'photo'">
          <ProfilePhoto></ProfilePhoto>
        </div>
        <div class="col-span-10" v-show="currentTab == 'friend'">
          <ProfileFriend></ProfileFriend>
        </div>
        <div class="bottom-section-container" v-show="!currentTab">
          <div class="bottom-left col-span-4">
            <div class="user-introduce user-data-section">
              <div class="user-data-title">
                <div class="user-data-heading">Giới thiệu</div>
                <button
                  class="user-action-btn"
                  v-if="userData.id == loggedUserId"
                  @click="isShowEditProfile = true"
                >
                  <i class="user-action-icon pi pi-pencil"></i>
                </button>
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
                      userData.gender == 1 ? "Nam" : "Nữ"
                    }}</span>
                  </div>
                </li>
                <li class="user-introduce-item">
                  <i class="user-introduce-icon pi pi-calendar"></i>
                  <div class="user-introduce-text">
                    Ngày sinh
                    <span class="user-introduce-strong">{{
                      converDateToDDMMYYY(userData.dateOfBirth)
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
                    name: 'profile',
                    params: {
                      id: userId,
                    },
                    query: {
                      tab: 'photo',
                    },
                  }"
                  class="user-data-button"
                  >Xem tất cả ảnh</router-link
                >
              </div>
              <ul class="user-image-list">
                <li
                  v-for="photo in userPhotos"
                  :key="photo.id"
                  class="user-image-item"
                >
                  <router-link
                    :to="{
                      name: currentRoute.name,
                      params: currentRoute.params,
                      query: {
                        mediaId: photo.id,
                      },
                    }"
                  >
                    <img :src="photo.url" alt="" class="image-item-img" />
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="user-friends user-data-section">
              <div class="user-data-title">
                <div class="user-data-heading">Bạn bè</div>
                <router-link
                  :to="{
                    name: currentRoute.name,
                    params: currentRoute.params,
                    query: {
                      tab: 'friend',
                    },
                  }"
                  class="user-data-button"
                  >Xem tất cả bạn bè</router-link
                >
              </div>
              <ul class="user-friend-list">
                <li
                  class="user-friend-item"
                  v-for="friend in userFriends"
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
          <div class="bottom-right col-span-6">
            <ProfilePost :userId="userId"></ProfilePost>
          </div>
        </div>
      </div>
    </div>
  </div>
  <EditProfile
    v-if="isShowEditProfile"
    @onClose="isShowEditProfile = false"
    @onSubmit="onSubmitEditProfile"
    @onChangePassword="isShowChangePassword = true"
    :data="userData"
  ></EditProfile>

  <ChangePassword
    v-if="isShowChangePassword"
    @onClose="isShowChangePassword = false"
  ></ChangePassword>

  <ReportComponent
    v-if="isShowReport"
    :title="'Báo cáo người dùng'"
    @onClose="isShowReport = false"
    @onSubmit="isShowReport = false"
    :reportType="REPORT_TYPE.USER"
    :relationId="userId"
  ></ReportComponent>
</template>

<script>
import { useRoute } from "vue-router";
import tokenService from "@/services/token.service";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { FRIEND_TYPE, REPORT_TYPE } from "@/constants";
import { friendshipService } from "@/services/friendship.service";
import { toastAlert } from "@/utilities/toastAlert";
import { useStore } from "vuex";
import { uploadFileService } from "@/services/upload-file.service";
import { converDateToDDMMYYY } from "@/utilities/dateUtils";

export default {
  props: {
    id: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const loggedUserId = tokenService.getUser().id;
    const availableTab = ["photo", "friend"];
    const currentTab = computed(() => {
      const tabName = route.query.tab;
      return availableTab.includes(tabName) ? tabName : null;
    });

    const isShowEditProfile = ref(false);
    const isShowChangePassword = ref(false);
    const isShowFriendAcceptedMore = ref(false);
    const isShowMore = ref(false);
    const isShowReport = ref(false);

    const currentRoute = {
      name: route.name,
      params: route.params,
      query: route.query,
    };

    const userId = computed(
      () => props.id || route.params.id || route.query.userId
    );

    watch(
      () => userId.value,
      async (newVal) => {
        store.dispatch("profile/reset");
        await store.dispatch("profile/initStore", {
          userId: newVal,
        });
      }
    );

    const friendShip = reactive({
      id: null,
      status: null,
    });

    const userData = computed(() => store.getters["profile/getUser"]);
    const userPhotos = computed(() =>
      store.getters["profile/getPhoto"].data.slice(0, 9)
    );
    const userFriends = computed(() =>
      store.getters["profile/getFriend"].data.slice(0, 9).map((item) => {
        return item.requestUser.id == userId.value
          ? item.targetUser
          : item.requestUser;
      })
    );

    // Function
    async function handleRequestFriend() {
      try {
        const res = await friendshipService.sendRequest({
          targetUserId: userId.value,
        });

        friendShip.id = res.data.id;
        friendShip.status = FRIEND_TYPE.PENDING_ME;
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi gửi lời mời kết bạn");
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
        console.error(error);
        toastAlert.error("Có lỗi khi hủy yêu cầu kết bạn");
      }
    }

    async function handleUnFriend() {
      try {
        await friendshipService.unFriend(friendShip.id);
        friendShip.status = FRIEND_TYPE.NOT_FRIEND;
      } catch (error) {
        toastAlert.error(error);
      }
    }

    function handleChangeImage(type) {
      const fileUpload = document.createElement("input");
      fileUpload.type = "file";
      fileUpload.multiple = false;
      fileUpload.accept = "image/jpg, image/png,image/jpeg, video/mp4";

      fileUpload.addEventListener("change", async function (e) {
        const file = e.target.files[0];
        const res = await uploadFileService.upload(file, "upload");
        if (type == "cover") {
          await store.dispatch("profile/changeCoverImage", {
            url: res.data.url,
          });
        } else {
          await store.dispatch("profile/changeAvatar", {
            url: res.data.url,
          });
        }
      });

      fileUpload.click();
    }

    async function onSubmitEditProfile(data) {
      isShowEditProfile.value = false;
      const currentData = userData.value;
      currentData.dateOfBirth = new Date(currentData.dateOfBirth);
      if (
        data.firstName == currentData.firstName &&
        data.lastName == currentData.lastName &&
        data.dateOfBirth.getDate() == currentData.dateOfBirth.getDate() &&
        data.dateOfBirth.getMonth() == currentData.dateOfBirth.getMonth() &&
        data.dateOfBirth.getFullYear() ==
          currentData.dateOfBirth.getFullYear() &&
        data.address == currentData.address &&
        data.gender == currentData.gender
      ) {
        return;
      }

      await store.dispatch("profile/updateUser", data);
    }

    function handleStartConversation() {
      store.dispatch("conversation/getConversationByUserId", userId.value);
    }

    onMounted(async () => {
      await store.dispatch("profile/initStore", {
        userId: userId.value,
      });
      await checkFriendStatus(loggedUserId, userData.value.id, friendShip);
    });

    onUnmounted(() => {
      store.dispatch("profile/reset");
    });

    return {
      userData,
      userPhotos,
      userFriends,
      friendShip,
      loggedUserId,
      userId,
      FRIEND_TYPE,
      currentTab,
      currentRoute,
      isShowEditProfile,
      isShowFriendAcceptedMore,
      handleUnFriend,
      handleRequestFriend,
      handleAcceptFriend,
      handleRefuseFriend,
      handleCancelRequest,
      handleChangeImage,
      onSubmitEditProfile,
      converDateToDDMMYYY,
      handleStartConversation,
      isShowChangePassword,
      isShowMore,
      isShowReport,
      REPORT_TYPE,
    };
  },
};

async function checkFriendStatus(requestId, targetId, friendShip) {
  if (requestId == targetId) {
    friendShip.status = FRIEND_TYPE.SELF;
  } else {
    try {
      const res = await friendshipService.getInfo(targetId);
      if (res.data) {
        friendShip.id = res.data.id;
        switch (res.data.friendStatus) {
          case 1:
            friendShip.status = FRIEND_TYPE.PENDING_ME;
            break;
          case 2:
            friendShip.status = FRIEND_TYPE.ACCEPTED;
            break;
        }
      } else {
        friendShip.status = FRIEND_TYPE.NOT_FRIEND;
      }
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi tải thông tin bạn bè");
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  @apply w-full mt-14;
  .top-section {
    @apply shadow-lg bg-white;
    .top-info {
      width: 1260px;
      @apply mx-auto z-1;

      .cover-image {
        @apply rounded-bl-lg rounded-br-lg overflow-hidden relative;
        height: 460px;

        img {
          @apply w-full object-cover;
        }

        .cover-image-none {
          @apply w-full h-full bg-gray-100;
        }

        .change-image-btn {
          @apply absolute bottom-2 right-2 w-8 h-8 rounded-lg bg-white bg-opacity-40 flex items-center justify-center;

          .change-image-icon {
            @apply text-15;
          }
        }
      }
      .user-info {
        @apply flex items-center mx-8 py-2 border-b-2 border-gray-200;

        .user-avatar {
          @apply w-44 h-44 -mt-24 rounded-full overflow-hidden border-4 border-white z-10 relative;

          img {
            @apply w-full h-full object-cover;
          }

          .change-image-btn {
            @apply absolute bottom-4 right-6 w-8 h-8 rounded-lg bg-white bg-opacity-40 flex items-center justify-center;

            .change-image-icon {
              @apply text-15;
            }
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
            @apply flex space-x-2 items-center py-2 rounded-md px-3 relative;

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

            .friend-action-more {
              @apply absolute top-14 right-0 bg-white p-2 w-52 rounded-lg shadow-custom-sm;
              .friend-action-list {
                .friend-action-item {
                  @apply p-2 text-left font-semibold text-15 hover:bg-gray-100 transition-all rounded-lg;
                }
              }
            }

            .user-more-list {
              @apply absolute top-6 right-2 w-56 bg-white shadow-custom-sm rounded-lg p-2;
              .user-more-item {
                @apply p-2 py-1.5 rounded-lg text-15 font-semibold cursor-pointer hover:bg-gray-100;
              }
            }
          }
        }
      }

      .user-navbar-list {
        @apply flex items-center mx-8;
        .user-navbar-item {
          @apply my-1 px-4 py-3 block font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-all;

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
    min-height: 50vh;

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

            .user-action-btn {
              @apply p-2;

              .user-action-icon {
                @apply text-15 text-gray-600;
              }
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
