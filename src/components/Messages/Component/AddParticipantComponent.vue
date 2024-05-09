<template>
  <div class="add-participant-container" @click.prevent.self="onClose">
    <div class="add-participant-tab">
      <div class="add-participant-header">
        <div class=""></div>
        <div class="add-header-text">Thêm người</div>
        <div class="add-header-close" @click="onClose">
          <i class="header-close-icon pi pi-times"></i>
        </div>
      </div>
      <div class="add-participant-search">
        <i class="search-participant-icon pi pi-search"></i>
        <input
          type="text"
          class="search-participant-input"
          v-model="searchString"
        />
      </div>
      <div class="participant-added-empty" v-if="!participantSelected.length">
        Chưa người dùng nào được chọn
      </div>
      <div class="participant-added-list">
        <div
          class="participant-added-item"
          v-for="participant in participantSelected"
          :key="participant.id"
        >
          <div class="participant-item-avatar">
            <img :src="participant.user.avatarUrl" alt="" />
            <div
              class="participant-user-delete"
              @click="handleDeleteParticipant(participant.id)"
            >
              <i class="participant-delete-icon pi pi-times"></i>
            </div>
          </div>
          <div class="participant-item-name">
            {{ participant.user.firstName + " " + participant.user.lastName }}
          </div>
        </div>
      </div>
      <div class="participant-search-list scroll">
        <div
          class="participant-search-item"
          v-for="friend in friendData.data"
          :key="friend.id"
          @click="handleAddParticipant(friend)"
        >
          <div class="participant-user-avatar">
            <img :src="friend.user.avatarUrl" alt="" />
          </div>
          <div class="participant-user-name">
            {{ friend.user.firstName + " " + friend.user.lastName }}
          </div>
        </div>
      </div>
      <div class="add-participant-action">
        <button
          class="add-participant-btn"
          :class="{ disable: !isCanSubmit }"
          @click="handleSubmitCreate"
          :disabled="!isCanSubmit"
        >
          Thêm người
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { toastAlert } from "@/utilities/toastAlert";
import { friendshipService } from "@/services/friendship.service";
import tokenService from "@/services/token.service";
import { conversationService } from "@/services/conversation.service";
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
    const searchString = ref(null);
    const isCanSubmit = computed(() => participantSelected.length);

    const friendData = reactive({
      data: [],
      pageSize: 10,
      pageNumber: 0,
      searchString: null,
      total: 0,
      isFetched: false,
    });

    const participantSelected = reactive([]);

    function handleAddParticipant(friend) {
      const participant = participantSelected.find((x) => x.id == friend.id);
      if (!participant) {
        participantSelected.push(friend);
      }
    }

    function handleDeleteParticipant(id) {
      const index = participantSelected.findIndex((x) => x.id == id);
      if (index != -1) {
        participantSelected.splice(index, 1);
      }
    }

    async function handleSubmitCreate() {
      if (participantSelected.length) {
        try {
          await conversationService.createParticipant(props.conversationId, {
            userIds: participantSelected.map((item) => item.user.id),
          });
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi thêm người");
        }
        onClose();
      }
    }

    function onClose() {
      emit("onClose");
    }

    let timeOut;
    watch(
      () => searchString.value,
      (newVal) => {
        clearTimeout(timeOut);
        timeOut = setTimeout(async () => {
          await getFriend(friendData, newVal);
        }, 500);
      }
    );

    onMounted(async () => {
      await getFriend(friendData);
    });

    return {
      friendData,
      participantSelected,
      searchString,
      isCanSubmit,
      handleAddParticipant,
      handleDeleteParticipant,
      handleSubmitCreate,
      onClose,
    };
  },
};

async function getFriend(data, searchString) {
  if (data.searchString != searchString) {
    resetData(data);
    data.searchString = searchString;
  }

  if (data.pageSize * data.pageNumber < data.total || !data.isFetched) {
    try {
      const res = await friendshipService.get({
        pageSize: data.pageSize,
        pageNumber: data.pageNumber + 1,
        searchString: data.searchString,
        type: 3,
      });

      data.data.push(
        ...res.data.map((item) => {
          return {
            id: item.id,
            user:
              item.requestUser.id == user.id
                ? item.targetUser
                : item.requestUser,
          };
        })
      );
      data.total = res.totalItems;
      data.pageNumber++;
      data.isFetched = true;
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi tải bạn bè");
    }
  }
}

function resetData(data) {
  data.data = [];
  data.pageNumber = 0;
  data.searchString = null;
  data.isFetched = false;
  data.total = 0;
}
</script>

<style lang="scss" scoped>
.add-participant-container {
  @apply fixed top-0 bottom-0 left-0 right-0 bg-white bg-opacity-50 flex items-center justify-center;

  .add-participant-tab {
    @apply bg-white w-700px rounded-lg border border-gray-100 shadow-custom-sm;

    .add-participant-header {
      @apply flex items-center justify-between border-b border-gray-100 p-4 py-3;

      .add-header-text {
        @apply font-bold text-xl;
      }

      .add-header-close {
        @apply w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center;

        .header-close-icon {
          @apply text-15;
        }
      }
    }

    .add-participant-search {
      @apply m-4 relative;

      .search-participant-icon {
        @apply absolute left-3 top-1/2 -translate-y-1/2 text-15 text-gray-500;
      }

      .search-participant-input {
        @apply text-15 p-1.5 ps-8 rounded-full bg-gray-100 w-full outline-none border-none;
      }
    }

    .participant-added-empty {
      @apply text-15 text-center py-3;
    }

    .participant-added-list {
      @apply flex items-center flex-wrap m-4;

      .participant-added-item {
        @apply flex flex-col items-center me-4 mb-2;

        .participant-item-avatar {
          @apply w-10 h-10 rounded-full relative;

          img {
            @apply w-full h-full rounded-full object-cover;
          }
        }

        .participant-user-delete {
          @apply absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center bg-gray-100 cursor-pointer;

          .participant-delete-icon {
            @apply text-gray-500;
            font-size: 10px;
          }
        }
      }
      .participant-item-name {
        @apply text-13 text-gray-500 truncate;
      }
    }

    .participant-search-list {
      @apply h-60 overflow-y-auto mx-4;

      .participant-search-item {
        @apply p-2 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 rounded-lg;

        .participant-user-avatar {
          @apply w-10 h-10 rounded-full overflow-hidden;

          img {
            @apply w-full h-full object-cover;
          }
        }

        .participant-user-name {
          @apply text-15 font-semibold;
        }
      }
    }

    .add-participant-action {
      @apply m-4;
      .add-participant-btn {
        @apply text-15 w-full font-semibold bg-primary text-white rounded-lg p-2 px-3;

        &.disable {
          @apply bg-gray-200 text-gray-600;
        }
      }
    }
  }
}
</style>
