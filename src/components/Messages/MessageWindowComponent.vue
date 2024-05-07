<template>
  <div
    class="message-window-container"
    v-if="data"
    @click="handleClickMessageWindow"
  >
    <div class="message-window-header">
      <div
        class="conversation-info"
        @click="isShowConversationMore = !isShowConversationMore"
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
        v-for="message in data.messages.data"
        :key="message.id"
        :class="{ self: message.user.id == userId }"
      >
        <div class="message-avatar">
          <img :src="message.user.avatarUrl" alt="" />
        </div>
        <div
          class="message-content"
          :title="convertDateTitleMessage(message.createdAt)"
        >
          {{ message.content }}
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
      </div>
    </div>
  </div>

  <div
    class="create-conversation-group"
    v-if="isShowCreateConversation"
    @click="isShowCreateConversation = false"
  >
    <div class="create-conversation-form" @click.stop="">
      <div class="conversation-form-header">
        <div class="conversation-header-text">Tạo nhóm chat</div>
        <div class="conversation-header-action">
          <button
            class="conversation-action-btn"
            @click="isShowCreateConversation = false"
          >
            <i class="conversation-action-icon pi pi-times"></i>
          </button>
        </div>
      </div>
      <div class="conversation-to-member">
        <div class="to-member-text">Đến:</div>
        <div class="member-selected-list">
          <div
            class="member-selected-item"
            v-for="member in conversationMemberList"
            :key="member.id"
          >
            <div class="member-seleted-name">
              {{ member.firstName + " " + member.lastName }}
            </div>
            <button
              class="member-action-remove"
              @click="removeSeletedMember(member.id)"
            >
              <i class="member-action-icon pi pi-times"></i>
            </button>
          </div>
          <input
            class="to-member-search"
            type="text"
            placeholder="Tìm kiếm..."
            v-model="friendSearchInput"
          />
        </div>
      </div>
      <div
        class="member-search-list scroll"
        v-scroll-near-bottom="onGetSearchFriend"
      >
        <div
          class="member-search-item"
          v-for="member in conversationMemberSearch.data"
          :key="member.id"
          @click="addMemberConversation(member)"
        >
          <div class="member-item-avatar">
            <img :src="member.avatarUrl" alt="" />
          </div>
          <div class="member-item-name">
            {{ member.firstName + " " + member.lastName }}
          </div>
        </div>
      </div>
      <div
        class="create-conversation-btn"
        @click="handleSubmitCreateConversation"
      >
        Tạo
      </div>
    </div>
  </div>

  <div
    class="conversation-nickname-container"
    v-if="isShowChangeNickName"
    @click="isShowChangeNickName = false"
  >
    <div class="conversation-nickname-tab" @click.stop="">
      <div class="conversation-nickname-header">
        <div class=""></div>
        <div class="nickname-header-text">Biệt danh</div>
        <button
          class="nickname-header-btn"
          @click="isShowChangeNickName = false"
        >
          <i class="header-btn-icon pi pi-times"></i>
        </button>
      </div>
      <div class="conversation-nickname-list scroll">
        <div
          class="conversation-nickname-item"
          v-for="participant in participants"
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
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import tokenService from "@/services/token.service";
import { convertDateTitleMessage } from "@/utilities/dateUtils";
import { friendshipService } from "@/services/friendship.service";
import { toastAlert } from "@/utilities/toastAlert";
import { FRIEND_TYPE } from "@/constants";
import { conversationService } from "@/services/conversation.service";
import eventBus from "@/common/EventBus";
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
    const friendSearchInput = ref(null);
    const isFetchingMessage = ref(false);
    const isFirstScroll = ref(false);
    const isFetchingFriend = ref(false);
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

    const participants = reactive(
      props.data.participants.data.map((item) => {
        return {
          ...item,
          editing: false,
          newContactName: null,
        };
      })
    );

    const conversationMemberList = reactive([]);
    const conversationMemberSearch = reactive({
      pageSize: 10,
      pageNumber: 0,
      searchString: null,
      data: [],
      total: 0,
      isFetched: false,
    });

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
        await store.dispatch("conversation/sendMessage", {
          conversationId: props.data.id,
          content: messageContent.value,
        });

        messageContent.value = null;
        scrollBottom(listMessageEl.value);
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
      conversationMemberList.length = 0;
      conversationMemberList.push(userOther.value);
      isShowCreateConversation.value = true;
    }

    function removeSeletedMember(id) {
      const index = conversationMemberList.findIndex((x) => x.id == id);
      if (index != -1) {
        conversationMemberList.splice(index, 1);
      }
    }

    function addMemberConversation(user) {
      const findExist = conversationMemberList.find((x) => x.id == user.id);
      if (!findExist) {
        conversationMemberList.push(user);
      }

      friendSearchInput.value = null;
      resetMemberSearch(conversationMemberSearch);
    }

    async function handleSubmitCreateConversation() {
      isShowCreateConversation.value = false;
      console.log(conversationMemberList);

      if (!conversationMemberList.length) return;

      if (conversationMemberList.length == 1) {
        const checkPrivateConversation = await conversationService.getByUserId(
          conversationMemberList[0].id
        );

        if (checkPrivateConversation.success) {
          await store.dispatch(
            "conversation/getConversationByUserId",
            conversationMemberList[0].id
          );
        }
      } else {
        store.dispatch(
          "conversation/createConversation",
          conversationMemberList
        );
      }
    }

    function handleClickMessageWindow() {
      eventBus.dispatch("SeenMessage", props.data.id);
    }

    async function onGetSearchFriend() {
      if (!isFetchingFriend.value) {
        isFetchingFriend.value = true;
        await getMemberSearch(
          conversationMemberSearch,
          friendSearchInput.value
        );
        isFetchingFriend.value = false;
      }
    }

    // Nick Name

    function handleEditNickName(id) {
      const participant = participants.find((x) => x.id == id);
      if (participant) {
        participant.editing = true;
      }
    }

    function handleCloseEditNickName(id) {
      const participant = participants.find((x) => x.id == id);
      if (participant) {
        participant.editing = false;
      }
    }

    async function handleAcceptChangeNickName(id) {
      const participant = participants.find((x) => x.id == id);
      if (participant) {
        participant.editing = false;
        if (participant.userContactName != participant.newContactName) {
          store
            .dispatch("conversation/changeNickName", {
              conversationId: props.data.id,
              participantId: id,
              name: participant.newContactName,
            })
            .then((data) => {
              eventBus.dispatch("ChangeContactName", data);
            });
        }
      }
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

    let timeOutSearch;

    watch(
      () => friendSearchInput.value,
      (newVal) => {
        clearTimeout(timeOutSearch);
        timeOutSearch = setTimeout(async () => {
          await getMemberSearch(conversationMemberSearch, newVal);
        }, 500);
      }
    );

    watch(
      () => props.data.participants.data,
      (newData) => {
        participants.splice(
          0,
          participants.length,
          ...newData.map((item) => {
            return {
              ...item,
              editing: false,
              newContactName: null,
            };
          })
        );
      },
      {
        deep: true,
      }
    );

    onMounted(() => {
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
      conversationMemberList,
      conversationMemberSearch,
      friendSearchInput,
      isShowCreateConversation,
      participants,
      conversationName,
      handleClose,
      handleMinimize,
      onContentChange,
      onSendMessage,
      onLoadMessage,
      convertDateTitleMessage,
      handleCreateConversationGroup,
      removeSeletedMember,
      addMemberConversation,
      handleSubmitCreateConversation,
      handleClickMessageWindow,
      onGetSearchFriend,
      handleEditNickName,
      handleCloseEditNickName,
      handleAcceptChangeNickName,
      handleSubmitChangeName,
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

function resetMemberSearch(data) {
  data.data = [];
  data.pageNumber = 0;
  data.total = 0;
  data.isFetched = false;
  data.searchString = null;
}

async function getMemberSearch(data, searchString) {
  if (searchString != data.searchString) {
    resetMemberSearch(data);
  }

  if (!searchString || (searchString && searchString.trim() == "")) return;

  if (data.pageSize * data.pageNumber < data.total || !data.isFetched) {
    try {
      const friendSearch = await friendshipService.get({
        pageSize: data.pageSize,
        pageNumber: data.pageNumber + 1,
        searchString: searchString,
        type: FRIEND_TYPE.ACCEPTED,
      });

      data.data.push(
        ...friendSearch.data.map((item) => {
          return item.requestUser.id == userId
            ? item.targetUser
            : item.requestUser;
        })
      );
      data.pageNumber++;
      data.isFetched = true;
      data.total = friendSearch.totalItems;
      data.searchString = searchString;
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi tải bạn bè");
    }
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
          @apply bg-primary text-white;
        }
      }

      .message-avatar {
        @apply min-w-7 min-h-7 w-7 h-7 rounded-full overflow-hidden;

        img {
          @apply w-full h-full object-cover;
        }
      }

      .message-content {
        @apply text-15 px-3 p-1 bg-gray-100 rounded-2xl;
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
        }

        .option-item-text {
          @apply text-15 font-semibold;
        }
      }
    }
  }
}

