<template>
  <div class="search-container">
    <div class="search-nav">
      <div class="search-nav-header">Kết quả tìm kiếm</div>
      <div class="search-nav-options">
        <div class="search-options-header">Bộ lọc</div>
        <div class="search-options-list">
          <router-link
            :to="{
              name: 'search',
              query: {
                s: searchString,
              },
            }"
            class="search-options-item"
            :class="{ active: currentTab == 'all' }"
          >
            <div class="search-item-icon">
              <i
                style="
                  background-image: url('/src/images/icons/search-icon.png');
                  background-position: 0px -42px;
                  background-size: auto;
                  width: 20px;
                  height: 20px;
                  background-repeat: no-repeat;
                  display: inline-block;
                "
              ></i>
            </div>
            <div class="search-item-text">Tất cả</div>
          </router-link>
          <router-link
            :to="{
              name: 'search',
              query: {
                s: searchString,
                filter: 'post',
              },
            }"
            class="search-options-item"
            :class="{ active: currentTab == 'post' }"
          >
            <div class="search-item-icon">
              <i
                data-visualcompletion="css-img"
                class="x1b0d499 xep6ejk"
                aria-hidden="true"
                style="
                  background-image: url('/src/images/icons/search-icon3.png');
                  background-position: 0px -294px;
                  background-size: auto;
                  width: 20px;
                  height: 20px;
                  background-repeat: no-repeat;
                  display: inline-block;
                "
              ></i>
            </div>
            <div class="search-item-text">Bài viết</div>
          </router-link>
          <router-link
            :to="{
              name: 'search',
              query: {
                s: searchString,
                filter: 'user',
              },
            }"
            class="search-options-item"
            :class="{ active: currentTab == 'user' }"
          >
            <div class="search-item-icon">
              <i
                style="
                  background-image: url('/src/images/icons/search-icon1.png');
                  background-position: 0px -172px;
                  background-size: auto;
                  width: 20px;
                  height: 20px;
                  background-repeat: no-repeat;
                  display: inline-block;
                "
              ></i>
            </div>
            <div class="search-item-text">Mọi người</div>
          </router-link>
          <router-link
            :to="{
              name: 'search',
              query: {
                s: searchString,
                filter: 'group',
              },
            }"
            class="search-options-item"
            :class="{ active: currentTab == 'group' }"
          >
            <div class="search-item-icon">
              <i
                style="
                  background-image: url('/src/images/icons/search-icon2.png');
                  background-position: -42px -219px;
                  background-size: auto;
                  width: 20px;
                  height: 20px;
                  background-repeat: no-repeat;
                  display: inline-block;
                "
              ></i>
            </div>
            <div class="search-item-text">Nhóm</div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="search-content" v-scroll-near-bottom="onScrollBottom">
      <!-- Show user + group -->
      <div v-show="currentTab == 'all'">
        <div class="search-content-result" v-if="userOverview.length">
          <div class="search-content-header">Người dùng</div>
          <div class="search-content-list">
            <div
              class="search-content-item"
              v-for="user in userOverview"
              :key="user.id"
            >
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: user.id,
                  },
                }"
                class="search-item-img img--rounded"
              >
                <img :src="user.avatarUrl" alt="" />
              </router-link>
              <div class="search-item-info">
                <router-link
                  :to="{
                    name: 'profile',
                    params: {
                      id: user.id,
                    },
                  }"
                  class="search-item-name"
                >
                  {{ user.firstName + " " + user.lastName }}
                </router-link>
              </div>
              <div class="search-item-action">
                <button
                  class="item-action-btn btn--secondary"
                  v-if="user.friend.status == FRIEND_TYPE.ACCEPTED"
                  @click="
                    user.isShowFriendAcceptedMore =
                      !user.isShowFriendAcceptedMore
                  "
                  v-click-outside="
                    () => (user.isShowFriendAcceptedMore = false)
                  "
                >
                  <img
                    class="action-btn-icon"
                    src="/src/images/icons/friend/friend-accepted.png"
                  />
                  <div class="action-btn-text">Bạn bè</div>
                  <div
                    class="friend-action-more"
                    v-show="user.isShowFriendAcceptedMore"
                  >
                    <TriangleArrow
                      :css="'bottom-full right-3 mt-0.5'"
                    ></TriangleArrow>
                    <div class="friend-action-list">
                      <div
                        class="friend-action-item"
                        @click="handleStartConversation(user.id)"
                      >
                        Nhắn tin
                      </div>
                      <div
                        class="friend-action-item"
                        @click="handleUnFriend(user.id)"
                      >
                        Hủy kết bạn
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  class="item-action-btn btn--primary"
                  v-if="user.friend.status == FRIEND_TYPE.NOT_FRIEND"
                  @click="handleSendRequestFriend(user.id)"
                >
                  <img
                    class="action-btn-icon"
                    src="/src/images/icons/friend/friend-add.png"
                  />
                  <div class="action-btn-text">Kết bạn</div>
                </button>
                <template v-if="user.friend.status == FRIEND_TYPE.PENDING_ME">
                  <button
                    class="item-action-btn btn--primary"
                    @click="handleAcceptRequest(user.id)"
                  >
                    <div class="action-btn-text">Chấp nhận lời mời</div>
                  </button>
                  <button
                    class="item-action-btn btn--secondary"
                    @click="handleRefuseRequest(user.id)"
                  >
                    <div class="action-btn-text">Xóa lời mời</div>
                  </button>
                </template>

                <button
                  class="item-action-btn btn--secondary"
                  v-if="user.friend.status == FRIEND_TYPE.PENDING_OTHER"
                  @click="handleCancelRequest(user.id)"
                >
                  <img
                    class="action-btn-icon"
                    src="/src/images/icons/friend/friend-cancel.png"
                  />
                  <div class="action-btn-text">Hủy yêu cầu</div>
                </button>
              </div>
            </div>
          </div>
          <div class="search-show-more" v-if="isShowMoreUser">
            <div class="show-more-btn">Xem thêm</div>
          </div>
        </div>
        <div class="search-content-result" v-if="groupOverview.length">
          <div class="search-content-header">Nhóm</div>
          <div class="search-content-list">
            <div
              class="search-content-item"
              v-for="group in groupOverview"
              :key="group.id"
            >
              <router-link
                :to="{
                  name: 'group-details-post',
                  params: {
                    id: group.id,
                  },
                }"
                class="search-item-img img--rounded"
              >
                <img :src="group.coverImage" alt="" />
              </router-link>
              <div class="search-item-info">
                <router-link
                  :to="{
                    name: 'group-details-post',
                    params: {
                      id: group.id,
                    },
                  }"
                  class="search-item-name"
                >
                  {{ group.name }}
                </router-link>
                <div class="search-item-desc-lg">
                  {{ group.isPublic ? "Công khai" : "Riêng tư" }}
                  <DotSplit :classCss="'mx-1'"></DotSplit>
                  {{ group.totalMember }} thành viên
                </div>
                <div class="search-item-desc-sm">{{ group.description }}</div>
              </div>
              <div class="search-item-action">
                <button
                  @click="handleJoinGroup(group.id)"
                  class="item-action-btn btn--primary"
                  v-if="!group.currentInvite && !group.currentMember"
                >
                  <div class="action-btn-text">Tham gia</div>
                </button>
                <button
                  class="item-action-btn btn--secondary"
                  v-if="group.currentMember"
                  @click="group.isShowJoinedMore = !group.isShowJoinedMore"
                  v-click-outside="() => (group.isShowJoinedMore = false)"
                >
                  <div class="action-btn-text">Đã tham gia</div>
                  <div
                    class="friend-action-more"
                    v-show="group.isShowJoinedMore"
                  >
                    <TriangleArrow
                      :css="'bottom-full right-3 mt-0.5'"
                    ></TriangleArrow>
                    <div class="friend-action-list">
                      <div
                        class="friend-action-item"
                        @click="handleLeaveGroup(group.id)"
                      >
                        Rời nhóm
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  @click="handleCancelJoin(group.id)"
                  class="item-action-btn btn--secondary"
                  v-if="group.currentInvite"
                >
                  <div class="action-btn-text">Hủy yêu cầu</div>
                </button>
              </div>
            </div>
          </div>
          <div class="search-show-more" v-if="isShowMoreUser">
            <div class="show-more-btn">Xem thêm</div>
          </div>
        </div>
      </div>

      <!-- Only show user -->
      <div
        class="search-content-result"
        v-if="userData.data.length"
        v-show="currentTab == 'user'"
      >
        <div class="search-content-header">Người dùng</div>
        <div class="search-content-list">
          <div
            class="search-content-item"
            v-for="user in userData.data"
            :key="user.id"
          >
            <router-link
              :to="{
                name: 'profile',
                params: {
                  id: user.id,
                },
              }"
              class="search-item-img img--rounded"
            >
              <img :src="user.avatarUrl" alt="" />
            </router-link>
            <div class="search-item-info">
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: user.id,
                  },
                }"
                class="search-item-name"
              >
                {{ user.firstName + " " + user.lastName }}
              </router-link>
            </div>
            <div class="search-item-action">
              <button
                class="item-action-btn btn--secondary"
                v-if="user.friend.status == FRIEND_TYPE.ACCEPTED"
                @click="
                  user.isShowFriendAcceptedMore = !user.isShowFriendAcceptedMore
                "
                v-click-outside="() => (user.isShowFriendAcceptedMore = false)"
              >
                <img
                  class="action-btn-icon"
                  src="/src/images/icons/friend/friend-accepted.png"
                />
                <div class="action-btn-text">Bạn bè</div>
                <div
                  class="friend-action-more"
                  v-show="user.isShowFriendAcceptedMore"
                >
                  <TriangleArrow
                    :css="'bottom-full right-3 mt-0.5'"
                  ></TriangleArrow>
                  <div class="friend-action-list">
                    <div
                      class="friend-action-item"
                      @click="handleStartConversation(user.id)"
                    >
                      Nhắn tin
                    </div>
                    <div
                      class="friend-action-item"
                      @click="handleUnFriend(user.id)"
                    >
                      Hủy kết bạn
                    </div>
                  </div>
                </div>
              </button>
              <button
                class="item-action-btn btn--primary"
                v-if="user.friend.status == FRIEND_TYPE.NOT_FRIEND"
                @click="handleSendRequestFriend(user.id)"
              >
                <img
                  class="action-btn-icon"
                  src="/src/images/icons/friend/friend-add.png"
                />
                <div class="action-btn-text">Kết bạn</div>
              </button>
              <template v-if="user.friend.status == FRIEND_TYPE.PENDING_ME">
                <button
                  class="item-action-btn btn--primary"
                  @click="handleAcceptRequest(user.id)"
                >
                  <div class="action-btn-text">Chấp nhận lời mời</div>
                </button>
                <button
                  class="item-action-btn btn--secondary"
                  @click="handleRefuseRequest(user.id)"
                >
                  <div class="action-btn-text">Xóa lời mời</div>
                </button>
              </template>

              <button
                class="item-action-btn btn--secondary"
                v-if="user.friend.status == FRIEND_TYPE.PENDING_OTHER"
                @click="handleCancelRequest(user.id)"
              >
                <img
                  class="action-btn-icon"
                  src="/src/images/icons/friend/friend-cancel.png"
                />
                <div class="action-btn-text">Hủy yêu cầu</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Only show group -->
      <div
        class="search-content-result"
        v-if="groupData.data.length"
        v-show="currentTab == 'group'"
      >
        <div class="search-content-header">Nhóm</div>
        <div class="search-content-list">
          <div
            class="search-content-item"
            v-for="group in groupData.data"
            :key="group.id"
          >
            <router-link
              :to="{
                name: 'group-details-post',
                params: {
                  id: group.id,
                },
              }"
              class="search-item-img img--rounded"
            >
              <img :src="group.coverImage" alt="" />
            </router-link>
            <div class="search-item-info">
              <router-link
                :to="{
                  name: 'group-details-post',
                  params: {
                    id: group.id,
                  },
                }"
                class="search-item-name"
              >
                {{ group.name }}
              </router-link>
              <div class="search-item-desc-lg">
                {{ group.isPublic ? "Công khai" : "Riêng tư" }}
                <DotSplit :classCss="'mx-1'"></DotSplit>
                {{ group.totalMember }} thành viên
              </div>
              <div class="search-item-desc-sm">{{ group.description }}</div>
            </div>
            <div class="search-item-action">
              <button
                @click="handleJoinGroup(group.id)"
                class="item-action-btn btn--primary"
                v-if="!group.currentInvite && !group.currentMember"
              >
                <div class="action-btn-text">Tham gia</div>
              </button>
              <button
                class="item-action-btn btn--secondary"
                v-if="group.currentMember"
                @click="group.isShowJoinedMore = !group.isShowJoinedMore"
                v-click-outside="() => (group.isShowJoinedMore = false)"
              >
                <div class="action-btn-text">Đã tham gia</div>
                <div class="friend-action-more" v-show="group.isShowJoinedMore">
                  <TriangleArrow
                    :css="'bottom-full right-3 mt-0.5'"
                  ></TriangleArrow>
                  <div class="friend-action-list">
                    <div
                      class="friend-action-item"
                      @click="handleLeaveGroup(group.id)"
                    >
                      Rời nhóm
                    </div>
                  </div>
                </div>
              </button>
              <button
                @click="handleCancelJoin(group.id)"
                class="item-action-btn btn--secondary"
                v-if="group.currentInvite"
              >
                <div class="action-btn-text">Hủy yêu cầu</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Always show post -->
      <div
        class="post-list"
        v-show="currentTab == 'all' || currentTab == 'post'"
      >
        <PostComponent
          v-for="post in postData"
          :key="post.id"
          :post="post"
          :storeName="'searchPost'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { toastAlert } from "@/utilities/toastAlert";
