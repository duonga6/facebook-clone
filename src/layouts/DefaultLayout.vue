<template>
  <HeaderComponent />
  <slot />
  <message-overlay v-if="true"></message-overlay>
</template>

<script>
import HeaderComponent from "@/components/Header/HeaderComponent.vue";
import MessageOverlay from "@/components/Messages/MessageWindowControl.vue";
import { useStore } from "vuex";
// import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import eventBus from "@/common/EventBus";
import { generateNotificationUrl } from "@/utilities/notification";
import signalRService from "@/services/signalR.service";
import { onMounted } from "vue";
export default {
  components: { HeaderComponent, MessageOverlay },
  setup() {
    const store = useStore();
    store.dispatch("user/getDataUser");

    // let connection = new HubConnectionBuilder()
    //   .configureLogging(LogLevel.None)
    //   .withUrl("http://localhost:9999/hub", {
    //     accessTokenFactory: () => {
    //       return token;
    //     },
    //   })
    //   .build();

    onMounted(async () => {
      await signalRService.start();
      const connection = signalRService.connection;

      connection.on("NewNotification", async (data) => {
        data.jsonDetail = JSON.parse(data.jsonDetail);
        data.router = await generateNotificationUrl(data);
        eventBus.dispatch("NewNotificaiton", data);
      });

      connection.on("NewMessage", (data) => {
        eventBus.dispatch("NewMessage", data);
      });

      connection.on("ChangeConversationName", (data) => {
        eventBus.dispatch("ChangeConversationName", {
          conversationId: data.id,
          data: data,
        });

        store.dispatch("conversation/changeConversationNameWithoutFetch", data);
      });
    });
  },
};
</script>
