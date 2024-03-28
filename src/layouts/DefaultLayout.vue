<template>
  <HeaderComponent />
  <slot />
</template>

<script>
import HeaderComponent from "@/components/Header/HeaderComponent.vue";
import { useStore } from "vuex";
import tokenService from "@/services/token.service";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import eventBus from "@/common/EventBus";
import { generateNotificationUrl } from "@/utilities/notification";
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

    connection.on("NewNotification", async (data) => {
      data.jsonDetail = JSON.parse(data.jsonDetail);
      data.router = await generateNotificationUrl(data);
      eventBus.dispatch("NewNotificaiton", data);
    });
  },
};
</script>
