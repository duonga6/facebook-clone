<template>
  <div class="leave-group-component" @click.prevent.self="onClose">
    <div class="leave-group-tab">
      <div class="leave-group-header">
        <div class=""></div>
        <div class="leave-header-text">Rời nhóm ?</div>
        <div class="close-btn" @click="onClose">
          <i class="close-btn-icon pi pi-times"></i>
        </div>
      </div>
      <div class="leave-group-content">
        Bạn sẽ không nhận được tin nhắn từ cuộc trò chuyện này nữa.
      </div>
      <div class="leave-group-action">
        <button class="leave-action-btn btn--second" @click="onClose">
          Hủy
        </button>
        <button class="leave-action-btn btn--primary" @click="onSubmit">
          Xác nhận
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["onClose", "onSubmit"],
  setup(_, { emit }) {
    function onClose() {
      emit("onClose");
    }

    function onSubmit() {
      emit("onSubmit");
    }

    return {
      onClose,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.leave-group-component {
  @apply fixed top-0 right-0 bottom-0 left-0 bg-white bg-opacity-50 flex items-center justify-center;

  .leave-group-tab {
    @apply w-500px bg-white rounded-lg border border-gray-200 shadow-custom-sm;

    .leave-group-header {
      @apply flex items-center justify-between p-4 py-3 border-b border-gray-200;

      .leave-header-text {
        @apply text-xl font-bold;
      }

      .close-btn {
        @apply w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200;

        .close-btn-icon {
          @apply text-15;
        }
      }
    }
    .leave-group-content {
      @apply text-15 p-4;
    }
    .leave-group-action {
      @apply p-4 flex items-center justify-end space-x-3;

      .leave-action-btn {
        @apply p-2 px-4 rounded-lg text-15 font-semibold;

        &.btn--primary {
          @apply bg-primary text-white;
        }

        &.btn--second {
          @apply bg-gray-200 text-dark;
        }
      }
    }
  }
}
</style>
