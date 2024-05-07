<template>
  <div class="message-tab-container scroll">
    <div class="message-tab-header" @click.stop="">
      <div class="message-header-text">Đoạn chat</div>
      <div class="message-header-search">
        <i class="header-search-icon pi pi-search"></i>
        <input
          v-model="friendSearch"
          class="header-search-input"
          placeholder="Tìm kiếm đoạn chat"
        />
      </div>
    </div>
    <div
      class="message-list"
      v-if="conversationData.data.length && !friendSearchData.data.length"
    >
      <div
        class="message-item"
        v-for="data in sortedConversation"
        :key="data.id"
        :class="{
          'not-read':
            !data.lastMessage.readedAt && data.lastMessage.user.id != user.id,
        }"
        @click="handleClickMessage(data.id)"
      >
        <div class="message-avatar">
          <img v-for="image in data.images" :key="image" :src="image" alt="" />
        </div>
        <div class="message-info">
          <div class="message-user-name">{{ data.name }}</div>
          <div class="message-last-message">
            <div class="message-content">{{ data.lastMessage.content }}</div>
            <DotSplit></DotSplit>
            <div class="message-time">
              {{ convertDatePostDisplay(new Date(data.lastMessage.createdAt)) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!friendSearchData.data.length && !conversationData.data.length"
      class="empty-message"
    >
      Chưa có tin nhắn nào
    </div>
    <div
      v-else
      class="friend-list"
      v-for="friend in friendSearchData.data"
      :key="friend.id"
    >
      <div
        class="friend-item"
        @click="handleSelectConversationFriend(friend.user.id)"
      >
        <div class="friend-image">
          <img :src="friend.user.avatarUrl" alt="" />
        </div>
        <div class="friend-name">
          {{ friend.user.firstName + " " + friend.user.lastName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { convertDatePostDisplay } from "@/utilities/dateUtils";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { friendshipService } from "@/services/friendship.service";
import { toastAlert } from "@/utilities/toastAlert";
import tokenService from "@/services/token.service";
import { conversationService } from "@/services/conversation.service";
import { useStore } from "vuex";
import eventBus from "@/common/EventBus";

const user = tokenService.getUser();

export default {
  setup() {
    const store = useStore();
    const friendSearch = ref(null);

    const friendSearchData = reactive({
      data: [],
      pageSize: 10,
      pageNumber: 0,
      total: 0,
      isFetched: false,
      searchString: null,
    });

    let timeOutFetch;

    watch(
      () => friendSearch.value,
      (newVal) => {
        resetFriendSearch(friendSearchData);
        clearTimeout(timeOutFetch);

        if (newVal.trim() == "") {
          return;
        } else {
          friendSearchData.searchString = newVal;
          timeOutFetch = setTimeout(async () => {
            await getFriend(friendSearchData);
          }, 500);
        }
      }
    );

    const conversationData = reactive({
      data: [],
      total: 0,
      hasNextPage: true,
      pageSize: 10,
      endCursor: null,
    });

    const sortedConversation = computed(() => {
      return [...conversationData.data].sort(
        (a, b) =>
          new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
      );
    });

    async function handleClickMessage(id) {
      await store.dispatch("conversation/getConversationById", id);
      try {
        const conversation = conversationData.data.find((x) => x.id == id);
        if (
          conversation &&
          conversation.lastMessage.user.id != user.id &&
          !conversation.lastMessage.readedAt
        ) {
          await conversationService.seenMessage(
            id,
            conversation.lastMessage.id
          );
          conversation.lastMessage.readedAt = new Date();
        }
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi xem tin nhắn");
      }
    }

    async function handleSelectConversationFriend(id) {
      resetFriendSearch(friendSearchData);
      await store.dispatch("conversation/getConversationByUserId", id);
    }

    async function handleNewMessage(data) {
      const conversation = conversationData.data.find(
        (x) => x.id == data.conversationId
      );
      if (conversation) {
        conversation.lastMessage = data;
      } else {
        try {
          const conversationRes = await conversationService.getById(
            data.conversationId
          );
          conversationData.data.push(conversationRes.data);
        } catch (error) {
          console.error(error);
          toastAlert.error("Có lỗi khi tải tin nhắn mới");
        }
      }
    }

    function handleChangeContactName(data) {
      if (data.data.user.id != user.id) {
        const conversation = conversationData.data.find(
          (x) => x.id == data.conversationId
        );
        if (conversation && conversation.type == 0) {
          conversation.name = data.data.userContactName;
        }
      }
    }

    function handleChangeConversationName(data) {
      const conversation = conversationData.data.find(
        (x) => x.id == data.conversationId
      );
      if (conversation) {
        conversation.name = data.data.name;
      }
    }

    onMounted(async () => {
      await getConversation(conversationData);
      eventBus.on("NewMessage", handleNewMessage);
      eventBus.on("SeenMessage", handleClickMessage);
      eventBus.on("ChangeContactName", handleChangeContactName);
      eventBus.on("ChangeConversationName", handleChangeConversationName);
    });

    onUnmounted(() => {
      eventBus.remove("NewMessage", handleNewMessage);
      eventBus.remove("SeenMessage", handleClickMessage);
      eventBus.remove("ChangeContactName", handleChangeContactName);
      eventBus.remove("ChangeConversationName", handleChangeConversationName);
    });

    return {
      friendSearch,
      friendSearchData,
      conversationData,
      sortedConversation,
      user,
      convertDatePostDisplay,
      handleClickMessage,
      handleSelectConversationFriend,
    };
  },
};

async function getFriend(friendSearchData) {
  if (
    friendSearchData.pageSize * friendSearchData.pageNumber <
      friendSearchData.total ||
    !friendSearchData.isFetched
  ) {
    try {
      var friendRes = await friendshipService.get({
        pageSize: friendSearchData.pageSize,
        pageNumber: friendSearchData.pageNumber + 1,
        searchString: friendSearchData.searchString,
        type: 3,
      });

      friendRes.data = friendRes.data.map((item) => {
        return {
          id: item.id,
          user:
            item.requestUser.id == user.id ? item.targetUser : item.requestUser,
        };
      });

      friendSearchData.data.push(...friendRes.data);
      friendSearchData.total = friendRes.totalItems;
      friendSearchData.pageNumber++;
      friendSearchData.isFetched = true;
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi tải dữ liệu bạn bè");
    }
  }
}

function resetFriendSearch(friendSearchData) {
  friendSearchData.data = [];
  friendSearchData.pageNumber = 0;
  friendSearchData.total = 0;
  friendSearchData.isFetched = false;
  friendSearchData.searchString = null;
}

async function getConversation(conversationData) {
  if (conversationData.hasNextPage) {
    try {
      const conversationRes = await conversationService.get({
        pageSize: conversationData.pageSize,
        cursor: conversationData.endCursor,
      });

      conversationData.data.push(...conversationRes.data);
      conversationData.endCursor = conversationRes.endCursor;
      conversationData.hasNextPage = conversationRes.hasNextPage;
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi tải đoạn chat");
    }
  }
}
</script>

<style lang="scss" scoped>
.message-tab-container {
  @apply absolute shadow-custom-sm top-12 right-0 bg-white rounded-lg p-2 w-96 overflow-y-auto cursor-default;

  max-height: calc(90vh - 56px);

  .message-tab-header {
    @apply px-2;

    .message-header-text {
      @apply text-2xl font-bold;
    }

    .message-header-search {
      @apply flex relative mt-2;

      .header-search-icon {
        @apply absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-15;
      }

      .header-search-input {
        @apply flex-1 border-none outline-none bg-gray-100 rounded-full text-15 px-2 py-1 ps-8;
      }
    }
  }

  .message-list {
    @apply mt-2;

    .message-item {
      @apply flex items-center p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer;

      &.not-read {
        @apply relative;

        .message-info {
          .message-last-message {
            .message-content {
              @apply font-semibold text-dark;
            }
          }
        }

        &::before {
          content: "";
          @apply absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary;
        }
      }

      .message-avatar {
        @apply w-14 h-14 rounded-full overflow-hidden border border-gray-50;

        img {
          @apply w-full h-full object-cover;
        }
      }

      .message-info {
        @apply flex flex-col ms-2;

        .message-user-name {
          @apply text-15 font-semibold;
        }

        .message-last-message {
          @apply text-13 text-gray-500 flex items-center space-x-1;

          .message-content {
          }
          .message-time {
          }
        }
      }
    }
  }

  .empty-message {
    @apply text-center font-semibold text-15 mt-2 text-gray-700;
  }

  .friend-list {
    @apply mt-2;

    .friend-item {
      @apply flex items-center p-2 rounded-lg hover:bg-gray-100 transition-all;

      .friend-image {
        @apply w-10 h-10 rounded-full overflow-hidden border border-gray-50;

        img {
          @apply w-full h-full object-cover;
        }
      }

      .friend-name {
        @apply text-15 ms-2;
      }
    }
  }
}
</style>
