<template>
  <div class="group-container">
    <div class="group-navbar">
      <div class="group-navbar-header">
        <div class="navbar-header-text">Nhóm</div>
      </div>
      <div class="group-navbar-search">
        <i class="navbar-search-icon pi pi-search"></i>
        <form @submit.prevent="onSubmitSearch">
          <input
            v-model="searchString"
            class="navbar-search-input"
            placeholder="Tìm kiếm nhóm"
          />
        </form>
      </div>
      <div class="navbar-scroll-container">
        <div class="group-navbar-list">
          <router-link
            :to="{
              name: 'group-feed',
              params: null,
            }"
            class="group-navbar-item"
            :class="{ active: route.name == 'group-feed' }"
          >
            <div class="navbar-item-icon">
              <i
                data-visualcompletion="css-img"
                class="x1b0d499 xep6ejk"
                aria-hidden="true"
                style="
                  background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/V84HF6KodYe.png?_nc_eui2=AeEJhnmNUWYmAGlM4Us7Hx_zl6X9bCTjl-WXpf1sJOOX5QzLuSY3s-n2AK5BG_2okKD9Q978OY-J_dcrosirGd_i');
                  background-position: 0px -200px;
                  background-size: auto;
                  width: 20px;
                  height: 20px;
                  background-repeat: no-repeat;
                  display: block;
                "
              ></i>
            </div>
            <div class="navbar-item-text">Bảng feed của bạn</div>
          </router-link>
          <router-link
            :to="{
              name: 'group-joined',
              params: null,
            }"
            class="group-navbar-item"
            :class="{ active: route.name == 'group-joined' }"
          >
            <div class="navbar-item-icon">
              <i
                data-visualcompletion="css-img"
                class="x1b0d499 xep6ejk"
                aria-hidden="true"
                style="
                  background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/5sdipnX2kSG.png?_nc_eui2=AeE-ZiCxfwYIHBx_AKd4Oj74OnN4bgtqB2A6c3huC2oHYIn45UUJeDtZ7IPePxRF7yaXIQXVf5pZdqffTSUPMdjv');
                  background-position: 0px -21px;
                  background-size: auto;
                  width: 20px;
                  height: 20px;
                  background-repeat: no-repeat;
                  display: block;
                "
              ></i>
            </div>
            <div class="navbar-item-text">Nhóm của bạn</div>
          </router-link>
        </div>
        <div class="group-create">
          <button class="group-create-btn" @click="isShowCreateGroup = true">
            <i class="group-btn-icon pi pi-plus"></i>
            Tạo nhóm mới
          </button>
        </div>
        <div class="group-joined-container" v-if="managedGroup.totalItems > 0">
          <div class="group-joined-header">
            <div class="grp-joined-header-text">Nhóm do bạn quản lý</div>
            <router-link
              :to="{
                name: 'group-manage',
                params: null,
              }"
              class="grp-joined-link"
              v-if="managedGroup.totalItems > managedGroup.data.length"
            >
              Xem tất cả
            </router-link>
          </div>
          <div class="group-joined-list">
            <router-link
              :to="{
                name: 'group-details-preview-post',
                params: {
                  id: group.id,
                },
              }"
              class="group-joined-item"
              :class="{ active: route.params?.id == group.id }"
              v-for="group in managedGroup.data"
              :key="group.id"
            >
              <div class="group-joined-image">
                <img :src="group.coverImage" alt="" />
              </div>
              <div class="group-joined-name">
                {{ group.name }}
              </div>
            </router-link>
          </div>
        </div>
        <div class="group-joined-container">
          <div class="group-joined-header">
            <div class="grp-joined-header-text">Nhóm bạn đã tham gia</div>
            <router-link
              :to="{
                name: 'group-joined',
                params: null,
              }"
              class="grp-joined-link"
              v-if="joinedGroup.totalItems > joinedGroup.data.length"
            >
              Xem tất cả
            </router-link>
          </div>
          <div class="group-joined-list">
            <router-link
              :to="{
                name: 'group-details-preview-post',
                params: {
                  id: group.id,
                },
              }"
              class="group-joined-item"
              v-for="group in joinedGroup.data"
              :key="group.id"
            >
              <div class="group-joined-image">
                <img :src="group.coverImage" alt="" />
              </div>
              <div class="group-joined-name">
                {{ group.name }}
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="group-content">
      <router-view :key="route.fullPath"></router-view>
    </div>
  </div>
  <CreateGroup
    v-if="isShowCreateGroup"
    @onSubmit="onSubmitCreateGroup"
    @onClose="isShowCreateGroup = false"
  ></CreateGroup>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { groupService } from "@/services/group.service";
