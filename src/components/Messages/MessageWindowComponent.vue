<template>
  <div
    class="message-window-container"
    v-if="data"
    @click="handleClickMessageWindow"
  >
    <div class="message-window-header">
      <div
        class="conversation-info"
        @click="handleShowConversationOption"
        v-click-outside="() => (isShowConversationMore = false)"
      >
        <div class="conversation-image">
          <img v-for="image in data.images" :key="image" :src="image" alt="" />
        </div>
        <div class="conversation-name">{{ data.name }}</div>
      </div>
      <div class="message-header-action">
        <button class="message-header-btn" @click.stop="handleMinimize">
          <i class="header-btn-icon pi pi-minus"></i>
        </button>
        <button class="message-header-btn" @click.stop="handleClose">
          <i class="header-btn-icon pi pi-times"></i>
        </button>
      </div>
    </div>
    <div
      class="message-window-list scroll"
      ref="listMessageEl"
      v-scroll-near-top="onLoadMessage"
    >
      <div
        class="message-item"
        v-for="message in messageData"
        :key="message.id"
        :class="{ self: message.user.id == userId }"
      >
        <div class="message-avatar">
          <img
            :src="message.user.avatarUrl"
            alt=""
            v-if="message.isShowAvatar"
          />
        </div>
        <div
          class="message-content"
          :title="convertDateTitleMessage(message.createdAt)"
        >
          <div
            class="message-participant-name"
            v-if="data.type == 1 && message.isShowContactName"
          >
            {{ message.participant.userContactName }}
          </div>
          <div class="message-content-main">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>
    <div class="message-window-footer">
      <textarea
        ref="inputElement"
        v-model="messageContent"
        class="message-footer-input"
        placeholder="Aa"
        rows="1"
        @input="onContentChange"
        @keydown.prevent.enter="onSendMessage"
      ></textarea>
      <button
        class="message-footer-btn"
        :class="isCanSendMessage ? 'active' : 'disable'"
        :disabled="!isCanSendMessage"
        @click="onSendMessage"
      >
        <i
          class="footer-btn-icon"
          style="
            background-image: url('/src/images/icons/message-icon.png');
            background-position: 0px -1227px;
            background-size: auto;
            width: 16px;
            height: 16px;
            background-repeat: no-repeat;
            display: inline-block;
          "
        ></i>
      </button>
    </div>
    <div class="message-window-options" v-show="isShowConversationMore">
      <TriangleArrow
        :css="'left-full -ms-2 top-2'"
        :style="'transform: rotateZ(-90deg)'"
      ></TriangleArrow>
      <div class="option-list">
        <div class="option-item" v-if="data.type == 0">
          <div class="option-item-icon">
            <svg viewBox="0 0 20 20" width="20" height="20">
              <g fill-rule="evenodd" transform="translate(-446 -398)">
                <g fill-rule="nonzero">
                  <path
                    d="M113.5 204c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10zm-1.5 0a8.5 8.5 0 1 0-17 0 8.5 8.5 0 0 0 17 0z"
                    transform="translate(352.5 204)"
                  ></path>
                  <path
                    d="M107 201.5c0 2.184-1.537 4-3.5 4s-3.5-1.816-3.5-4c0-2.375 1.221-4 3.5-4s3.5 1.625 3.5 4zm-1.5 0c0-1.625-.658-2.5-2-2.5s-2 .875-2 2.5c0 1.406.926 2.5 2 2.5 1.074 0 2-1.094 2-2.5zm4.5 9.73c-.07-2.63-2.353-4.73-5.11-4.73h-2.78c-2.757 0-5.04 2.1-5.11 4.73l1.5.04c.047-1.798 1.648-3.27 3.61-3.27h2.78c1.962 0 3.563 1.472 3.61 3.27l1.5-.04z"
                    transform="translate(352.5 204)"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
          <router-link
            :to="{
              name: 'profile',
              params: {
                id: userOther?.id,
              },
            }"
            class="option-item-text"
            >Trang cá nhân</router-link
          >
        </div>
        <div
          class="option-item"
          v-if="data.type == 0"
          @click="handleCreateConversationGroup"
        >
          <div class="option-item-icon">
            <i
              style="
                background-image: url('/src/images/icons/conversation-icon.png');
                background-position: 0px -105px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="option-item-text">Tạo nhóm</div>
        </div>
        <div class="option-item" @click="isShowChangeNickName = true">
          <div class="option-item-icon">
            <i
              data-visualcompletion="css-img"
              class="x1b0d499 xep6ejk"
              style="
                background-image: url('/src/images/icons/message-icon2.png');
                background-position: 0px -252px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="option-item-text">Biệt danh</div>
        </div>
        <div
          class="option-item"
          v-if="data.type == 1"
          @click="isShowChangeConversationName = true"
        >
          <div class="option-item-icon">
            <i
              data-visualcompletion="css-img"
              class="x1b0d499 xep6ejk"
              style="
                background-image: url('/src/images/icons/message-icon2.png');
                background-position: 0px -252px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="option-item-text">Tên cuộc trò chuyện</div>
        </div>
        <div
          class="option-item"
          v-if="data.type == 1"
          @click="isShowConversationParticipant = true"
        >
          <div class="option-item-icon">
            <i
              class="x1b0d499 xep6ejk"
              style="
                background-image: url('/src/images/icons/message-icon.png');
                background-position: 0px -214px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="option-item-text">Thành viên</div>
        </div>
        <div
          class="option-item"
          v-if="data.type == 1"
          @click="isShowAddMember = true"
        >
          <div class="option-item-icon">
            <i
              class="x1b0d499 xep6ejk"
              style="
                background-image: url('/src/images/icons/message-icon2.png');
                background-position: 0px -147px;
                background-size: auto;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                display: inline-block;
              "
            ></i>
          </div>
          <div class="option-item-text">Thêm người</div>
        </div>
        <div class="option-item" @click="isShowLeaveGroup = true">
          <div class="option-item-icon">
            <svg
              viewBox="0 0 20 20"
              width="20"
              height="20"
              fill="currentColor"
              class="text-gray-700"
            >
              <g fill-rule="evenodd" transform="translate(-446 -398)">
                <g fill-rule="nonzero">
                  <path
                    d="M105 220.75v2.855a.9.9 0 0 1-.895.895h-9.71a.9.9 0 0 1-.895-.895v-15.21a.9.9 0 0 1 .895-.895h9.71a.9.9 0 0 1 .895.895v3.355a.75.75 0 1 0 1.5 0v-3.355a2.4 2.4 0 0 0-2.395-2.395h-9.71A2.4 2.4 0 0 0 92 208.395v15.21A2.4 2.4 0 0 0 94.395 226h9.71a2.4 2.4 0 0 0 2.395-2.395v-2.855a.75.75 0 1 0-1.5 0z"
                    transform="translate(355 192)"
                  ></path>
                  <path
                    d="M102.25 217h7.5a.75.75 0 1 0 0-1.5h-7.5a.75.75 0 1 0 0 1.5z"
                    transform="translate(355 192)"
                  ></path>
                  <path
                    d="M107.324 218.011a.75.75 0 0 0 1.06 1.06l2.292-2.29a.75.75 0 0 0 0-1.061l-2.292-2.292a.75.75 0 0 0-1.06 1.06l1.761 1.762-1.761 1.761z"
                    transform="translate(355 192)"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
          <div class="option-item-text">Rời nhóm</div>
        </div>
        <div
          class="option-item"
          v-if="currentParticipant?.isSuperAdmin || data.type == 0"
          @click="isShowConfirmDelete = true"
        >
          <div class="option-item-icon">
            <svg
              viewBox="0 0 20 20"
              width="20"
              height="20"
              fill="currentColor"
              class="text-gray-700"
            >
              <g fill-rule="evenodd" transform="translate(-446 -398)">
                <g fill-rule="nonzero">
                  <path
                    d="m106.523 196.712-2.32-2.256a1.62 1.62 0 0 0-1.13-.456h-3.146a1.62 1.62 0 0 0-1.13.456l-2.32 2.256a.75.75 0 0 0 1.046 1.076l2.32-2.256a.12.12 0 0 1 .084-.032h3.146a.12.12 0 0 1 .084.032l2.32 2.256a.75.75 0 1 0 1.046-1.076zm-5.773 5.788v8a.75.75 0 1 0 1.5 0v-8a.75.75 0 1 0-1.5 0zm3.501-.047-.5 8a.75.75 0 1 0 1.498.094l.5-8a.75.75 0 1 0-1.498-.094zm-7 .094.5 8a.75.75 0 1 0 1.498-.094l-.5-8a.75.75 0 1 0-1.498.094z"
                    transform="translate(354.5 204)"
                  ></path>
                  <path
                    d="M109.327 196.5H93.673a1.17 1.17 0 0 0-1.173 1.167v1.666a1.17 1.17 0 0 0 1.173 1.167h15.654a1.17 1.17 0 0 0 1.173-1.167v-1.666a1.17 1.17 0 0 0-1.173-1.167zM109 199H94v-1h15v1z"
                    transform="translate(354.5 204)"
                  ></path>
                  <path
                    d="M108.25 199a.75.75 0 0 1 .747.818l-1.092 12.011a2.387 2.387 0 0 1-2.377 2.171h-8.056a2.386 2.386 0 0 1-2.377-2.17l-1.092-12.012a.75.75 0 0 1 .747-.818h13.5zm-12.679 1.5 1.018 11.194a.887.887 0 0 0 .883.806h8.056c.459 0 .842-.35.883-.806l1.018-11.194H95.57z"
                    transform="translate(354.5 204)"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
          <div class="option-item-text">Xóa đoạn chat</div>
        </div>
      </div>
    </div>
  </div>

  <CreateConversationGroup
    v-if="isShowCreateConversation"
    :conversationId="data.id"
    :defaultUser="userOther"
    @onClose="isShowCreateConversation = false"
  ></CreateConversationGroup>

  <EditContactName
    v-if="isShowChangeNickName"
    :conversationId="data.id"
    @onClose="isShowChangeNickName = false"
  ></EditContactName>

  <ConversationParticipant
    v-if="isShowConversationParticipant"
    :conversationId="data.id"
    @onClose="isShowConversationParticipant = false"
  ></ConversationParticipant>

  <AddParticipant
    v-if="isShowAddMember"
    :conversationId="data.id"
    @onClose="isShowAddMember = false"
  ></AddParticipant>

  <LeaveConversation
    v-if="isShowLeaveGroup"
    @onClose="isShowLeaveGroup = false"
    @onSubmit="onSubmitLeave"
  ></LeaveConversation>

  <ConfirmDeleteConversation
    v-if="isShowConfirmDelete"
    @onClose="isShowConfirmDelete = false"
    @onSubmit="onSubmitDelete"
  ></ConfirmDeleteConversation>

  <div
    class="conversation-name-change"
    v-if="isShowChangeConversationName"
    @click="isShowChangeConversationName = false"
  >
    <div class="conversation-name-tab" @click.stop="">
      <div class="conversation-name-header">
        <div class=""></div>
        <div class="name-header-text">Đổi tên đoạn chat</div>
        <button
          class="header-close-btn"
          @click="isShowChangeConversationName = false"
        >
          <i class="close-btn-icon pi pi-times"></i>
        </button>
      </div>
      <div class="conversation-name-content">
        <input
          class="name-content-input"
          type="text"
          v-model="conversationName"
        />
      </div>
      <div class="conversation-name-action">
        <button
          class="name-action-btn btn--second"
          @click="isShowChangeConversationName = false"
        >
          Hủy
        </button>
        <button
          class="name-action-btn"
          :class="isCanChangeName ? 'btn--primary' : 'btn--disable'"
          :disabled="!isCanChangeName"
          @click="handleSubmitChangeName"
        >
          Lưu
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import tokenService from "@/services/token.service";
import { convertDateTitleMessage } from "@/utilities/dateUtils";
import eventBus from "@/common/EventBus";
import { toastAlert } from "@/utilities/toastAlert";
import { conversationService } from "@/services/conversation.service";
const userId = tokenService.getUser().id;
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ["onClose", "onMinimize"],
  setup(props, { emit }) {
    const store = useStore();
    const messageContent = ref(null);
    const currentParticipant = ref(null);
    const isFirstScroll = ref(false);
    const isCanSendMessage = computed(() => {
      if (!messageContent.value || !messageContent.value.trim()) {
        return false;
      }
      return true;
    });
    const isCanChangeName = computed(() => {
      if (
        !conversationName.value ||
        !conversationName.value.trim() ||
        conversationName.value == props.data.name
      ) {
        return false;
      }

      return true;
    });
    const isShowConversationMore = ref(false);
    const isShowCreateConversation = ref(false);
    const isShowChangeNickName = ref(false);
    const isShowChangeConversationName = ref(false);
    const isFetchingMessage = ref(false);
    const isShowConversationParticipant = ref(false);
    const isShowAddMember = ref(false);
    const isShowLeaveGroup = ref(false);
    const isShowConfirmDelete = ref(false);

    const conversationName = ref(props.data.name);

    const userOther = computed(() => {
      const participant = props.data.participants.data.find(
        (x) => x.user.id != userId
      );
      if (participant) {
        return participant.user;
      } else {
        return null;
      }
    });

    const messageData = computed(() =>
      props.data.messages.data.map((item, index, arr) => {
        return {
          ...item,
          isShowAvatar: arr[index].user.id != arr[index + 1]?.user.id,
          isShowContactName: arr[index - 1]?.user.id != arr[index].user.id,
        };
      })
    );

    const inputElement = ref(null);
    const listMessageEl = ref(null);

    function handleClose() {
      emit("onClose", props.data.id);
    }

    function handleMinimize() {
      emit("onMinimize", props.data.id);
    }

    function onContentChange(e) {
      const textareaElement = e.target;
      textareaElement.style.height = 0;
      textareaElement.style.height = textareaElement.scrollHeight + "px";
    }

    async function onSendMessage() {
      if (isCanSendMessage.value) {
        store
          .dispatch("conversation/sendMessage", {
            conversationId: props.data.id,
            content: messageContent.value,
          })
          .then((data) => {
            eventBus.dispatch("NewMessage", data);
            messageContent.value = null;
            scrollBottom(listMessageEl.value);
          });
      }
    }

    async function onLoadMessage() {
      if (!isFetchingMessage.value) {
        isFetchingMessage.value = true;
        await store.dispatch("conversation/getMessage", {
          conversationId: props.data.id,
        });
        isFetchingMessage.value = false;
      }
    }

    function handleCreateConversationGroup() {
      isShowCreateConversation.value = true;
    }

    function handleClickMessageWindow() {
      eventBus.dispatch("SeenMessage", props.data.id);
    }

    async function handleSubmitChangeName() {
      isShowChangeConversationName.value = false;
      store
        .dispatch("conversation/changeConversationName", {
          conversationId: props.data.id,
          name: conversationName.value,
        })
        .then((data) => {
          eventBus.dispatch("ChangeConversationName", data);
        });
    }

    async function onSubmitLeave() {
      isShowLeaveGroup.value = false;
      try {
        const participantRes = await conversationService.getParticipantByUserId(
          props.data.id,
          userId
        );

        await conversationService.deleteParticipant(
          props.data.id,
          participantRes.data.id
        );

        store.dispatch("conversation/removeConversation", props.data.id);
      } catch (error) {
        console.error(error);
        toastAlert.error("Có lỗi khi rời nhóm chat");
      }
    }

    async function onSubmitDelete() {
      try {
        isShowConfirmDelete.value = false;

        await conversationService.delete(props.data.id);
        eventBus.dispatch("DeleteConversation", {
          conversationId: props.data.id,
        });

        store.dispatch("conversation/removeConversation", props.data.id);
      } catch (error) {
        console.error(error);
        toastAlert.error("Có lỗi khi xóa đoạn chat");
      }
    }

    async function handleShowConversationOption() {
      if (!isShowConversationMore.value && props.data.type == 1) {
        await getCurrentParticipant(currentParticipant, props.data.id);
      }
      isShowConversationMore.value = !isShowConversationMore.value;
    }

    watch(
      () => props.data.messages.data,
      () => {
        if (!isFirstScroll.value) {
          scrollBottom(listMessageEl.value);
          isFirstScroll.value = true;
        }
      },
      { deep: true }
    );

    onMounted(async () => {
      inputElement.value.focus();
      scrollBottom(listMessageEl.value);
    });

    return {
      messageContent,
      isCanSendMessage,
      inputElement,
      userId,
      userOther,
      listMessageEl,
      isShowConversationMore,
      isShowChangeNickName,
      isShowChangeConversationName,
      isCanChangeName,
      isShowCreateConversation,
      isShowConversationParticipant,
      isShowConfirmDelete,
      conversationName,
      messageData,
      isShowAddMember,
      isShowLeaveGroup,
      currentParticipant,
      handleClose,
      handleMinimize,
      onContentChange,
      onSendMessage,
      onLoadMessage,
      convertDateTitleMessage,
      handleCreateConversationGroup,
      handleClickMessageWindow,
      handleSubmitChangeName,
      onSubmitLeave,
      handleShowConversationOption,
      onSubmitDelete,
    };
  },
};

