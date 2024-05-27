<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded text-dark bg-white"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div
          class="relative w-full px-4 max-w-full flex-grow flex-1 flex items-center justify-between"
        >
          <h3 class="font-semibold text-lg">Nhóm</h3>
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
              Tên nhóm
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Tạo bởi
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Số lượng thành viên
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Trạng thái
            </th>
            <!-- <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Số lượng bài viết
            </th> -->
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Mô tả
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itemData.data" :key="item.id">
            <th
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
            >
              <img
                :src="item.coverImage"
                class="h-12 w-12 bg-white rounded-full border object-cover"
                alt="..."
              />
              <router-link
                :to="{
                  name: 'group-details-post',
                  params: {
                    id: item.id,
                  },
                }"
                class="ml-3 font-bold text-dark"
              >
                {{ item.name }}
              </router-link>
            </th>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: item.user.id,
                  },
                }"
                >{{
                  item.user.firstName + " " + item.user.lastName
                }}</router-link
              >
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <i class="fas fa-circle text-orange-500 mr-2"></i>
              {{ item.totalMember }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ item.isPublic ? "Công khai" : "Riêng tư" }}
            </td>
            <!-- <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ item.totalPost }}
            </td> -->
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left truncate"
            >
              {{ item.description }}
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
                  <li class="p-2" @click="showConfirmDelete(item.id)">
                    Xóa nhóm
                  </li>
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
import { groupService } from "@/services/group.service";
import { GROUP_TYPE } from "@/constants";

export default {
  setup() {
    const groupData = reactive({
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
      title: "Xóa nhóm",
      content: "Bạn có chắc muốn xóa nhóm này không?",
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
      const group = groupData.data.find((x) => x.id == selectedGroupId.value);
      if (group) {
        try {
          await groupService.delete(selectedGroupId.value);
          groupData.data = groupData.data.filter(
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
      await getData(groupData, data.page + 1);
    }

    async function submitSearch() {
      await getData(groupData, 1, searchString.value);
    }

    onMounted(async () => {
      await getData(groupData, 1);
    });

    return {
      itemData: groupData,
      searchString,
      isShowConfirm,
      modalContent,
      confirmDelete,
      closeConfirm,
      showConfirmDelete,
      onPageChange,
      submitSearch,
    };
  },
};

async function getData(groupData, pageNumber, searchString) {
  if (groupData.pageSize * pageNumber < groupData.total || !groupData.isFetch) {
    try {
      const res = await groupService.get({
        pageNumber: pageNumber,
        pageSize: groupData.pageSize,
        searchString: searchString,
        type: GROUP_TYPE.ALL,
      });

      groupData.data = res.data;
      groupData.pageNumber = pageNumber;
      groupData.total = res.totalItems;
    } catch (error) {
      console.error(error);
      toastAlert.error("Có lỗi khi tải nhóm");
    }
  }
}
</script>
