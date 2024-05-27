<template>
  <div>
    <sidebar />
    <div class="relative md:ml-64 bg-blueGray-100">
      <admin-navbar />
      <header-stats />
      <div class="px-4 md:px-10 mx-auto w-full -m-24">
        <!-- <router-view /> -->
        <slot />
        <footer-admin />
      </div>
    </div>
  </div>
</template>
<script>
import AdminNavbar from "@/components/Admin/Navbars/AdminNavbar.vue";
import Sidebar from "@/components/Admin/Sidebar/Sidebar.vue";
import HeaderStats from "@/components/Admin/Headers/HeaderStats.vue";
import FooterAdmin from "@/components/Admin/Footers/FooterAdmin.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
export default {
  name: "admin-layout",
  components: {
    AdminNavbar,
    Sidebar,
    HeaderStats,
    FooterAdmin,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    store.dispatch("user/getDataUser");
    const userData = () => store.getters["user/getUser"];
    console.log(userData.value);

    onMounted(async () => {
      await store.dispatch("user/getDataUser");
      const userData = store.getters["user/getUser"];
      if (!userData.isAdmin) {
        router.push({
          name: "not-found",
        });
      }
    });
  },
};
</script>
