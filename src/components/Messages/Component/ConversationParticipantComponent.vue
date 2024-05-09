<template>
  <div class="conversation-member-container" @click.prevent.self="onClose">
    <div class="conversation-member-tab">
      <div class="conversation-member-header">
        <div class=""></div>
        <div class="member-header-text">Thành viên</div>
        <button class="header-close-btn" @click="onClose">
          <i class="close-btn-icon pi pi-times"></i>
        </button>
      </div>
      <div class="conversation-member-type">
        <button
          class="member-type-item"
          :class="{ active: normalParticipant }"
          @click="normalParticipant = true"
        >
          Tất cả
        </button>
        <button
          class="member-type-item"
          :class="{ active: !normalParticipant }"
          @click="normalParticipant = false"
        >
          Quản trị viên
        </button>
      </div>
      <div
        class="conversation-member-list scroll"
        v-show="normalParticipant"
        v-scroll-near-bottom="onScrollNearBottom"
      >
        <div
          class="conversation-member-item"
          v-for="participant in participantData.data"
          :key="participant.id"
        >
          <router-link
            :to="{
              name: 'profile',
              params: {
                id: participant.user.id,
              },
            }"
            class="member-item-avatar"
          >
            <img :src="participant.user.avatarUrl" alt="" />
          </router-link>
          <router-link
            :to="{
              name: 'profile',
              params: {
                id: participant.user.id,
              },
            }"
            class="member-item-info"
          >
            <div class="member-item-name">
              {{ participant.user.firstName + " " + participant.user.lastName }}
            </div>
            <div class="member-item-role" v-if="participant.isAdmin">
              Quản trị viên
            </div>
          </router-link>
          <button
            v-if="
              !participant.isSuperAdmin &&
              participant.id != currentParticipant?.id &&
              currentParticipant?.isAdmin
            "
            class="member-item-more"
            @click="() => (participant.isShowMore = !participant.isShowMore)"
            v-click-outside="() => (participant.isShowMore = false)"
          >
            <i class="member-more-icon pi pi-ellipsis-h"></i>
            <div class="member-more-list" v-if="participant.isShowMore">
              <div
                class="member-more-item"
                v-if="currentParticipant.isSuperAdmin && !participant.isAdmin"
                @click="handleSetAdmin(participant.id)"
              >
                Đặt làm quản trị viên
              </div>
              <div
                class="member-more-item"
                v-if="currentParticipant.isSuperAdmin && participant.isAdmin"
                @click="handleRemoveAdmin(participant.id)"
              >
                Thu hồi quản trị viên
              </div>
              <div
                class="member-more-item"
                v-if="
                  currentParticipant.isSuperAdmin ||
                  (currentParticipant.isAdmin &&
                    !participant.isAdmin &&
                    !participant.isSuperAdmin)
                "
                @click="handleDeleteMember(participant.id)"
              >
                Xóa thành viên
              </div>
            </div>
          </button>
        </div>
      </div>
      <div
        class="conversation-member-list scroll"
        v-show="!normalParticipant"
        v-scroll-near-bottom="onScrollNearBottom"
      >
        <div
          class="conversation-member-item"
          v-for="participant in participantAdmin.data"
          :key="participant.id"
        >
          <router-link
            :to="{
              name: 'profile',
              params: {
                id: participant.user.id,
              },
            }"
            class="member-item-avatar"
          >
            <img :src="participant.user.avatarUrl" alt="" />
          </router-link>
          <router-link
            :to="{
              name: 'profile',
              params: {
                id: participant.user.id,
              },
            }"
            class="member-item-info"
          >
            <div class="member-item-name">
              {{ participant.user.firstName + " " + participant.user.lastName }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { conversationService } from "@/services/conversation.service";
import { toastAlert } from "@/utilities/toastAlert";
import tokenService from "@/services/token.service";
const user = tokenService.getUser();
export default {
  props: {
    conversationId: {
      type: String,
      required: true,
    },
  },
  emits: ["onClose"],
  setup(props, { emit }) {
    const normalParticipant = ref(true);
    const currentParticipant = ref(null);
    const participantData = reactive({
      data: [],
      pageSize: 10,
      pageNumber: 0,
      total: 0,
      isFetched: false,
    });

    const participantAdmin = reactive({
      data: [],
      pageSize: 10,
      pageNumber: 0,
      total: 0,
      isFetched: false,
    });

    function onClose() {
      emit("onClose");
    }

    let isFetchingData = false;

    async function onScrollNearBottom() {
      if (!isFetchingData) {
        isFetchingData = true;
        if (normalParticipant.value) {
          await getParticipant(props.conversationId, participantData);
        } else {
          await getParticipantAdmin(props.conversationId, participantAdmin);
        }
      }
    }

    async function handleSetAdmin(id) {
      const participant = participantData.data.find((x) => x.id == id);

      if (participant) {
        try {
          await conversationService.createParticipantAdmin(
            participant.conversationId,
            {
              participantId: participant.id,
            }
          );
          participant.isAdmin = true;
          resetParticipantAdmin(participantAdmin);
          await getParticipantAdmin(props.conversationId, participantAdmin);
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi chỉ định quản trị viên");
        }
      }
    }

    async function handleRemoveAdmin(id) {
      const participant = participantData.data.find((x) => x.id == id);

      if (participant) {
        try {
          await conversationService.deleteParticipantAdmin(
            participant.conversationId,
            participant.id
          );
          participant.isAdmin = false;
          resetParticipantAdmin(participantAdmin);
          await getParticipantAdmin(props.conversationId, participantAdmin);
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi thu hồi quản trị viên");
        }
      }
    }

    async function handleDeleteMember(id) {
      const participant = participantData.data.find((x) => x.id == id);

      if (participant) {
        try {
          await conversationService.deleteParticipant(
            participant.conversationId,
            participant.id
          );

          if (participant.isAdmin) {
            resetParticipantAdmin(participantAdmin);
            await getParticipantAdmin(props.conversationId, participantAdmin);
          }

          participantData.data = participantData.data.filter(
            (x) => x.id != participant.id
          );
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi xóa thành viên");
        }
      }
    }

    onMounted(async () => {
      await getParticipant(props.conversationId, participantData);
      await getParticipantAdmin(props.conversationId, participantAdmin);
      await getCurrentParticipant(props.conversationId, currentParticipant);
    });

    return {
      participantData,
      participantAdmin,
      normalParticipant,
      onClose,
      onScrollNearBottom,
      currentParticipant,
      handleSetAdmin,
      handleRemoveAdmin,
      handleDeleteMember,
    };
  },
};

async function getParticipant(conversationId, data) {
  if (data.pageSize * data.pageNumber < data.total || !data.isFetched) {
    try {
      const participantRes = await conversationService.getParticipant(
        conversationId,
        {
          pageSize: data.pageSize,
          pageNumber: data.pageNumber + 1,
        }
      );

      data.data.push(
        ...participantRes.data.map((item) => {
          return {
            ...item,
            isShowMore: false,
          };
        })
      );
      data.pageNumber++;
      data.total = participantRes.totalItems;
      data.isFetched = true;
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi lấy dữ liệu thành viên");
    }
  }
}

async function getParticipantAdmin(conversationId, data) {
  if (data.pageSize * data.pageNumber < data.total || !data.isFetched) {
    try {
      const participantRes = await conversationService.getParticipantAdmin(
        conversationId,
        {
          pageSize: data.pageSize,
          pageNumber: data.pageNumber + 1,
        }
      );

      data.data.push(
        ...participantRes.data.map((item) => {
          return {
            ...item,
            isShowMore: false,
          };
        })
      );
      data.pageNumber++;
      data.total = participantRes.totalItems;
      data.isFetched = true;
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi lấy dữ liệu thành viên");
    }
  }
}

async function getCurrentParticipant(conversationId, data) {
  try {
    const participantRes = await conversationService.getParticipantByUserId(
      conversationId,
      user.id
    );
    data.value = participantRes.data;
  } catch (error) {
    console.error(error);
    toastAlert.error("Có lỗi khi lấy thông tin thành viên của bạn");
  }
}

function resetParticipantAdmin(data) {
  data.data = [];
  data.pageNumber = 0;
  data.total = 0;
  data.isFetched = false;
}
</script>

<style lang="scss" scoped>
.conversation-member-container {
  @apply fixed top-0 left-0 right-0 bottom-0 bg-white bg-opacity-50 z-10 flex items-center justify-center;

  .conversation-member-tab {
    @apply bg-white rounded-lg border border-gray-200 shadow-custom-sm w-500px;

    .conversation-member-header {
      @apply flex justify-between items-center p-3 border-b border-gray-100;

      .member-header-text {
        @apply font-bold text-xl;
      }
      .header-close-btn {
        @apply w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center;

        .close-btn-icon {
          @apply text-gray-500 text-15;
        }
      }
    }
    .conversation-member-type {
      @apply flex items-center p-2 px-4;

      .member-type-item {
        @apply font-semibold text-15 p-4 py-3 hover:bg-gray-100 rounded-lg;

        &.active {
          @apply text-primary relative bg-none;

          &::before {
            content: "";
            @apply absolute top-full left-0 right-0 h-0.75 bg-primary;
          }
        }
      }
    }
    .conversation-member-list {
      @apply p-2 max-h-80 overflow-y-auto;

      .conversation-member-item {
        @apply flex items-center p-2;

        .member-item-avatar {
          @apply w-12 h-12 rounded-full overflow-hidden;

          img {
            @apply w-full h-full object-cover;
          }
        }

        .member-item-info {
          @apply ms-2;

          .member-item-name {
            @apply font-semibold text-15 leading-18;
          }
          .member-item-role {
            @apply text-13 text-gray-500 leading-15;
          }
        }

        .member-item-more {
          @apply ms-auto relative w-8 h-8 hover:bg-gray-100 transition-all rounded-full flex items-center justify-center;

          &.active {
            @apply bg-gray-100;
          }

          .member-more-icon {
            @apply text-gray-500 font-semibold;
          }

          .member-more-list {
            @apply absolute top-full right-0 p-1 bg-white rounded-lg border border-gray-100 shadow-custom-sm w-60 z-50;

            .member-more-item {
              @apply font-semibold text-15 text-left p-1.5 hover:bg-gray-100 transition-all rounded-lg cursor-pointer;
            }
          }
        }
      }
    }
  }
}
</style>
