<template>
  <div
    class="group-header-container"
    v-if="groupInfo"
    :class="{ 'pt-14': routeName == 'group-details-post' }"
  >
    <div class="group-header-main">
      <div class="group-header-cover">
        <img :src="groupInfo.coverImage" alt="" />
      </div>
      <div class="group-header-info">
        <router-link
          :to="{
            name: 'group-details-post',
            params: {
              id: groupInfo.id,
            },
          }"
          class="group-header-name"
        >
          {{ groupInfo.name }}
        </router-link>
        <div class="group-header-more">
          <div class="group-header-member">
            <div class="group-header-status">
              <div class="group-header-type">
                <i class="group-type-icon pi pi-globe"></i>
                <span class="group-type-text"
                  >Nhóm
                  {{ groupInfo.isPublic ? "Công khai" : "Riêng tư" }}</span
                >
              </div>
              <div class="group-status-split pi pi-circle-fill"></div>
              <div class="group-header-total">
                {{ groupInfo.totalMember }} thành viên
              </div>
            </div>
            <div class="group-header-member" v-if="groupHeaderMember">
              <ul class="member-list">
                <li
                  class="member-item"
                  v-for="(member, index) in groupHeaderMember"
                  :key="index"
                  :style="
                    index > 0
                      ? `transform: translateX(-${index * 5}px); z-index: ${
                          groupHeaderMember.length - index
                        }`
                      : `z-index: ${groupHeaderMember.length}`
                  "
                >
                  <div class="member-avatar">
                    <img :src="member.user.avatarUrl" alt="" />
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="group-header-action">
            <div class="group-join">
              <button
                class="group-join-btn btn btn-dark"
                v-if="groupInfo.currentMember"
                @click="isShowJoinAction = !isShowJoinAction"
                v-click-outside="
                  () => (isShowJoinAction ? (isShowJoinAction = false) : _)
                "
              >
                <span>Đã tham gia</span>
                <div class="group-joined-action" v-show="isShowJoinAction">
                  <TriangleArrow
                    :style="'bottom: calc(100% - 1px); left: 50%;'"
                  ></TriangleArrow>
                  <button
                    class="joined-action-item"
                    v-if="!groupInfo.currentMember?.isSuperAdmin"
                    @click="handleLeaveGroup"
                  >
                    Rời nhóm
                  </button>
                  <button
                    class="joined-action-item"
                    v-if="groupInfo.currentMember?.isSuperAdmin"
                    @click="handleDeleteGroup"
                  >
                    Xóa nhóm
                  </button>
                </div>
              </button>
              <button
                class="group-join-btn btn btn-dark"
                v-else-if="
                  groupInfo.currentInvite &&
                  !groupInfo.currentInvite.adminAccepted
                "
                @click="handleCancelRequestInvite"
              >
                Đang chờ
              </button>
              <button
                v-else
                class="group-join-btn btn btn-primary"
                @click="handleSendRequestInvite"
              >
                Tham gia
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="group-header-navbar" v-if="groupInfo.currentMember">
        <div class="group-header-nav">
          <router-link
            :to="{
              name: 'group-details-post',
              params: {
                id: groupInfo.id,
              },
            }"
            class="group-nav-item"
            :class="{
              active:
                currentRouteName == 'group-details-post' ||
                currentRouteName == 'group-details-preview-post',
            }"
            >Thảo luận</router-link
          >
          <router-link
            :to="{
              name: 'group-details-member',
              params: {
                id: groupInfo.id,
              },
            }"
            class="group-nav-item"
            :class="{ active: currentRouteName == 'group-details-member' }"
            >Thành viên</router-link
          >
          <router-link
            :to="{
              name: 'group-details-media',
              params: {
                id: groupInfo.id,
              },
            }"
            class="group-nav-item"
            :class="{ active: currentRouteName == 'group-details-media' }"
            >File phương tiện</router-link
          >
          <router-link
            v-if="groupInfo.currentMember?.isAdmin"
            :to="{
              name: 'group-details-manager',
              params: {
                id: groupInfo.id,
              },
            }"
            class="group-nav-item relative"
            :class="{ active: currentRouteName == 'group-details-manager' }"
            >Quản lý
            <Badge v-if="inviteCount > 0" :value="inviteCount"></Badge>
          </router-link>
        </div>
        <div
          class="group-nav-action"
          v-click-outside="() => (isShowGroupMore = false)"
        >
          <button
            class="group-nav-search btn"
            @click="isShowGroupMore = !isShowGroupMore"
          >
            <i class="nav-search-icon pi pi-ellipsis-h"></i>
          </button>
          <div class="group-more-list" v-if="isShowGroupMore">
            <div class="group-more-item" @click="isShowReport = true">
              Báo cáo nhóm
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ReportComponent
    v-if="isShowReport"
    :title="'Báo cáo nhóm'"
    :relationId="groupInfo.id"
    :reportType="REPORT_TYPE.GROUP"
    @onClose="isShowReport = false"
    @onSubmit="isShowReport = false"
  ></ReportComponent>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { REPORT_TYPE } from "@/constants";