import { userService } from "@/services/user.service";
import { groupService } from "@/services/group.service";
import { friendshipService } from "@/services/friendship.service";
import { FRIENDSHIP_STATUS, FRIEND_TYPE, POST_TYPE } from "@/constants";
import tokenService from "@/services/token.service";
import { useStore } from "vuex";
import { groupInviteService } from "@/services/group-invite.service";
import { grMemberService } from "@/services/group-member.service";

const user = tokenService.getUser();

export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    const searchString = computed(() => route.query.s);

    const currentTab = computed(() => {
      if (!route.query.filter) return "all";
      else if (route.query.filter == "post") return "post";
      else if (route.query.filter == "user") return "user";
      else if (route.query.filter == "group") return "group";
      else return "all";
    });

    const groupData = reactive({
      data: [],
      pageSize: 15,
      pageNumber: 0,
      total: 0,
      isFetched: false,
    });

    const userData = reactive({
      data: [],
      pageSize: 15,
      pageNumber: 0,
      total: 0,
      isFetched: false,
    });

    const postData = computed(() => store.getters["searchPost/getPosts"]);

    async function handleSendRequestFriend(userId) {
      const user = userData.data.find((x) => x.id == userId);
      if (user) {
        try {
          const res = await friendshipService.sendRequest({
            targetUserId: user.id,
          });

          user.friend.id = res.data.id;
          user.friend.status = FRIEND_TYPE.PENDING_OTHER;
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi gửi lời mời kết bạn");
        }
      }
    }

    async function handleAcceptRequest(userId) {
      const user = userData.data.find((x) => x.id == userId);
      if (user) {
        try {
          await friendshipService.accept(user.friend.id);

          user.friend.status = FRIEND_TYPE.ACCEPTED;
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi chấp nhận lời mời kết bạn");
        }
      }
    }

    async function handleCancelRequest(userId) {
      const user = userData.data.find((x) => x.id == userId);
      if (user) {
        try {
          await friendshipService.cancelSendRequest(user.friend.id);

          user.friend.status = FRIEND_TYPE.NOT_FRIEND;
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi hủy lời mời kết bạn");
        }
      }
    }

    async function handleUnFriend(userId) {
      const user = userData.data.find((x) => x.id == userId);
      if (user) {
        try {
          await friendshipService.unFriend(user.friend.id);

          user.friend.status = FRIEND_TYPE.NOT_FRIEND;
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi hủy lời mời kết bạn");
        }
      }
    }

    async function handleRefuseRequest(userId) {
      const user = userData.data.find((x) => x.id == userId);
      if (user) {
        try {
          await friendshipService.refuseFriend(user.friend.id);

          user.friend.status = FRIEND_TYPE.NOT_FRIEND;
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi hủy lời mời kết bạn");
        }
      }
    }

    function handleStartConversation(userId) {
      store.dispatch("conversation/getConversationByUserId", userId);
    }

    async function handleJoinGroup(groupId) {
      const group = groupData.data.find((x) => x.id == groupId);
      if (group) {
        try {
          const res = await groupInviteService.create({
            groupId: groupId,
          });

          group.currentInvite = res.data;
        } catch (error) {
          console.error(error);
          toastAlert.error("Có lỗi khi gửi yêu cầu tham gia nhóm");
        }
      }
    }

    async function handleCancelJoin(groupId) {
      const group = groupData.data.find((x) => x.id == groupId);
      if (group) {
        try {
          await groupInviteService.delete(group.currentInvite.id);

          group.currentInvite = null;
        } catch (error) {
          console.error(error);
          toastAlert.error("Có lỗi khi hủy yêu cầu tham gia nhóm");
        }
      }
    }

    async function handleLeaveGroup(groupId) {
      const group = groupData.data.find((x) => x.id == groupId);
      if (group) {
        try {
          await grMemberService.delete(group.currentMember.id);

          group.currentMember = null;
        } catch (error) {
          console.error(error);
          toastAlert.error("Có lỗi khi rời nhóm");
        }
      }
    }

    let isFetchingData = false;
    async function onScrollBottom() {
      if (!isFetchingData) {
        isFetchingData = true;

        if (currentTab.value == "all" || currentTab.value == "post") {
          await store.dispatch("searchPost/getPost");
        } else if (currentTab.value == "user") {
          await getUser(userData, searchString.value);
        } else {
          await getGroup(groupData, searchString.value);
        }

        isFetchingData = false;
      }
    }

    onMounted(async () => {
      await getUser(userData, searchString.value);
      await getGroup(groupData, searchString.value);
      store.dispatch("searchPost/initStore", {
        postType: POST_TYPE.SEARCH_POST,
        searchString: searchString.value,
      });
      await store.dispatch("searchPost/getPost");
    });

    onUnmounted(() => {
      store.dispatch("searchPost/reset");
    });

    return {
      searchString,
      isShowMoreGroup: computed(() => groupData.total > 3),
      isShowMoreUser: computed(() => userData.total > 3),
      userOverview: computed(() => userData.data.slice(0, 3)),
      groupOverview: computed(() => groupData.data.slice(0, 3)),
      groupData,
      userData,
      postData: postData.value.data,
      FRIENDSHIP_STATUS,
      FRIEND_TYPE,
      currentTab,
      handleSendRequestFriend,
      handleAcceptRequest,
      handleCancelRequest,
      handleUnFriend,
      handleRefuseRequest,
      handleStartConversation,
      handleJoinGroup,
      handleCancelJoin,
      handleLeaveGroup,
      onScrollBottom,
    };
  },
};

