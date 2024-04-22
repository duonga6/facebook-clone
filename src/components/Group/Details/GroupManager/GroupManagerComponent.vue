<template>
  <div class="group-manager-container" v-if="groupData">
    <!-- <div class="group-manager-header">
      <div class="manager-header-text">Quản lý nhóm</div>
      <div class="manager-header-action"></div>
    </div> -->
    <div class="group-manager-layout">
      <div class="group-manager-member">
        <div class="manager-member-header">
          <div class="member-header-text">
            Thành viên
            <span class="header-member-count">{{ groupData.totalMember }}</span>
          </div>
        </div>
        <div class="member-header-search">
          <i class="header-search-icon pi pi-search"></i>
          <input
            class="header-search-input"
            v-model="searchMember"
            type="text"
          />
        </div>
        <!-- default show -->
        <div
          class="manager-member-list"
          v-show="!searchMember || !searchMember.trim()"
          v-scroll-bottom="onScrollMemberBottom"
        >
          <div
            class="manager-member-item"
            v-for="member in memberData.data"
            :key="member.id"
          >
            <router-link
              :to="{
                name: 'profile',
                params: {
                  id: member.user.id,
                },
              }"
              class="member-item-avatar"
            >
              <img :src="member.user.avatarUrl" alt="" />
            </router-link>
            <div class="member-item-info">
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: member.user.id,
                  },
                }"
                class="member-info-name"
              >
                {{ member.user.firstName + " " + member.user.lastName }}
              </router-link>
              <div class="member-info-joinat">
                Tham gia lúc:
                {{ convertDateStringToDateDisplay(member.joinedAt) }}
              </div>
              <div class="member-info-role">
                <span v-if="member.isAdmin">Quản trị viên</span>
              </div>
            </div>
            <div
              v-if="!member.isSuperAdmin"
              class="member-item-action"
              @click="() => (member.isShowAction = !member.isShowAction)"
              v-click-outside="() => (member.isShowAction = false)"
            >
              <i
                class="member-action-icon pi pi-ellipsis-h"
                :class="{ active: member.isShowAction }"
              />
              <div class="member-action-list" v-if="member.isShowAction">
                <div
                  class="member-action-item"
                  v-if="!member.isAdmin && groupData.currentMember.isSuperAdmin"
                  @click="handleAddAdminRole(member.id)"
                >
                  <div class="action-item-icon"></div>
                  <div class="action-item-text">Đặt làm quản trị viên</div>
                </div>
                <div
                  class="member-action-item"
                  v-if="member.isAdmin && groupData.currentMember.isSuperAdmin"
                  @click="handleRemoveAdminRole(member.id)"
                >
                  <div class="action-item-icon"></div>
                  <div class="action-item-text">
                    Thu hồi quyền quản trị viên
                  </div>
                </div>
                <div
                  class="member-action-item"
                  @click="handleRemoveMember(member.id)"
                >
                  <div class="action-item-icon"></div>
                  <div class="action-item-text">Xóa thành viên</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Search member show -->
        <div
          class="manager-member-list"
          v-show="searchMember && searchMember.trim()"
          v-scroll-bottom="onScrollMemberSearchBottom"
        >
          <div
            class="manager-member-item"
            v-for="member in searchMemberData.data"
            :key="member.id"
          >
            <router-link
              :to="{
                name: 'profile',
                params: {
                  id: member.user.id,
                },
              }"
              class="member-item-avatar"
            >
              <img :src="member.user.avatarUrl" alt="" />
            </router-link>
            <div class="member-item-info">
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: member.user.id,
                  },
                }"
                class="member-info-name"
              >
                {{ member.user.firstName + " " + member.user.lastName }}
              </router-link>
              <div class="member-info-joinat">
                Tham gia vào:
                {{ convertDateStringToDateDisplay(member.joinedAt) }}
              </div>
              <div class="member-info-role">
                <span v-if="member.isSuperAdmin">Trưởng nhóm</span>
                <span v-else-if="member.isAdmin">Quản trị viên</span>
              </div>
            </div>
            <div
              v-if="!member.isSuperAdmin"
              class="member-item-action"
              @click="() => (member.isShowAction = !member.isShowAction)"
              v-click-outside="() => (member.isShowAction = false)"
            >
              <i
                class="member-action-icon pi pi-ellipsis-h"
                :class="{ active: member.isShowAction }"
              />
              <div class="member-action-list" v-if="member.isShowAction">
                <div
                  class="member-action-item"
                  v-if="!member.isAdmin && groupData.currentMember.isSuperAdmin"
                  @click="handleAddAdminRole(member.id)"
                >
                  <div class="action-item-icon"></div>
                  <div class="action-item-text">Đặt làm quản trị viên</div>
                </div>
                <div
                  class="member-action-item"
                  v-if="member.isAdmin && groupData.currentMember.isSuperAdmin"
                  @click="handleRemoveAdminRole(member.id)"
                >
                  <div class="action-item-icon"></div>
                  <div class="action-item-text">
                    Thu hồi quyền quản trị viên
                  </div>
                </div>
                <div
                  class="member-action-item"
                  @click="handleRemoveMember(member.id)"
                >
                  <div class="action-item-icon"></div>
                  <div class="action-item-text">Xóa thành viên</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Group invite -->
      <div class="group-manager-invite">
        <div class="manager-member-header">
          <div class="member-header-text">
            Phê duyệt
            <span class="header-member-count" v-if="inviteMember.total > 0">{{
              inviteMember.total
            }}</span>
          </div>
          <div class="member-header-search">
            <i class="header-search-icon pi pi-search"></i>
            <input
              class="header-search-input"
              v-model="searchInvite"
              type="text"
            />
          </div>
        </div>
        <div
          class="manager-member-list"
          v-show="!searchInvite || !searchInvite.trim()"
          v-scroll-bottom="onScrollInviteBottom"
        >
          <div
            class="manager-member-item"
            v-for="member in inviteMember.data"
            :key="member.id"
          >
            <router-link
              :to="{
                name: 'profile',
                params: {
                  id: member.user.id,
                },
              }"
              class="member-item-avatar"
            >
              <img :src="member.user.avatarUrl" alt="" />
            </router-link>
            <div class="member-item-info">
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: member.user.id,
                  },
                }"
                class="member-info-name"
              >
                {{ member.user.firstName + " " + member.user.lastName }}
              </router-link>
              <div class="member-info-joinat">
                Yêu cầu lúc:
                {{ convertDateStringToDateDisplay(member.createdAt) }}
              </div>
            </div>
            <div class="member-item-action">
              <button
                class="item-action-btn btn--accept"
                @click="handleAcceptInvite(member.id)"
              >
                Chấp nhận
              </button>
              <button
                class="item-action-btn btn--cancel"
                @click="handleRefuseInvite(member.id)"
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
        <div
          class="manager-member-list"
          v-show="searchInvite && searchInvite.trim()"
          v-scroll-bottom="onScrollInviteSearchBottom"
        >
          <div
            class="manager-member-item"
            v-for="member in inviteMemberSearch.data"
            :key="member.id"
          >
            <router-link
              :to="{
                name: 'profile',
                params: {
                  id: member.user.id,
                },
              }"
              class="member-item-avatar"
            >
              <img :src="member.user.avatarUrl" alt="" />
            </router-link>
            <div class="member-item-info">
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: member.user.id,
                  },
                }"
                class="member-info-name"
              >
                {{ member.user.firstName + " " + member.user.lastName }}
              </router-link>
              <div class="member-info-joinat">
                Yêu cầu lúc:
                {{ convertDateStringToDateDisplay(member.createdAt) }}
              </div>
            </div>
            <div class="member-item-action">
              <button
                class="item-action-btn btn--accept"
                @click="handleAcceptInvite(member.id)"
              >
                Chấp nhận
              </button>
              <button
                class="item-action-btn btn--cancel"
                @click="handleRefuseInvite(member.id)"
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { convertDateStringToDateDisplay } from "@/utilities/dateUtils";
export default {
  setup() {
    const store = useStore();
    const searchMember = ref(null);
    const searchInvite = ref(null);

    let timeOutSearchMember;

    watch(
      () => searchMember.value,
      (newVal) => {
        if (newVal.trim()) {
          clearTimeout(timeOutSearchMember);
          timeOutSearchMember = setTimeout(async () => {
            await store.dispatch("group/getSearchMember", {
              searchString: newVal,
            });
          }, 500);
        }
      }
    );

    let timeOutSearchInvite;
    watch(
      () => searchInvite.value,
      (newVal) => {
        if (newVal.trim()) {
          clearTimeout(timeOutSearchInvite);
          timeOutSearchInvite = setTimeout(async () => {
            await store.dispatch("group/getInviteMemberSearch", {
              searchString: newVal,
            });
          }, 500);
        }
      }
    );

    async function handleAcceptInvite(id) {
      await store.dispatch("group/acceptInvite", {
        id,
      });
    }

    async function handleRefuseInvite(id) {
      await store.dispatch("group/refuseInvite", {
        id,
      });
    }

    async function handleAddAdminRole(id) {
      await store.dispatch("group/addAdminRole", {
        id,
      });
    }

    async function handleRemoveMember(id) {
      await store.dispatch("group/removeMember", {
        id,
      });
    }

    async function handleRemoveAdminRole(id) {
      await store.dispatch("group/removeAdminRole", {
        id,
      });
    }

    async function onScrollInviteBottom() {
      await store.dispatch("group/getInviteMember");
    }

    async function onScrollInviteSearchBottom() {
      await store.dispatch("group/getInviteMemberSearch", {
        searchString: searchInvite.value,
      });
    }

    async function onScrollMemberBottom() {
      await store.dispatch("group/getMember");
    }

    async function onScrollMemberSearchBottom() {
      await store.dispatch("group/getMemberSearch", {
        searchString: searchMember.value,
      });
    }

    return {
      memberData: computed(() => store.getters["group/getMember"]),
      inviteMember: computed(() => store.getters["group/getInviteMember"]),
      inviteMemberSearch: computed(
        () => store.getters["group/getInviteMemberSearch"]
      ),
      searchMemberData: computed(() => store.getters["group/getSearchMember"]),
      groupData: computed(() => store.getters["group/getGroupInfo"]),
      convertDateStringToDateDisplay,
      searchMember,
      searchInvite,
      handleAcceptInvite,
      handleRefuseInvite,
      handleAddAdminRole,
      handleRemoveAdminRole,
      handleRemoveMember,
      onScrollInviteBottom,
      onScrollInviteSearchBottom,
      onScrollMemberBottom,
      onScrollMemberSearchBottom,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-manager-container {
  max-width: 1250px;
  height: 84vh;
  @apply mx-auto p-4 bg-white border rounded-lg;
  .group-manager-header {
    @apply flex items-center;

    .manager-header-text {
      @apply text-xl font-semibold;
    }

    .manager-header-action {
    }
  }

  .group-manager-layout {
    @apply flex space-x-20 h-full;

    .group-manager-member,
    .group-manager-invite {
      @apply flex-1 flex flex-col;

      .manager-member-header {
        .member-header-text {
          @apply text-17 font-semibold;

          .header-member-count {
            @apply text-gray-500 text-15;
          }
        }
      }

      .member-header-search {
        @apply relative mt-2;

        .header-search-icon {
          @apply absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-15 text-gray-400;
        }

        .header-search-input {
          @apply border-none outline-none bg-gray-100 rounded-full w-full text-15 py-1.5 ps-8;
        }
      }

      .manager-member-list {
        @apply mt-4 h-full overflow-y-auto flex-1;

        &::-webkit-scrollbar {
          @apply w-1 left-0;
        }

        &::-webkit-scrollbar-thumb {
          @apply rounded-lg bg-gray-300;
        }

        &::-webkit-scrollbar-track {
          @apply hidden;
        }

        .manager-member-item {
          @apply flex items-center p-2 hover:bg-gray-100 hover:bg-opacity-70 transition-all rounded-lg;

          .member-item-avatar {
            @apply w-14 h-14 rounded-full overflow-hidden border;

            img {
              @apply w-full h-full object-cover;
            }
          }

          .member-item-info {
            @apply ms-3 flex-1;

            .member-info-name {
              @apply text-15 font-semibold leading-18;
            }

            .member-info-joinat {
              @apply text-13 text-gray-600 leading-15;
            }

            .member-info-role {
              @apply text-13 leading-15 text-gray-600 font-semibold;
            }
          }

          .member-item-action {
            @apply relative flex space-x-2;

            .member-action-icon {
              @apply w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer text-gray-600;

              &.active {
                @apply bg-gray-100;
              }
            }

            .member-action-list {
              @apply absolute top-full right-0 bg-white border shadow-sm p-2 rounded-lg w-72 z-10;

              .member-action-item {
                @apply flex items-center px-3 py-2 hover:bg-gray-100 rounded-md transition-all cursor-pointer;

                .action-item-icon {
                }

                .action-item-text {
                  @apply text-15 font-semibold;
                }
              }
            }

            .item-action-btn {
              @apply text-15 font-semibold px-3 py-2 rounded-lg transition-all;

              &.btn--accept {
                @apply bg-primary text-primary bg-opacity-10 hover:bg-opacity-5;
              }

              &.btn--cancel {
                @apply bg-gray-100  hover:bg-opacity-50;
              }
            }
          }
        }
      }
    }

    .group-manager-invite {
      @apply col-span-1;
    }
  }
}
</style>
