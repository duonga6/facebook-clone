<template>
  <div class="profile-friend-container">
    <div class="profile-friend-header">
      <div class="header-text">Bạn bè</div>
      <div class="header-search">
        <input
          class="header-search-input"
          type="text"
          name=""
          id=""
          placeholder="Tìm kiếm"
          v-model="searchString"
        />
        <i class="header-search-icon pi pi-search"></i>
      </div>
    </div>
    <ul class="profile-friend-list">
      <li class="friend-item" v-for="friend in friendShow" :key="friend.id">
        <div class="friend-item-container">
          <router-link
            :to="{
              name: 'profile-post',
              params: {
                id: friend.user.id,
              },
            }"
            class="friend-img"
          >
            <img :src="friend.user.avatarUrl" alt="" />
          </router-link>
          <div class="friend-name">
            <router-link
              :to="{
                name: 'profile-post',
                params: {
                  id: friend.user.id,
                },
              }"
              >{{
                friend.user.firstName + " " + friend.user.lastName
              }}</router-link
            >
          </div>
          <div class="friend-more">
            <i class="friend-more-icon pi pi-ellipsis-h"></i>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { userService } from "@/services/user.service";
import { toastAlert } from "@/utilities/toastAlert";

async function getFriendSearch(userId, searchString, friendSearch) {
  try {
    const res = await userService.getFriends(userId, {
      pageSize: friendSearch.pageSize,
      pageNumber: friendSearch.pageNumber + 1,
      searchString: searchString,
    });
    friendSearch.pageNumber++;
    friendSearch.data = [...friendSearch.data, ...res.data];
    friendSearch.total = res.totalItems;
  } catch (err) {
    toastAlert.error(err);
  }
}

export default {
  setup() {
    const store = useStore();
    const route = useRoute();

    const searchString = ref(null);
    const userId = route.params.id;
    const friendSearch = reactive({
      data: [],
      total: 0,
      pageSize: 6,
      pageNumber: 0,
    });

    const friendStore = computed(() => store.getters["profile/getFriend"]);
    const friendShow = computed(() => {
      let data;
      if (searchString.value) {
        data = friendSearch.data;
      } else {
        data = friendStore.value.data;
      }

      return data.map((item) => {
        return {
          id: item.id,
          user:
            item.requestUser.id == userId ? item.targetUser : item.requestUser,
        };
      });
    });

    let timeOutSearch;

    watch(
      () => searchString.value,
      (newVal) => {
        if (newVal) {
          clearTimeout(timeOutSearch);
          friendSearch.data = [];
          friendSearch.total = 0;
          friendSearch.pageNumber = 0;

          timeOutSearch = setTimeout(
            async () => await getFriendSearch(userId, newVal, friendSearch),
            500
          );
        }
      }
    );

    async function onScrollWindow() {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight
      ) {
        if (searchString.value) {
          if (
            friendSearch.pageNumber != 0 &&
            friendSearch.pageSize * friendSearch.pageNumber < friendSearch.total
          )
            await getFriendSearch(userId, searchString.value, friendSearch);
        } else {
          if (
            friendStore.value.pageNumber != 0 &&
            friendStore.value.pageSize * friendStore.value.pageNumber <
              friendStore.value.total
          ) {
            await store.dispatch("profile/getFriend");
          }
        }
      }
    }

    onMounted(() => {
      window.addEventListener("scroll", onScrollWindow);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", onScrollWindow);
    });

    return {
      searchString,
      friendShow,
    };
  },
};
</script>

<style lang="scss" scoped>
.profile-friend-container {
  @apply bg-white p-4 rounded-lg border border-gray-200;

  .profile-friend-header {
    @apply flex items-center justify-between;

    .header-text {
      @apply text-xl font-semibold;
    }

    .header-search {
      @apply relative;

      .header-search-input {
        @apply bg-gray-100 rounded-full py-1.5 placeholder:text-15 ps-9 outline-none border-none;
      }

      .header-search-icon {
        @apply absolute left-2.5 top-1/2 -translate-y-1/2 font-semibold text-gray-500;
      }
    }
  }

  .profile-friend-list {
    @apply mt-4 grid grid-cols-2 gap-2;
    .friend-item {
      @apply col-span-1 border border-gray-100 rounded-lg p-4;
      .friend-item-container {
        @apply flex items-center;
        .friend-img {
          @apply w-20 h-20 rounded-lg overflow-hidden;

          img {
            @apply w-full h-full object-cover;
          }
        }
        .friend-name {
          @apply font-semibold text-17 ms-4;
        }
        .friend-more {
          @apply ms-auto;

          .friend-more-icon {
            @apply text-gray-600 font-semibold;
          }
        }
      }
    }
  }
}
</style>
