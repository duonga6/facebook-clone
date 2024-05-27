<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded text-dark bg-white"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div
          class="relative w-full px-4 max-w-full flex-grow flex-1 flex items-center justify-between"
        >
          <h3 class="font-semibold text-lg">Báo cáo</h3>
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
              Nội dung
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Người báo cáo
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Loại báo cáo
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Thời gian
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itemData.data" :key="item.id">
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 truncate max-w-60 hover:underline"
            >
              <router-link
                :to="{
                  name: 'admin-report-detail-page',
                  params: {
                    id: item.id,
                  },
                }"
              >
                {{ item.content }}
              </router-link>
            </td>
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
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold"
            >
              <div>
                {{ item.reportType }}
              </div>
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
            >
              {{ converDateToDDMMYYY(item.createdAt) }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
            >
              <i v-if="item.isSolved" class="pi pi-check text-green-500"></i>
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
  <ModalConfirm
    @onClose="closeConfirm"
    @onSubmit="confirmDelete"
    v-if="isShowConfirm"
    :title="modalContent.title"
    :content="modalContent.content"
  ></ModalConfirm>
</template>
<script>
import { onMounted, reactive, ref } from "vue";
import { toastAlert } from "@/utilities/toastAlert";
import { adminService } from "@/services/admin.service";
import { converDateToDDMMYYY } from "@/utilities/dateUtils";
import { postService } from "@/services/post.service";

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

    const selectedGroupId = ref(null);
    const isShowConfirm = ref(false);
    const modalContent = reactive({
      title: "Xóa bài viết",
      content: "Bạn có chắc muốn xóa bài viết này không?",
    });

    function closeConfirm() {
      selectedGroupId.value = null;
      isShowConfirm.value = false;
    }

    function showConfirmDelete(id) {
      selectedGroupId.value = id;
      isShowConfirm.value = true;
    }

    async function confirmDelete() {
      const group = itemData.data.find((x) => x.id == selectedGroupId.value);
      if (group) {
        try {
          await postService.delete(selectedGroupId.value);
          itemData.data = itemData.data.filter(
            (x) => x.id != selectedGroupId.value
          );
          isShowConfirm.value = false;
          selectedGroupId.value = null;
        } catch (error) {
          console.error(error);
          toastAlert.error("Có lỗi khi xóa nhóm");
        }
      }
    }

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
      modalContent,
      isShowConfirm,
      closeConfirm,
      showConfirmDelete,
      confirmDelete,
      onPageChange,
      submitSearch,
      converDateToDDMMYYY,
    };
  },
};

async function getData(itemData, pageNumber, searchString) {
  if (itemData.pageSize * pageNumber < itemData.total || !itemData.isFetch) {
    try {
      const res = await adminService.getReport({
        pageNumber: pageNumber,
        pageSize: itemData.pageSize,
        searchString: searchString,
      });

      itemData.data = res.data;
      itemData.pageNumber = pageNumber;
      itemData.total = res.totalItems;

      console.log(res);
    } catch (error) {
      console.error(error);
      toastAlert.error("Có lỗi khi tải nhóm");
    }
  }
}
</script>