import { GROUP_TYPE } from "@/constants";
import { toastAlert } from "@/utilities/toastAlert";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const isShowCreateGroup = ref(false);
    const route = useRoute();
    const searchString = ref(null);
    const router = useRouter();

    const joinedGroup = reactive({
      data: [],
      pageSize: 10,
      pageNumber: 0,
      totalItems: 0,
    });

    const managedGroup = reactive({
      data: [],
      pageSize: 5,
      pageNumber: 0,
      totalItems: 0,
    });

    async function onSubmitCreateGroup(data) {
      try {
        const createGroupRes = await groupService.create(data);
        managedGroup.data.unshift(createGroupRes.data);
        managedGroup.totalItems++;
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi tạo nhóm");
      } finally {
        isShowCreateGroup.value = false;
        console.log(data);
      }
    }

    async function getJoinedGroup() {
      try {
        const res = await groupService.get({
          pageSize: joinedGroup.pageSize,
          pageNumber: joinedGroup.pageNumber + 1,
          type: GROUP_TYPE.JOINED_GROUP,
        });

        joinedGroup.data = res.data;
        joinedGroup.pageNumber++;
        joinedGroup.totalItems = res.totalItems;
      } catch (err) {
        toastAlert.error(err);
      }
    }

    async function getManageGroup() {
      try {
        const res = await groupService.get({
          pageSize: managedGroup.pageSize,
          pageNumber: managedGroup.pageNumber + 1,
          type: GROUP_TYPE.MANAGE_BY_ME,
        });

        managedGroup.data = res.data;
        managedGroup.pageNumber++;
        managedGroup.totalItems = res.totalItems;
      } catch (err) {
        toastAlert.error(err);
      }
    }

    function onSubmitSearch() {
      if (searchString.value && searchString.value.trim()) {
        router.push({
          name: "group-search",
          query: {
            s: searchString.value.trim(),
          },
        });
      }
    }

    onMounted(async () => {
      await getJoinedGroup();
      await getManageGroup();
      store.dispatch("feedPost/reset");
    });

    return {
      joinedGroup,
      searchString,
      managedGroup,
      isShowCreateGroup,
      route,
      onSubmitCreateGroup,
      onSubmitSearch,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-container {
  @apply pt-14 h-screen flex;

  .group-navbar {
    @apply w-90 shadow-md h-full flex flex-col border-r border-gray-100;
    .group-navbar-header {
      @apply px-4 py-2;
      .navbar-header-text {
        @apply text-xl font-bold;
      }
    }

    .group-navbar-search {
      @apply px-4 relative;
      .navbar-search-icon {
        @apply absolute left-6 top-1/2 -translate-y-1/2 text-15 text-gray-400;
      }
      .navbar-search-input {
        @apply rounded-full bg-gray-100 text-15 px-8 py-1.5 w-full outline-none border-none;
      }
    }

    .navbar-scroll-container {
      @apply flex-1 overflow-y-auto mt-2;

      &::-webkit-scrollbar {
        @apply w-2 left-0;
      }

      &::-webkit-scrollbar-thumb {
        @apply rounded-lg bg-gray-300;
      }

      &::-webkit-scrollbar-track {
        @apply hidden;
      }

      .group-navbar-list {
        @apply p-2;
        .group-navbar-item {
          @apply p-2 rounded-lg flex items-center hover:bg-gray-100 transition-all cursor-pointer;
          .navbar-item-icon {
            @apply rounded-full w-8 h-8 flex items-center justify-center bg-gray-100;
          }
          .navbar-item-text {
            @apply ms-2 text-15 font-semibold;
          }

          &.active {
            @apply bg-gray-100;
            .navbar-item-icon {
              @apply bg-primary;
              i {
                filter: invert(100);
              }
            }
          }
        }
      }

      .group-create {
        @apply mx-4;
        .group-create-btn {
          @apply flex items-center justify-center bg-primary bg-opacity-5 text-primary font-semibold text-15 w-full p-2 rounded-lg hover:bg-opacity-10 transition-all;

          .group-btn-icon {
            @apply me-1 text-13 font-bold;
          }
        }
      }

      .group-joined-container {
        @apply px-2 py-4;
        .group-joined-header {
          @apply flex justify-between items-center mx-2 py-2 border-t;
          .grp-joined-header-text {
            @apply text-17 font-semibold;
          }
          .grp-joined-link {
            @apply text-15 text-primary;
          }
        }

        .group-joined-list {
          .group-joined-item {
            @apply flex items-center p-2 hover:bg-gray-100 transition-all rounded-lg cursor-pointer;

            &.active {
              @apply bg-gray-100 bg-opacity-80;
            }

            .group-joined-image {
              @apply w-12 h-12 min-w-12 min-h-12 rounded-md overflow-hidden;

              img {
                @apply w-full h-full object-cover;
              }
            }

            .group-joined-name {
              @apply ms-3 text-15 font-semibold leading-18;
            }
          }
        }
      }
    }
  }

  .group-content {
    @apply bg-gray-100 flex-1 h-full;
  }
}
</style>
