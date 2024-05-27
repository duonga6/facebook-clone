<template>
  <div></div>
</template>
<script>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toastAlert } from "@/utilities/toastAlert";
import { userService } from "@/services/user.service";
import tokenService from "@/services/token.service";
import { useStore } from "vuex";
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    onMounted(async () => {
      try {
        const res = await userService.confirmEmail({
          email: route.query.code,
          code: route.query.email,
        });

        tokenService.setUser(res.data);
        store.dispatch("auth/setUser", res.data);
        router.push({
          name: "home",
        });
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi xác thực email");
        router.push({
          name: "not-found",
        });
      }
    });

    return {};
  },
};
</script>
