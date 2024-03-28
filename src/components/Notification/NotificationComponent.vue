<template>
  <div class="notification-container" @click="handleToggleShowNoti">
    <div class="notification-icon">
      <svg viewBox="0 0 24 24" width="20" height="20" class="text-gray-950">
        <path
          d="M3 9.5a9 9 0 1 1 18 0v2.927c0 1.69.475 3.345 1.37 4.778a1.5 1.5 0 0 1-1.272 2.295h-4.625a4.5 4.5 0 0 1-8.946 0H2.902a1.5 1.5 0 0 1-1.272-2.295A9.01 9.01 0 0 0 3 12.43V9.5zm6.55 10a2.5 2.5 0 0 0 4.9 0h-4.9z"
        ></path>
      </svg>
    </div>
    <div
      class="notify-tab"
      :class="isShowNotify ? 'opacity-100 visible' : 'opacity-0 invisible'"
    >
      <div class="notify-header">Thông báo</div>
      <div class="notify-list">
        <router-link
          :to="noti.router"
          class="notify-item"
          v-for="noti in notiData.data"
          :key="noti.id"
          :class="{ readed: noti.readAt }"
        >
          <div class="from-user-avatar">
            <img :src="noti.fromUser.avatarUrl" alt="" />
            <div class="notify-type-icon"></div>
          </div>
          <div class="notify-content">
            <div class="notify-text" v-html="noti.content"></div>
            <div class="notify-created-at">
              {{ convertDateDisplay(new Date(noti.createdAt)) }} trước
            </div>
          </div>
          <div class="notify-read-status">
            <div class="notify-read-icon"></div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
  <NotificationAlert></NotificationAlert>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { notificatonService } from "@/services/notification.service";
import { convertDateDisplay } from "@/utilities/dateUtils";
import NotificationAlert from "@/components/Notification/NotificationAlertComponent.vue";
import { generateNotificationUrl } from "@/utilities/notification";
import eventBus from "@/common/EventBus";

export default {
  components: {
    NotificationAlert,
  },
  async setup() {
    const isShowNotify = ref(false);

    const notiData = reactive({
      data: [],
      endCursor: null,
      pageSize: 10,
      hasNext: true,
      total: 0,
    });

    onMounted(() => {
      eventBus.on("NewNotificaiton", (data) => {
        notiData.data = [data, ...notiData.data];
      });
    });

    onUnmounted(() => {
      eventBus.remove("NewNotificaiton");
    });

    await getNotifications(notiData, true);

    function handleToggleShowNoti() {
      isShowNotify.value = !isShowNotify.value;
    }

    return {
      isShowNotify,
      notiData,
      handleToggleShowNoti,
      convertDateDisplay,
    };
  },
};

async function getNotifications(notiData) {
  try {
    const res = await notificatonService.get({
      pageSize: notiData.pageSize,
      endCursor: notiData.endCursor,
      getNext: true,
    });

    res.data = await Promise.all(
      res.data.map(async (item) => {
        item.jsonDetail = JSON.parse(item.jsonDetail);
        item.router = await generateNotificationUrl(item);
        return item;
      })
    );

    // console.log(res);

    notiData.total = res.totalItems;
    notiData.data = [...notiData.data, ...res.data];
    notiData.endCursor = res.endCursor;
    notiData.hasNext = res.hasNext;
  } catch (err) {
    console.log(err);
  }
}
</script>

<style lang="scss">
.notification-container {
  @apply relative;

  .notification-icon {
  }

  .notify-tab {
    @apply absolute top-9 -right-14 w-90 bg-white shadow-custom-sm rounded-lg py-2 transition-all;

    .notify-header {
      @apply text-2xl font-bold px-4;
    }

    .notify-list {
      @apply px-2 mt-4;

      .notify-item {
        @apply p-2 flex items-start space-x-2 rounded-lg hover:bg-gray-100 transition-all;

        .from-user-avatar {
          @apply w-14 h-14 min-w-14 min-h-14 rounded-full overflow-hidden border border-gray-100;

          img {
            @apply w-full h-full object-cover;
          }
          .notify-type-icon {
          }
        }

        .notify-content {
          @apply flex-1 flex flex-col;

          .notify-text {
            @apply text-15 leading-18;

            strong {
              @apply font-semibold;
            }
          }
          .notify-created-at {
            @apply mt-0.5 text-13 leading-4 font-semibold text-primary;
          }
        }
        .notify-read-status {
          @apply my-auto;

          .notify-read-icon {
            @apply w-3 h-3 rounded-full bg-primary;
          }
        }

        &.readed {
          .notify-content {
            .notify-created-at {
              @apply font-normal text-gray-800;
            }
          }

          .notify-read-status {
            .notification-icon {
              @apply bg-transparent;
            }
          }
        }
      }
    }
  }
}
</style>
