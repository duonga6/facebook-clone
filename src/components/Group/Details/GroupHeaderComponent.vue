<template>
  <div class="group-header-container" v-if="groupInfo">
    <div class="group-header-main">
      <div class="group-header-cover">
        <img :src="groupInfo.coverImage" alt="" />
      </div>
      <div class="group-header-info">
        <div class="group-header-name">
          {{ groupInfo.name }}
        </div>
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
              <div
                class="group-join-btn btn btn-dark"
                v-if="groupInfo.currentMember"
              >
                Đã tham gia
              </div>
              <button
                class="group-join-btn btn btn-dark"
                v-else-if="
                  groupInfo.currentInvite && !group.currentInvite.adminAccepted
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
      <div class="group-header-navbar">
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
            class="group-nav-item"
            :class="{ active: currentRouteName == 'group-details-manager' }"
            >Quản lý</router-link
          >
        </div>
        <div class="group-nav-action">
          <button class="group-nav-search btn">
            <i class="nav-search-icon pi pi-search"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toastAlert } from "@/utilities/toastAlert";
import { groupInviteService } from "@/services/group-invite.service";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    async function handleCancelRequestInvite() {
      try {
        await groupInviteService.deleteByGroupId(props.data.id);
        emit("onCancelRequestInvite");
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi hủy yêu cầu");
      }
    }

    async function handleSendRequestInvite() {
      try {
        await groupInviteService.create({
          groupId: props.data.id,
        });
        emit("onSentRequestInvite");
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi yêu cầu tham gia nhóm");
      }
    }

    return {
      currentRouteName: computed(() => route.name),
      groupHeaderMember: computed(() => store.getters["group/getHeaderMember"]),
      groupInfo: computed(() => store.getters["group/getGroupInfo"]),
      handleCancelRequestInvite,
      handleSendRequestInvite,
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
      @apply px-8;

      .group-header-name {
        @apply text-28 font-bold mt-5;
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
              &.btn-dark {
                @apply bg-gray-200;
              }
              &.btn-primary {
                @apply bg-primary;
              }
            }
          }
        }
      }
    }
    .group-header-navbar {
      @apply mx-8 mt-6 flex justify-between items-center border-t;

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
        .group-nav-search {
          @apply flex items-center justify-center bg-gray-200 w-8 h-10;
          .nav-search-icon {
            @apply font-semibold text-gray-700;
          }
        }
      }
    }
  }
}
</style>
