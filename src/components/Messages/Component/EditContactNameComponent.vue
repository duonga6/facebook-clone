<template>
  <div class="conversation-nickname-container" @click="handleClose">
    <div class="conversation-nickname-tab" @click.stop="">
      <div class="conversation-nickname-header">
        <div class=""></div>
        <div class="nickname-header-text">Biệt danh</div>
        <button class="nickname-header-btn" @click="handleClose">
          <i class="header-btn-icon pi pi-times"></i>
        </button>
      </div>
      <div class="participant-search">
        <i class="participant-search-icon pi pi-search"></i>
        <input
          type="text"
          class="participant-search-input"
          v-model="participantSearch"
          placeholder="Tìm kiếm thành viên"
        />
      </div>
      <div
        class="conversation-nickname-list scroll"
        v-scroll-near-bottom="onGetParticipant"
      >
        <div
          class="conversation-nickname-item"
          v-for="participant in participantData.data"
          :key="participant.id"
          @click="handleEditNickName(participant.id)"
        >
          <div class="user-avatar">
            <img :src="participant.user.avatarUrl" alt="" />
          </div>
          <div class="user-info">
            <template v-if="!participant.editing">
              <div class="user-nickname">{{ participant.userContactName }}</div>
              <div class="user-fullname">
                {{
                  participant.user.firstName + " " + participant.user.lastName
                }}
              </div>
            </template>
            <template v-else>
              <div class="user-info-edit">
                <input
                  class="info-edit-input"
                  type="text"
                  :placeholder="participant.userContactName"
                  v-model="participant.newContactName"
                  @keyup.enter="handleAcceptChangeNickName(participant.id)"
                />
              </div>
            </template>
          </div>
          <template v-if="!participant.editing">
            <button class="edit-nickname-btn">
              <svg
                viewBox="0 0 12 13"
                width="20"
                height="20"
                fill="currentColor"
                class="text-dark"
              >
                <g fill-rule="evenodd" transform="translate(-450 -1073)">
                  <path
                    d="M450.864 1081.897a1.246 1.246 0 0 0-.364.881l.003 1.903c0 .174.142.315.316.315l1.903.004c.33 0 .648-.13.881-.364l5.47-5.476a.251.251 0 0 0 0-.354l-2.381-2.382a.25.25 0 0 0-.355 0l-5.473 5.473zm10.364-4.893a.938.938 0 0 0 0-1.323l-1.407-1.406a.946.946 0 0 0-1.334 0l-1.086 1.086a.25.25 0 0 0 0 .355l2.38 2.381a.251.251 0 0 0 .355 0l1.092-1.093zm.272 7.996h-6a.501.501 0 0 1-.5-.5c0-.275.225-.5.5-.5h6c.275 0 .5.225.5.5s-.225.5-.5.5"
                  ></path>
                </g>
              </svg>
            </button>
          </template>
          <template v-else>
            <button
              class="edit-nickname-btn"
              @click.stop="handleAcceptChangeNickName(participant.id)"
            >
              <svg
                viewBox="0 0 12 13"
                width="20"
                height="20"
                fill="currentColor"
                class="text-dark"
              >
                <g fill-rule="evenodd" transform="translate(-450 -1073)">
                  <path
                    fill-rule="nonzero"
                    d="M451.78 1079.098a.75.75 0 0 0-1.06 1.06l3.08 3.082a.75.75 0 0 0 1.061 0l6.42-6.42a.75.75 0 0 0-1.061-1.06l-5.889 5.889-2.55-2.55z"
                  ></path>
                </g>
              </svg>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";
