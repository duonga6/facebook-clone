<template>
  <div class="group-header-container">
    <div class="group-header-main">
      <div class="group-header-cover">
        <img
          src="https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png"
          alt=""
        />
      </div>
      <div class="group-header-info">
        <div class="group-header-name">
          {{ data.name }}
        </div>
        <div class="group-header-more">
          <div class="group-header-member">
            <div class="group-header-status">
              <div class="group-header-type">
                <i class="group-type-icon pi pi-globe"></i>
                <span class="group-type-text"
                  >Nhóm {{ data.isPublic ? "Công khai" : "Riêng tư" }}</span
                >
              </div>
              <div class="group-status-split pi pi-circle-fill"></div>
              <div class="group-header-total">
                {{ data.totalMember }} thành viên
              </div>
            </div>
            <div class="group-header-member">
              <ul class="member-list">
                <li class="member-item" v-for="i in 5" :key="i">
                  <div class="member-avatar">
                    <img
                      src="https://i.pinimg.com/736x/bf/eb/a8/bfeba832a872fef7b0426e3c314041d9.jpg"
                      alt=""
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="group-header-action">
            <div class="group-join">
              <button class="group-join-btn btn btn-dark" v-if="data.isJoined">
                Đã tham gia
              </button>
              <button
                class="group-join-btn btn btn-dark"
                v-else-if="data.isWaitingAccept"
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
          <div class="group-nav-item active">Thảo luận</div>
          <div class="group-nav-item">Mọi người</div>
          <div class="group-nav-item">File phương tiện</div>
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
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ["onCancelRequestInvite", "onSentRequestInvite"],
  setup(props, { emit }) {
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
      handleCancelRequestInvite,
      handleSendRequestInvite,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-header-container {
  @apply pt-14;

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
