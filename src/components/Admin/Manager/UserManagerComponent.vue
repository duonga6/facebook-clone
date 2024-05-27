<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded text-dark bg-white"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div
          class="relative w-full px-4 max-w-full flex-grow flex-1 flex items-center justify-between"
        >
          <h3 class="font-semibold text-lg">Người dùng</h3>
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
              Tên hiển thị
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Vai trò
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Email
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Giới tính
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Địa chỉ
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Bài viết
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Bạn bè
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Trạng thái
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userData.data" :key="user.id">
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
            >
              <img
                :src="user.avatarUrl"
                class="h-12 w-12 bg-white rounded-full border object-cover"
                alt="..."
              />
              <router-link
                :to="{
                  name: 'profile',
                  params: {
                    id: user.id,
                  },
                }"
                class="ml-3 font-bold text-dark"
              >
                {{ user.firstName + " " + user.lastName }}
              </router-link>
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <span v-for="(role, index) in user.roles" :key="index"
                >{{ role }}<br
              /></span>
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ user.email }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <i class="fas fa-circle text-orange-500 mr-2"></i>
              {{ user.gender == 1 ? "Nam" : "Nữ" }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ user.address }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ user.totalPost }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
            >
              {{ user.totalFriend }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
            >
              <span v-if="user.isLocked">Đang khóa</span>
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left relative"
            >
              <button
                class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full relative"
                :class="{ 'bg-gray-200': user.isShowMore }"
                @click="user.isShowMore = !user.isShowMore"
                v-click-outside="() => (user.isShowMore = false)"
                v-if="!user.isSuperAdmin"
              >
                <i class="text-15 text-gray-500 pi pi-ellipsis-h"></i>
                <ul
                  class="absolute top-9 right-0 rounded-lg bg-white shadow-custom-sm z-10 text-left"
                  v-if="user.isShowMore"
                >
                  <li
                    class="p-2"
                    @click="addRoleAdmin(user.id)"
                    v-if="!user.isAdmin && currentUser.isSuperAdmin"
                  >
                    Đặt làm quản trị viên
                  </li>
                  <li
                    class="p-2"
                    @click="removeRoleAdmin(user.id)"
                    v-if="
                      !user.isSuperAdmin &&
                      user.isAdmin &&
                      currentUser.isSuperAdmin
                    "
                  >
                    Xóa quản trị viên
                  </li>
                  <li
                    class="p-2"
                    v-if="
                      (currentUser.isSuperAdmin ||
                        (!user.isAdmin && !user.isSuperAdmin)) &&
                      !user.isLocked
                    "
                    @click="showConfirmLock(user.id)"
                  >
                    Khóa tài khoản
                  </li>
                  <li
                    class="p-2"
                    v-if="
                      (currentUser.isSuperAdmin ||
                        (!user.isAdmin && !user.isSuperAdmin)) &&
                      user.isLocked
                    "
                    @click="unLockOutAccount(user.id)"
                  >
                    Mở khóa tài khoản
                  </li>
                  <!-- <li class="p-2">Đặt lại mật khẩu</li> -->
                </ul>
              </button>
            </td>
          </tr>
          <Paginator
            :rows="10"
            :totalRecords="userData.total"
            :showCurrentPageReport="false"
            @page="onPageChange"
          ></Paginator>
        </tbody>
      </table>
    </div>
  </div>
  <ModalConfirm
    @onClose="closeConfirmLock"
    @onSubmit="lockOutAccount"
    v-if="isShowConfirm"
    :title="modalContent.title"
    :content="modalContent.content"
  ></ModalConfirm>
</template>
<script>
import { computed, onMounted, reactive, ref } from "vue";
import { adminService } from "@/services/admin.service";
import { toastAlert } from "@/utilities/toastAlert";
import { userService } from "@/services/user.service";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const currentUser = computed(() => {
      const user = store.getters["user/getUser"];
      return {
        ...user,
        isSuperAdmin: user?.roles.find((x) => x == "SuperAdministrator"),
      };
    });

    const selectedUserId = ref(null);
    const isShowConfirm = ref(false);
    const modalContent = reactive({
      title: "Khóa người dùng",
      content: "Bạn có chắc muốn xóa người dùng này không?",
    });

    const userData = reactive({
      data: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      isFetch: false,
    });

    const searchString = ref(null);

    async function onPageChange(data) {
      await getUser(userData, data.page + 1);
    }

    async function submitSearch() {
      await getUser(userData, 1, searchString.value);
    }

    async function addRoleAdmin(id) {
      var user = userData.data.find((x) => x.id == id);
      if (user) {
        try {
          await userService.addRole(id, {
            roles: ["Administrator"],
          });

          user.roles.push("Administrator");
          user.isAdmin = true;
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi thêm vai trò");
        }
      }
    }

    async function removeRoleAdmin(id) {
      var user = userData.data.find((x) => x.id == id);
      if (user) {
        try {
          await userService.removeRole(id, {
            roles: ["Administrator"],
          });

          user.roles = user.roles.filter((x) => x != "Administrator");
          user.isAdmin = false;
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi thêm vai trò");
        }
      }
    }

    function showConfirmLock(id) {
      selectedUserId.value = id;
      isShowConfirm.value = true;
    }

    function closeConfirmLock() {
      selectedUserId.value = null;
      isShowConfirm.value = false;
    }

    async function lockOutAccount() {
      const user = userData.data.find((x) => x.id == selectedUserId.value);
      if (user) {
        try {
          await userService.lock(selectedUserId.value);
          user.isLocked = true;
          isShowConfirm.value = false;
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi khóa tài khoản");
        }
      }
    }

    async function unLockOutAccount(id) {
      const user = userData.data.find((x) => x.id == id);
      if (user) {
        try {
          await userService.unLock(id);
          user.isLocked = false;
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi khóa tài khoản");
        }
      }
    }

    onMounted(async () => {
      await getUser(userData, 1);
    });

    return {
      userData,
      currentUser,
      searchString,
      isShowConfirm,
      modalContent,
      onPageChange,
      submitSearch,
      addRoleAdmin,
      removeRoleAdmin,
      showConfirmLock,
      lockOutAccount,
      unLockOutAccount,
      closeConfirmLock,
    };
  },
};

async function getUser(userData, pageNumber, searchString) {
  if (userData.pageSize * pageNumber < userData.total || !userData.isFetch) {
    try {
      const res = await adminService.getUser({
        pageNumber: pageNumber,
        pageSize: userData.pageSize,
        searchString: searchString,
      });

      userData.data = res.data.map((item) => {
        return {
          ...item,
          isAdmin: item.roles.find((x) => x == "Administrator"),
          isSuperAdmin: item.roles.find((x) => x == "SuperAdministrator"),
        };
      });
      userData.pageNumber = pageNumber;
      userData.total = res.totalItems;

      console.log(userData.data);
    } catch (error) {
      console.error(error);
      toastAlert.error("Có lỗi khi tải user");
    }
  }
}
</script>
