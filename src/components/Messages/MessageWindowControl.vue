<template>
  <div class="message-window-list z-50">
    <template v-for="conversation in conversationsData" :key="conversation.id">
      <MessageWindow
        :data="conversation"
        @onClose="onClose"
        @onMinimize="onMinimize"
        v-if="!conversation.minimize"
      ></MessageWindow>
    </template>
  </div>
  <div class="message-mini-list">
    <template v-for="conversation in conversationsMini" :key="conversation.id">
      <div
        class="message-mini-item"
        @click="handleShowMinimize(conversation.id)"
      >
        <img class="massage-mini-img" :src="conversation.images[0]" alt="" />
        <div
          class="message-close-btn"
          @click.stop="handleDeleteConversation(conversation.id)"
        >
          <i class="message-close-icon pi pi-times"></i>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import eventBus from "@/common/EventBus";
import tokenService from "@/services/token.service";
const loggedUser = tokenService.getUser();
export default {
  setup() {
    const store = useStore();

    const conversationsData = computed(
      () => store.getters["conversation/getData"]
    );

    function onClose(id) {
      store.dispatch("conversation/removeConversation", id);
    }

    function onMinimize(id) {
      store.dispatch("conversation/minimizeConversation", id);
    }

    function handleShowMinimize(id) {
      store.dispatch("conversation/showConversation", id);
    }

    function handleDeleteConversation(id) {
      const index = conversationsData.value.findIndex((x) => x.id == id);
      if (index != -1) {
        conversationsData.value.splice(index, 1);
      }
    }

    async function handleNewMessage(data) {
      if (loggedUser.id != data.user.id) {
        await store.dispatch("conversation/newMessage", data);
      }
    }

    onMounted(() => {
      eventBus.on("NewMessage", handleNewMessage);
    });

    onUnmounted(() => {
      eventBus.remove("NewMessage", handleNewMessage);
    });

    return {
      conversationsData,
      conversationsMini: computed(() =>
        conversationsData.value.filter((x) => x.minimize).slice(0, 5)
      ),
      onClose,
      onMinimize,
      handleShowMinimize,
      handleDeleteConversation,
    };
  },
};
</script>

<style lang="scss" scoped>
.message-window-list {
  @apply fixed bottom-0 right-20 flex space-x-2;
}

.message-mini-list {
  @apply fixed bottom-10 right-2 flex flex-col space-y-1;

  .message-mini-item {
    @apply relative cursor-pointer;

    .massage-mini-img {
      @apply w-12 h-12 rounded-full object-cover;
    }

    .message-close-btn {
      @apply absolute top-0 right-0 w-4 h-4 hidden items-center justify-center rounded-full bg-white cursor-pointer;

      .message-close-icon {
        @apply text-11 text-gray-600;
      }
    }

    &:hover {
      .message-close-btn {
        @apply flex;
      }
    }
  }
}
</style>
