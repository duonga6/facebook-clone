<template>
  <div class="group-member-container">
    <div class="group-member-header">
      <div class="group-header-text">
        Thành viên
        <span class="group-header-count">{{ groupInfo?.totalMember }}</span>
      </div>
      <div class="group-header-search">
        <i class="header-search-icon pi pi-search"></i>
        <input
          type="text"
          class="header-search-input"
          placeholder="Tìm thành viên"
          v-model="searchMember"
        />
      </div>
    </div>
    <div v-show="!searchMember">
      <div class="group-member-list" v-scroll-bottom="onScrollToBottom">
        <div class="divider-gray-200 mb-2"></div>
        <div
          class="group-member-item"
          v-for="member in memberData.data"
          :key="member.id"
        >
          <div class="group-member-avatar">
            <img :src="member.user.avatarUrl" alt="" />
          </div>
          <div class="group-member-info">
            <router-link
              :to="{
                name: 'profile',
                params: {
                  id: member.user.id,
                },
              }"
              class="group-member-name"
              >{{
                member.user.firstName + " " + member.user.lastName
              }}</router-link
            >
            <div class="group-member-role">
              <span v-if="member.isAdmin">Quản trị viên</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="searchMember">
      <div class="group-member-list">
        <div class="divider-gray-200"></div>
        <div class="member-list-header">
          Tìm kiếm thành viên "{{ searchMember }}"
        </div>
        <div
          class="group-member-item"
          v-for="member in searchMemberData.data"
          :key="member.id"
        >
          <div class="group-member-avatar">
            <img :src="member.user.avatarUrl" alt="" />
          </div>
          <div class="group-member-info">
            <router-link
              :to="{
                name: 'profile',
                params: {
                  id: member.user.id,
                },
              }"
              class="group-member-name"
              >{{
                member.user.firstName + " " + member.user.lastName
              }}</router-link
            >
            <div class="group-member-role">
              <span v-if="member.isAdmin">Quản trị viên</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { MEMBER_TYPE } from "@/constants";
import { toastAlert } from "@/utilities/toastAlert";

export default {
  setup() {
    const store = useStore();
    const searchMember = ref(null);

    let timeOutId;

    watch(
      () => searchMember.value,
      (newVal) => {
        clearTimeout(timeOutId);
        timeOutId = setTimeout(async () => {
          try {
            await store.dispatch("group/getSearchMember", {
              searchString: newVal,
            });
          } catch (err) {
            console.error(err);
            toastAlert.error("Có lỗi khi tìm kiếm thành viên");
          }
        }, 500);
      }
    );

    function handleGetMember(memberType) {
      try {
        store.dispatch("group/getMember", {
          memberType: memberType,
        });
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi lấy dữ liệu thành viên");
      }
    }

    async function handleGetSearchMember() {
      try {
        await store.dispatch("group/getSearchMember", {
          searchString: searchMember.value,
        });
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi tìm kiếm thành viên");
      }
    }

    async function onScrollToBottom() {
      await store.dispatch("group/getMember");
    }

    onUnmounted(() => {
      store.dispatch("group/resetSearchMember");
    });

    return {
      groupInfo: computed(() => store.getters["group/getGroupInfo"]),
      searchMemberData: computed(() => store.getters["group/getSearchMember"]),
      memberData: computed(() => store.getters["group/getMember"]),
      searchMember,
      MEMBER_TYPE,
      handleGetMember,
      handleGetSearchMember,
      onScrollToBottom,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-member-container {
  max-width: 680px;

  @apply mx-auto w-full rounded-lg border bg-white px-4 py-2;
  .group-member-header {
    .group-header-text {
      @apply text-17 font-semibold;

      .group-header-count {
        @apply text-15 text-gray-600;
      }
    }
    .group-header-search {
      @apply relative mt-2;

      .header-search-icon {
        @apply absolute left-3 top-1/2 -translate-y-1/2 text-15 text-gray-500;
      }

      .header-search-input {
        @apply w-full border-none outline-none bg-gray-100 rounded-full py-1.5 ps-8 placeholder:text-15 text-15;
      }
    }
  }

  .group-member-list {
    @apply mt-4 h-full overflow-y-auto;

    &::-webkit-scrollbar {
      @apply w-2;
    }

    &::-webkit-scrollbar-thumb {
      @apply rounded-lg bg-gray-300;
    }

    &::-webkit-scrollbar-track {
      @apply hidden;
    }

    .member-list-header {
      @apply font-semibold text-15 my-2;
    }

    .group-member-item {
      @apply flex items-center py-2;

      .group-member-avatar {
        @apply w-14 h-14 rounded-full overflow-hidden border;

        img {
          @apply w-full h-full object-cover;
        }
      }
      .group-member-info {
        @apply ms-3;

        .group-member-name {
          @apply font-semibold text-15;
        }
        .group-member-role {
          @apply font-semibold text-gray-500 text-13 leading-15;
        }
      }

      .group-member-action {
        @apply ms-auto flex;

        .member-action-btn {
          @apply bg-gray-200 rounded-lg flex items-center px-3 py-2 space-x-2;

          .action-btn-icon {
          }

          .action-btn-text {
            @apply font-semibold text-15;
          }
        }
      }
    }
  }
}
</style>
