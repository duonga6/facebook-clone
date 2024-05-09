<template>
  <div class="create-conversation-group" @click="handleClose">
    <div class="create-conversation-form" @click.stop="">
      <div class="conversation-form-header">
        <div class="conversation-header-text">Tạo nhóm chat</div>
        <div class="conversation-header-action">
          <button class="conversation-action-btn" @click="handleClose">
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
</template>

<script>
import { reactive, ref, watch } from "vue";
import { friendshipService } from "@/services/friendship.service";
import { FRIEND_TYPE } from "@/constants";
import tokenService from "@/services/token.service";
import { toastAlert } from "@/utilities/toastAlert";
import { useStore } from "vuex";
import { conversationService } from "@/services/conversation.service";
const user = tokenService.getUser();
export default {
  props: {
    conversationId: {
      type: String,
      required: true,
    },
    defaultUser: {
      type: Object,
      requried: true,
    },
  },
  emits: ["onClose"],
  setup(props, { emit }) {
    const isFetchingFriend = ref(false);
    const friendSearchInput = ref(null);
    const store = useStore();

    const conversationMemberList = reactive([props.defaultUser]);
    const conversationMemberSearch = reactive({
      pageSize: 10,
      pageNumber: 0,
      searchString: null,
      data: [],
      total: 0,
      isFetched: false,
    });

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

    async function handleSubmitCreateConversation() {
      emit("onClose");

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

    function addMemberConversation(user) {
      const findExist = conversationMemberList.find((x) => x.id == user.id);
      if (!findExist) {
        conversationMemberList.push(user);
      }

      friendSearchInput.value = null;
      resetMemberSearch(conversationMemberSearch);
    }

    function handleClose() {
      emit("onClose");
    }

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

    function removeSeletedMember(id) {
      const index = conversationMemberList.findIndex((x) => x.id == id);
      if (index != -1) {
        conversationMemberList.splice(index, 1);
      }
    }

    return {
      conversationMemberList,
      conversationMemberSearch,
      friendSearchInput,
      onGetSearchFriend,
      handleSubmitCreateConversation,
      handleClose,
      addMemberConversation,
      removeSeletedMember,
    };
  },
};

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
          return item.requestUser.id == user.id
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
</style>