import { toastAlert } from "@/utilities/toastAlert";
import { conversationService } from "@/services/conversation.service";
import { useStore } from "vuex";
import eventBus from "@/common/EventBus";
export default {
  props: {
    conversationId: {
      type: String,
      required: true,
    },
  },
  emits: ["onClose"],
  setup(props, { emit }) {
    const store = useStore();
    const participantSearch = ref(null);
    const participantData = reactive({
      conversationId: props.conversationId,
      data: [],
      pageSize: 10,
      pageNumber: 0,
      total: 0,
      isFetched: false,
      searchString: null,
    });

    function handleEditNickName(id) {
      const participant = participantData.data.find((x) => x.id == id);
      if (participant) {
        participant.editing = true;
      }
    }

    function handleClose() {
      emit("onClose");
    }

    async function handleAcceptChangeNickName(id) {
      const participant = participantData.data.find((x) => x.id == id);
      if (participant) {
        participant.editing = false;
        if (
          participant.userContactName != participant.newContactName &&
          participant.newContactName
        ) {
          store
            .dispatch("conversation/changeNickName", {
              conversationId: props.conversationId,
              participantId: participant.id,
              name: participant.newContactName,
            })
            .then((data) => {
              eventBus.dispatch("ChangeContactName", data);
              participant.userContactName = participant.newContactName;
              participant.newContactName = null;
            });
        }
      }
    }

    let isFetchingParticipant = false;

    async function onGetParticipant() {
      if (!isFetchingParticipant) {
        isFetchingParticipant = true;
        await getParticipant(participantData, participantSearch.value);
        isFetchingParticipant = false;
      }
    }

    let timeOutFetch;
    watch(
      () => participantSearch.value,
      (newVal) => {
        clearTimeout(timeOutFetch);
        timeOutFetch = setTimeout(async () => {
          await getParticipant(participantData, newVal);
        }, 500);
      }
    );

    onMounted(async () => {
      await getParticipant(participantData, participantSearch.value);
    });

    return {
      participantData,
      participantSearch,
      handleClose,
      handleEditNickName,
      handleAcceptChangeNickName,
      onGetParticipant,
    };
  },
};

async function getParticipant(data, searchString) {
  if (data.searchString != searchString) {
    resetParticipantData(data);
  }

  data.searchString = searchString;

  if (data.pageSize * data.pageNumber < data.total || !data.isFetched) {
    try {
      const participantRes = await conversationService.getParticipant(
        data.conversationId,
        {
          pageSize: data.pageSize,
          pageNumber: data.pageNumber + 1,
          searchString: data.searchString,
        }
      );

      data.data.push(
        ...participantRes.data.map((item) => {
          return {
            ...item,
            editing: false,
            newContactName: null,
          };
        })
      );
      data.pageNumber++;
      data.total = participantRes.totalItems;
      data.isFetched = true;
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi tải thành viên");
    }
  }
}

function resetParticipantData(data) {
  data.data = [];
  data.pageNumber = 0;
  data.searchString = null;
  data.total = 0;
  data.isFetched = false;
}
</script>

<style lang="scss" scoped>
.conversation-nickname-container {
  @apply fixed top-0 left-0 bottom-0 right-0 bg-white bg-opacity-50 flex items-center justify-center;
  z-index: 50;

  .conversation-nickname-tab {
    @apply w-700px border bg-white border-gray-100 rounded-lg shadow-custom-sm;

    .conversation-nickname-header {
      @apply flex items-start justify-between p-2 py-3 border-b border-gray-100;

      .nickname-header-text {
        @apply font-bold text-lg;
      }
      .nickname-header-btn {
        @apply w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center;
        .header-btn-icon {
          @apply text-gray-500;
        }
      }
    }

    .participant-search {
      @apply m-2 mx-4 relative;

      .participant-search-icon {
        @apply absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-15;
      }

      .participant-search-input {
        @apply bg-gray-100 rounded-full w-full p-1.5 ps-8 text-15 outline-none border-none;
      }
    }

    .conversation-nickname-list {
      @apply p-2 max-h-80 overflow-y-auto;

      .conversation-nickname-item {
        @apply p-2 flex items-center cursor-pointer;

        .user-avatar {
          @apply w-12 h-12 rounded-full overflow-hidden;

          img {
            @apply w-full h-full object-cover;
          }
        }

        .user-info {
          @apply flex flex-col ms-4 flex-1;

          .user-nickname {
            @apply text-15 font-semibold leading-18;
          }

          .user-fullname {
            @apply text-13;
          }

          .user-info-edit {
            @apply me-4;

            .info-edit-input {
              @apply w-full outline-primary p-2;
            }
          }
        }

        .edit-nickname-btn {
          @apply w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100;
        }
      }
    }
  }
}
</style>