.create-conversation-group {
  @apply fixed top-0 bottom-0 right-0 left-0 bg-white bg-opacity-50 flex items-center justify-center z-50;

  .create-conversation-form {
    @apply w-500px bg-white rounded-lg border border-gray-100 shadow-custom-sm;

    .conversation-form-header {
      @apply flex items-center justify-between p-2 border-b border-gray-100;

      .conversation-header-text {
        @apply text-17 font-semibold;
      }
      .conversation-header-action {
        .conversation-action-btn {
          @apply w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200;

          .conversation-action-icon {
            @apply text-15 text-gray-500;
          }
        }
      }
    }

    .conversation-to-member {
      @apply p-2 flex w-full items-center space-x-2;

      .to-member-text {
        @apply text-15 font-semibold;
      }

      .to-member-search {
        @apply p-1 outline-none border-none;
      }

      .member-selected-list {
        @apply flex flex-row flex-wrap;

        .member-selected-item {
          @apply p-1 px-2 bg-primary bg-opacity-10 rounded-lg flex items-center space-x-2 mb-1 mr-1;

          .member-seleted-name {
            @apply text-13 font-semibold text-primary;
          }

          .member-action-remove {
            .member-action-icon {
              @apply text-12 text-primary;
            }
          }
        }
      }
    }

    .member-search-list {
      @apply p-2 max-h-60 overflow-y-auto;

      .member-search-item {
        @apply flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer;

        .member-item-avatar {
          @apply w-10 h-10 rounded-full overflow-hidden;

          img {
            @apply w-full h-full object-cover;
          }
        }

        .member-item-name {
          @apply text-15;
        }
      }
    }

    .create-conversation-btn {
      @apply mx-4 m-2 p-2 text-center bg-primary rounded-lg font-semibold text-white cursor-pointer cursor-pointer;
    }
  }
}

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
    .conversation-nickname-list {
      @apply p-2 max-h-80;

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
