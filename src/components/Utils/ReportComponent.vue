<template>
  <div class="leave-group-component" @click.prevent.self="onClose">
    <div class="leave-group-tab">
      <div class="leave-group-header">
        <div class=""></div>
        <div class="leave-header-text">{{ title }}</div>
        <div class="close-btn" @click="onClose">
          <i class="close-btn-icon pi pi-times"></i>
        </div>
      </div>
      <div class="leave-group-content">Nhập nội dung báo cáo</div>
      <div class="report-content">
        <textarea class="input-report" rows="10" v-model="inputText"></textarea>
      </div>
      <div class="leave-group-action">
        <button class="leave-action-btn btn--second" @click="onClose">
          Hủy
        </button>
        <button
          class="leave-action-btn btn--primary"
          :class="{ disable: !isCanSubmit }"
          @click="onSubmit"
          :disabled="!isCanSubmit"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { REPORT_TYPE } from "@/constants";
import { reportService } from "@/services/report.service";
import { toastAlert } from "@/utilities/toastAlert";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    reportType: {
      type: Number,
      default: REPORT_TYPE.POST,
    },
    relationId: {
      type: String,
      required: true,
    },
  },
  emits: ["onClose", "onSubmit"],
  setup(props, { emit }) {
    const inputText = ref(null);

    const isCanSubmit = computed(
      () => inputText.value && inputText.value.trim()
    );

    function onClose() {
      emit("onClose");
    }

    async function onSubmit() {
      if (isCanSubmit.value) {
        try {
          await reportService.create({
            reportType: props.reportType,
            content: inputText.value,
            relationId: props.relationId,
          });
          toastAlert.success("Báo cáo của bạn đã được gửi đi");
        } catch (err) {
          if (err.errors.find((x) => x == "RP_EXIST")) {
            toastAlert.error(
              "Bạn đã gửi báo cáo trước đó hãy chờ quản trị viên xử lý"
            );
          } else {
            console.error(err);
            toastAlert.error("Có lỗi khi báo cáo bài viết");
          }
        } finally {
          emit("onSubmit");
        }
      }
    }

    return {
      onClose,
      onSubmit,
      inputText,
      isCanSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.leave-group-component {
  @apply fixed top-0 right-0 bottom-0 left-0 bg-white bg-opacity-50 flex items-center justify-center z-50;

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

    .report-content {
      @apply p-4 pt-0;
      .input-report {
        @apply border border-gray-200 w-full outline-none rounded-lg p-2;
      }
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

        &.disable {
          @apply bg-gray-200 text-dark;
        }
      }
    }
  }
}
</style>