function scrollBottom(el) {
  nextTick(() => {
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  });
}

async function getCurrentParticipant(data, conversationId) {
  try {
    const res = await conversationService.getParticipantByUserId(
      conversationId,
      userId
    );
    data.value = res.data;
  } catch (error) {
    console.error(error);
    toastAlert.error("Có lỗi khi lấy thông tin thành viên");
  }
}
</script>

<style lang="scss" scoped>
.message-window-container {
  @apply w-72 h-96 rounded-lg border border-gray-100 bg-white flex flex-col relative shadow-custom-sm;

  .message-window-header {
    @apply flex items-center justify-between border-b;

    .conversation-info {
      @apply flex items-center p-1.5 rounded-lg m-0.5 hover:bg-gray-100 cursor-pointer;

      .conversation-image {
        @apply w-8 h-8 rounded-full overflow-hidden;

        img {
          @apply w-full h-full object-cover;
        }
      }

      .conversation-name {
        @apply text-15 font-semibold ms-2;
      }
    }
    .message-header-action {
      @apply flex items-center space-x-3 m-2;

      .message-header-btn {
        &:hover {
          .header-btn-icon {
            @apply text-primary;
          }
        }

        .header-btn-icon {
          @apply text-13 font-semibold text-gray-500;
        }
      }
    }
  }

  .message-window-list {
    @apply flex-1 p-1.5 overflow-y-auto space-y-0.5;

    .message-item {
      @apply flex items-end space-x-2 w-48;

      &.self {
        @apply justify-end ms-auto;

        .message-avatar {
          @apply hidden;
        }

        .message-content {
          .message-participant-name {
            @apply hidden;
          }

          .message-content-main {
            @apply bg-primary text-white whitespace-normal;
          }
        }
      }

      .message-avatar {
        @apply min-w-7 min-h-7 w-7 h-7 rounded-full overflow-hidden;

        img {
          @apply w-full h-full object-cover;
        }
      }

      .message-content {
        .message-participant-name {
          @apply text-11 text-gray-600 ms-2;
        }

        .message-content-main {
          @apply text-15 px-3 p-1 bg-gray-100 rounded-2xl inline-block;
        }
      }
    }
  }

  .message-window-footer {
    @apply p-2 flex items-center space-x-2;

    .message-footer-input {
      @apply outline-none border-none rounded-2xl bg-gray-100 text-15 p-1.5 ps-3 flex-1 resize-none;
    }

    .message-footer-btn {
      @apply flex items-center justify-center;

      &.disable {
        .footer-btn-icon {
          filter: invert(0.8) sepia(0.06) saturate(2) saturate(1.2)
            hue-rotate(173deg) brightness(0.98) contrast(0.89);
        }
      }
      &.active {
        .footer-btn-icon {
          filter: invert(0.19) sepia(0.7) saturate(56.71) hue-rotate(203deg)
            brightness(0.96) contrast(1.01);
        }
      }
    }
  }

  .message-window-options {
    @apply absolute right-full me-2 top-0 w-60 bg-white rounded-lg border border-gray-50  shadow-custom-sm;

    .option-list {
      @apply p-1;

      .option-item {
        @apply flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-all cursor-pointer;

        .option-item-icon {
          @apply flex items-center justify-center;
        }

        .option-item-text {
          @apply text-15 font-semibold;
        }
      }
    }
  }
}

.conversation-name-change {
  @apply fixed top-0 left-0 right-0 bottom-0 bg-white bg-opacity-50 flex items-center justify-center;

  .conversation-name-tab {
    @apply w-500px bg-white rounded-lg shadow-custom-sm border border-gray-100;

    .conversation-name-header {
      @apply flex items-center justify-between p-2 py-3 border-b border-gray-100;

      .name-header-text {
        @apply font-bold text-lg;
      }

      .header-close-btn {
        @apply w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200;

        .close-btn-icon {
          @apply text-gray-600;
        }
      }
    }
    .conversation-name-content {
      @apply p-4;
      .name-content-input {
        @apply border-2 border-primary outline-primary p-2 rounded-md w-full text-15;
      }
    }
    .conversation-name-action {
      @apply flex justify-end space-x-2 p-2 px-4;

      .name-action-btn {
        @apply font-semibold text-15 p-2 px-3 rounded-lg;

        &.btn--second {
          @apply text-primary;
        }

        &.btn--primary {
          @apply bg-primary text-white;
        }

        &.btn--disable {
          @apply bg-gray-200 text-gray-600;
        }
      }
    }
  }
}
</style>
