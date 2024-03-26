<template>
  <HeaderComponent />
  <slot />
</template>

<script>
import HeaderComponent from "@/components/Header/HeaderComponent.vue";
import { useStore } from "vuex";
import tokenService from "@/services/token.service";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
export default {
  components: { HeaderComponent },
  setup() {
    const store = useStore();
    store.dispatch("user/getDataUser");

    const token = tokenService.getLocalToken()?.accessToken;

    let connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.None)
      .withUrl("http://localhost:9999/hub", {
        accessTokenFactory: () => {
          return token;
        },
      })
      .build();

    connection.start().catch(() => {
      console.log("Có lỗi khi kết nối socket");
    });
  },
};
</script>
