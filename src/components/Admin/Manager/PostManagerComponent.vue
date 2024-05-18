<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded text-dark bg-white"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div
          class="relative w-full px-4 max-w-full flex-grow flex-1 flex items-center justify-between"
        >
          <h3 class="font-semibold text-lg">Bài viết</h3>
          <form class="flex items-center" @submit.prevent="submitSearch">
            <div class="text-15 me-2">Tìm kiếm</div>
            <input
              type="text"
              class="border outline-none border-gray-200 rounded-lg px-2 py-1"
              v-model="searchString"
            />
            <button class="p-2 rounded-lg pi pi-search"></button>
          </form>
        </div>
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <!-- Projects table -->
      <table
        class="items-center w-full bg-transparent border-collapse text-dark"
      >
        <thead>
          <tr>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Người đăng
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Nội dung
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Nhóm
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Số bình luận
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Số bảy tỏ cảm xúc
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Ngày đăng
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itemData.data" :key="item.id">
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
            >
              <img
                :src="item.user.avatarUrl"
                class="h-12 w-12 bg-white rounded-full border object-cover"
                alt="..."
              />
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: item.user.id,
                  },
                }"
                class="ml-3 font-bold text-dark"
              >
                {{ item.user.firstName + " " + item.user.lastName }}
              </router-link>
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 truncate max-w-60"
            >
              {{ item.content }}
              >
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold"
            >
              <router-link
                v-if="item.group"
                :to="{
                  name: 'group-details-post',
                  params: { id: item.group.id },
                }"
              >
                {{ item.group.name }}
              </router-link>
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ item.totalComment }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
            >
              {{ item.totalReaction }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
            >
              {{ converDateToDDMMYYY(item.createdAt) }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left relative"
            >
              <button
                class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full relative"
                :class="{ 'bg-gray-200': item.isShowMore }"
                @click="item.isShowMore = !item.isShowMore"
                v-click-outside="() => (item.isShowMore = false)"
              >
                <i class="text-15 text-gray-500 pi pi-ellipsis-h"></i>
                <ul
                  class="absolute top-9 right-0 rounded-lg bg-white shadow-custom-sm"
                  v-if="item.isShowMore"
                >
                  <li class="p-2">Xóa bài viết</li>
                </ul>
              </button>
            </td>
          </tr>
          <Paginator
            :rows="10"
            :totalRecords="itemData.total"
            :showCurrentPageReport="false"
            @page="onPageChange"
          ></Paginator>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { onMounted, reactive, ref } from "vue";
import { toastAlert } from "@/utilities/toastAlert";
import { GROUP_TYPE } from "@/constants";
import { adminService } from "@/services/admin.service";
import { converDateToDDMMYYY } from "@/utilities/dateUtils";

export default {
  setup() {
    const itemData = reactive({
      data: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      isFetch: false,
    });

    const searchString = ref(null);

    async function onPageChange(data) {
      await getData(itemData, data.page + 1);
    }

    async function submitSearch() {
      await getData(itemData, 1, searchString.value);
    }

    onMounted(async () => {
      await getData(itemData, 1);
    });

    return {
      itemData,
      searchString,
      onPageChange,
      submitSearch,
      converDateToDDMMYYY,
    };
  },
};

async function getData(itemData, pageNumber, searchString) {
  if (itemData.pageSize * pageNumber < itemData.total || !itemData.isFetch) {
    try {
      const res = await adminService.getPost({
        pageNumber: pageNumber,
        pageSize: itemData.pageSize,
        searchString: searchString,
        type: GROUP_TYPE.ALL,
      });

      itemData.data = res.data;
      itemData.pageNumber = pageNumber;
      itemData.total = res.totalItems;
    } catch (error) {
      console.error(error);
      toastAlert.error("Có lỗi khi tải nhóm");
    }
  }
}
</script>
