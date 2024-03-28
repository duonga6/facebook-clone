<template>
  <li class="noti-alert-item" :class="classStatus" v-if="isShow">
    <div class="noti-alert-header">
      <div class="noti-header-text">Thông báo mới</div>
      <button class="noti-close-btn">
        <i class="noti-close-icon pi pi-times"></i>
      </button>
    </div>
    <div class="noti-alert-main">
      <div class="noti-alert-user">
        <img :src="data.fromUser.avatarUrl" alt="" class="noti-alert-avatar" />
      </div>
      <div class="noti-alert-content">
        <div class="noti-alert-text" v-html="data.content"></div>
        <div class="noti-alert-time">vài giây trước</div>
      </div>
      <div class="noti-read-status">
        <div class=""></div>
        <div class="noti-read-icon"></div>
      </div>
    </div>
  </li>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const isShow = ref(true);
    const classStatus = ref("null");

    setTimeout(() => {
      classStatus.value = "show";
    }, 1000);

    setTimeout(() => {
      classStatus.value = "hide";
    }, 4000);

    setTimeout(() => {
      isShow.value = false;
    }, 5000);

    return {
      classStatus,
      isShow,
    };
  },
};
</script>

<style lang="scss" scoped>
.noti-alert-item {
  @apply bg-white shadow-custom-sm rounded-lg p-2 cursor-pointer transition-all invisible opacity-0;

  &.show {
    @apply visible opacity-100;
  }

  &.hide {
    transform: translateX(-400px);
  }

  .noti-alert-header {
    @apply flex items-center justify-between px-2 py-0.5;

    .noti-header-text {
      @apply text-15 font-semibold;
    }

    .noti-close-btn {
      @apply w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-full transition-all;

      .noti-close-icon {
        @apply text-13 font-semibold text-gray-600;
      }
    }
  }

  .noti-alert-main {
    @apply flex items-start p-2 rounded-lg hover:bg-gray-100 transition-all;

    .noti-alert-user {
      .noti-alert-avatar {
        @apply w-14 h-14 min-w-14 min-h-14 rounded-full object-cover;
      }
    }

    .noti-alert-content {
      @apply text-15 leading-18 ms-2;

      .noti-alert-text {
        & ::v-deep strong {
          @apply font-semibold;
        }
      }

      .noti-alert-time {
        @apply text-13 font-semibold text-primary;
      }
    }
  }

  .noti-read-status {
    @apply my-auto mx-1;

    .noti-read-icon {
      @apply w-3 h-3 rounded-full bg-primary;
    }
  }
}
</style>