export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const isShowJoinAction = ref(false);
    const isShowGroupMore = ref(false);
    const groupInfo = computed(() => store.getters["group/getGroupInfo"]);

    const isShowReport = ref(false);

    async function handleCancelRequestInvite() {
      await store.dispatch("group/cancelRequestInvite");
    }

    async function handleSendRequestInvite() {
      await store.dispatch("group/sendRequestInvite");
    }

    async function handleDeleteGroup() {
      await store.dispatch("group/deleteGroup");
      router.push({
        name: "home",
      });
    }

    async function handleLeaveGroup() {
      await store.dispatch("group/leaveGroup");
    }

    return {
      isShowJoinAction,
      currentRouteName: computed(() => route.name),
      groupHeaderMember: computed(() => store.getters["group/getHeaderMember"]),
      groupInfo,
      inviteCount: computed(() => store.getters["group/getInviteMemberCount"]),
      handleCancelRequestInvite,
      handleSendRequestInvite,
      handleDeleteGroup,
      handleLeaveGroup,
      routeName: route.name,
      isShowGroupMore,
      isShowReport,
      REPORT_TYPE,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-header-container {
  @apply bg-white;

  .group-header-main {
    max-width: 1250px;
    @apply mx-auto;

    .group-header-cover {
      max-height: 462px;

      @apply rounded-b-lg overflow-hidden;

      img {
        @apply w-full h-full object-cover;
      }
    }
    .group-header-info {
      @apply px-8 mb-6;

      .group-header-name {
        @apply text-28 font-bold mt-5 block;
      }

      .group-header-more {
        @apply flex items-end justify-between;

        .group-header-member {
          .group-header-status {
            @apply flex items-center space-x-1 py-0.5;

            .group-header-type {
              @apply text-gray-600 flex items-center;

              .group-type-icon {
                @apply text-11;
              }
              .group-type-text {
                @apply text-15 ms-1;
              }
            }
            .group-status-split {
              font-size: 2px;
              @apply text-gray-800;
            }
            .group-header-total {
              @apply font-semibold text-15 text-gray-700;
            }
          }

          .member-list {
            @apply flex mt-2;

            .member-item {
              .member-avatar {
                @apply w-9 h-9 rounded-full overflow-hidden border border-white;

                img {
                  @apply w-full h-full object-cover;
                }
              }
            }
          }
        }

        .group-header-action {
          .group-join {
            .group-join-btn {
              @apply relative;

              &.btn-dark {
                @apply bg-gray-200;
              }
              &.btn-primary {
                @apply bg-primary;
              }

              .group-joined-action {
                @apply absolute top-12 right-0 w-40 z-10 bg-white rounded-lg shadow-custom-md p-2;

                .joined-action-item {
                  @apply p-2 rounded-lg w-full font-semibold text-15 hover:bg-gray-100 transition-all text-left;
                }
              }
            }
          }
        }
      }
    }
    .group-header-navbar {
      @apply mx-8 flex justify-between items-center border-t;

      .group-header-nav {
        @apply flex items-center my-1;

        .group-nav-item {
          @apply p-4 text-gray-600 font-semibold text-15 rounded-lg hover:bg-gray-200 transition-all relative cursor-pointer;

          &.active {
            @apply text-primary relative hover:bg-white;
            &::before {
              content: "";
              @apply absolute left-0 right-0 h-0.75 top-full bg-primary;
            }
          }
        }
      }
      .group-nav-action {
        @apply relative;

        .group-nav-search {
          @apply flex items-center justify-center bg-gray-200 w-8 h-10;
          .nav-search-icon {
            @apply font-semibold text-gray-700;
          }
        }

        .group-more-list {
          @apply absolute top-6 right-2 w-40 bg-white shadow-custom-sm rounded-lg p-2;
          .group-more-item {
            @apply p-2 py-1.5 rounded-lg text-15 font-semibold cursor-pointer hover:bg-gray-100;
          }
        }
      }
    }
  }
}
</style>
