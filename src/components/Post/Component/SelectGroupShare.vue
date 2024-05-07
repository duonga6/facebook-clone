<template>
  <div class="select-group-container">
    <div class="select-group-form">
      <div class="select-group-header">
        <div class=""></div>
        <div class="select-header-text">Chia sẻ lên nhóm</div>
        <div class="select-header-action">
          <button class="header-action-btn" @click="onCloseSelectShareGroup">
            <i class="action-btn-icon pi pi-times"></i>
          </button>
        </div>
      </div>
      <div class="select-group-search">
        <i class="group-search-icon pi pi-search"></i>
        <input class="group-search-input" type="text" v-model="searchString" />
      </div>
      <div class="group-search-result">
        <div class="search-result-header">
          <div class="search-result-text">Tất cả các nhóm</div>
        </div>
        <div class="group-result-list scroll" v-scroll-bottom="onScrollBottom">
          <div
            class="group-result-item"
            v-for="group in groupData.data"
            :key="group.id"
            @click="onSelectedGroup(group.id)"
          >
            <div class="group-item-image">
              <img :src="group.coverImage" alt="" />
            </div>
            <div class="group-item-info">
              <div class="group-item-name">{{ group.name }}</div>
              <div class="group-item-type">
                {{ group.isPublic ? "Nhóm công khai" : "Nhóm riêng tư" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";
import tokenService from "@/services/token.service";
import { toastAlert } from "@/utilities/toastAlert";
import { groupService } from "@/services/group.service";
import { GROUP_TYPE } from "@/constants";
export default {
  emits: ["onSeletedGroup", "onClose"],
  setup(_, { emit }) {
    const user = tokenService.getUser();
    const searchString = ref(null);
    const isFetching = ref(false);
    const groupData = reactive({
      pageSize: 10,
      pageNumber: 0,
      data: [],
      searchString: null,
      totalItems: 0,
      isFetched: false,
    });

    let timeOutSearch;

    watch(
      () => searchString.value,
      (newVal) => {
        clearTimeout(timeOutSearch);
        timeOutSearch = setTimeout(async () => {
          isFetching.value = true;
          await getGroup(groupData, newVal);
          isFetching.value = false;
        }, 500);
      }
    );

    onMounted(async () => {
      await getGroup(groupData);
    });

    function onSelectedGroup(id) {
      emit("onSeletedGroup", id);
    }

    function onCloseSelectShareGroup() {
      emit("onClose");
    }

    async function onScrollBottom() {
      if (
        (groupData.pageSize * groupData.pageNumber < groupData.totalItems ||
          !groupData.isFetched) &&
        !isFetching.value
      ) {
        isFetching.value = true;
        await getGroup(groupData);

        isFetching.value = false;
      }
    }

    return {
      groupData,
      user,
      searchString,
      onSelectedGroup,
      onCloseSelectShareGroup,
      onScrollBottom,
    };
  },
};

function resetData(groupData) {
  groupData.pageSize = 10;
  groupData.pageNumber = 0;
  groupData.data = [];
  groupData.searchString = null;
  groupData.totalItems = 0;
  groupData.isFetched = false;
}

async function getGroup(groupData, searchString) {
  if (searchString != groupData.searchString) {
    resetData(groupData);
  }

  if (
    groupData.pageSize * groupData.pageNumber >= groupData.totalItems &&
    groupData.isFetched
  )
    return;

  try {
    const groupRes = await groupService.get({
      pageSize: groupData.pageSize,
      pageNumber: groupData.pageNumber + 1,
      searchString: searchString,
      type: GROUP_TYPE.ALL,
    });

    groupData.data.push(...groupRes.data);
    groupData.pageNumber++;
    groupData.totalItems = groupRes.totalItems;
    groupData.isFetched = true;
    groupData.searchString = searchString;
  } catch (error) {
    console.error(error);
    toastAlert.error("Có lỗi khi lấy dữ liệu nhóm");
  }
}
</script>

<style lang="scss" scoped>
.select-group-container {
  @apply fixed top-0 bottom-0 left-0 right-0 bg-white bg-opacity-60 flex items-center justify-center z-20;

  .select-group-form {
    max-height: 80vh;
    max-width: 480px;

    @apply bg-white rounded-lg w-full shadow-custom-md flex flex-col;

    .select-group-header {
      @apply flex items-center justify-between p-4 border-b border-gray-200;

      .select-header-text {
        @apply font-bold text-xl;
      }
      .select-header-action {
        .header-action-btn {
          @apply w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all;

          .action-btn-icon {
            @apply text-12 font-semibold text-gray-500;
          }
        }
      }
    }
    .select-group-search {
      @apply relative mx-4 my-3;

      .group-search-icon {
        @apply absolute top-1/2 -translate-y-1/2 left-4 text-15 font-semibold text-gray-600;
      }
      .group-search-input {
        @apply w-full rounded-full p-1.5 ps-9 bg-gray-100 text-15 outline-none border-none;
      }
    }

    .group-search-result {
      @apply px-4 py-2 flex-1 flex flex-col overflow-hidden;

      .search-result-header {
        @apply px-2;

        .search-result-text {
          @apply font-semibold text-17;
        }
      }

      .group-result-list {
        @apply flex-1 mt-2 overflow-y-auto;

        .group-result-item {
          @apply p-2 rounded-lg hover:bg-gray-100 transition-all flex items-center cursor-pointer;

          .group-item-image {
            @apply w-12 h-12 rounded-lg overflow-hidden;

            img {
              @apply w-full h-full object-cover;
            }
          }
          .group-item-info {
            @apply ms-3;

            .group-item-name {
              @apply text-17 font-semibold leading-5;
            }

            .group-item-type {
              @apply text-15 text-gray-600 leading-5;
            }
          }
        }
      }
    }
  }
}
</style>