async function getUser(data, searchString) {
  if (data.pageSize * data.pageNumber < data.total || !data.isFetched)
    try {
      const res = await userService.get({
        pageSize: data.pageSize,
        pageNumber: data.pageNumber + 1,
        searchString: searchString,
      });

      res.data = await Promise.all(
        res.data.map(async (item) => {
          try {
            const friendStatus = await friendshipService.getInfo(item.id);
            item.friendStatus = friendStatus.data.friendStatus;
            item.isShowFriendAcceptedMore = false;

            item.friend = {
              id: friendStatus.data.id,
            };

            switch (friendStatus.data.friendStatus) {
              case 1: {
                if (friendStatus.data.requestUser.id == user.id) {
                  item.friend.status = FRIEND_TYPE.PENDING_OTHER;
                } else {
                  item.friend.status = FRIEND_TYPE.PENDING_ME;
                }
                break;
              }

              case 2: {
                item.friend.status = FRIEND_TYPE.ACCEPTED;
              }
            }
          } catch {
            //
            item.friendStatus = 4;
            item.friend = {
              id: null,
              status:
                item.id == user.id ? FRIEND_TYPE.SELF : FRIEND_TYPE.NOT_FRIEND,
            };
          }
          return item;
        })
      );

      data.data.push(...res.data);
      data.pageNumber++;
      data.total = res.totalItems;
      data.isFetched = true;
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi tìm kiếm người dùng");
    }
}

async function getGroup(data, searchString) {
  if (data.pageSize * data.pageNumber < data.total || !data.isFetched)
    try {
      const res = await groupService.get({
        pageSize: data.pageSize,
        pageNumber: data.pageNumber + 1,
        searchString: searchString,
        type: 0,
      });

      res.data = await Promise.all(
        res.data.map(async (item) => {
          try {
            const inviteRes = await groupInviteService.getByUIDandGrID(
              item.id,
              user.id
            );
            item.currentInvite = inviteRes.data;
          } catch {
            item.currentInvite = null;
          }

          try {
            const member = await grMemberService.getByGrIdAndUserId(
              item.id,
              user.id
            );
            item.currentMember = member.data;
          } catch {
            item.currentMember = null;
          }

          item.isShowJoinedMore = false;

          return item;
        })
      );

      data.data.push(...res.data);
      data.pageNumber++;
      data.total = res.totalItems;
      data.isFetched = true;
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi tìm kiếm người dùng");
    }
}
</script>

<style lang="scss" scoped>
.search-container {
  @apply pt-14 h-screen flex;

  .search-nav {
    @apply border-r border-gray-100;

    .search-nav-header {
      @apply p-4 py-3 text-2xl font-bold border-b border-gray-100 w-90;
    }
    .search-nav-options {
      .search-options-header {
        @apply text-17 font-semibold p-4 py-2;
      }
      .search-options-list {
        @apply p-2;

        .search-options-item {
          @apply p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-3;

          .search-item-icon {
            @apply w-9 h-9 rounded-full flex items-center justify-center bg-gray-100;
          }

          .search-item-text {
            @apply text-15 font-semibold;
          }

          &.active {
            @apply bg-gray-100;

            .search-item-icon {
              @apply bg-primary;

              i {
                filter: invert(1);
              }
            }
          }
        }
      }
    }
  }

  .search-content {
    @apply h-full w-full overflow-y-auto bg-gray-200;

    .search-content-result {
      @apply w-700px mx-auto bg-white rounded-lg border border-gray-200 p-4 mt-4;

      .search-content-header {
        @apply font-bold text-xl leading-5;
      }

      .search-content-list {
        .search-content-item {
          @apply flex items-center mt-4;

          .search-item-img {
            @apply w-15 h-15 overflow-hidden;

            img {
              @apply w-full h-full object-cover;
            }

            &.img--rounded {
              @apply rounded-full;
            }

            &.img--square {
              @apply rounded-lg;
            }
          }

          .search-item-info {
            @apply flex flex-col ms-4;

            .search-item-name {
              @apply text-17 font-semibold leading-6;
            }

            .search-item-desc-sm {
              @apply text-13 text-gray-500 leading-15 line-clamp-2;
            }

            .search-item-desc-lg {
              @apply text-15 text-gray-500 leading-17 flex items-center;
            }
          }
          .search-item-action {
            @apply ms-auto flex items-center space-x-2;

            .item-action-btn {
              @apply p-1.5 px-2.5 rounded-lg font-semibold transition-all flex items-center space-x-2 relative;

              &.btn--primary {
                @apply bg-primary text-white hover:bg-opacity-90;

                .action-btn-icon {
                  filter: invert(1);
                }
              }

              &.btn--secondary {
                @apply bg-gray-200 hover:bg-opacity-50;
              }

              .friend-action-more {
                @apply absolute top-14 right-0 bg-white p-2 w-52 rounded-lg shadow-custom-sm;
                .friend-action-list {
                  .friend-action-item {
                    @apply p-2 text-left font-semibold text-15 hover:bg-gray-100 transition-all rounded-lg;
                  }
                }
              }
            }
          }
        }
      }

      .search-show-more {
        @apply mt-4;

        .show-more-btn {
          @apply text-15 font-semibold bg-gray-200 w-full rounded-lg hover:bg-opacity-50 transition-all text-center p-2;
        }
      }
    }

    .post-list {
      @apply mx-auto w-700px mt-4;
    }
  }
}
</style>
