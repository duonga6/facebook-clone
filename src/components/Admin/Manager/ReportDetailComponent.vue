<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded text-dark bg-white"
    v-if="report.data"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div
          class="relative w-full px-4 max-w-full flex-grow flex-1 flex items-center justify-between"
        >
          <h3 class="font-semibold text-lg">Nội dung báo cáo</h3>

          <!-- Button mark read -->

          <button
            class="rounded-lg p-4 py-2 bg-primary text-white font-semibold text-13"
            v-if="!report.data.isSolved"
            @click="isShowConfim = true"
          >
            Đánh dấu đã giải quyết
          </button>
          <button
            class="rounded-lg p-4 py-2 bg-green-500 text-white font-semibold text-13"
            v-if="report.data.isSolved"
            :disabled="true"
          >
            Đã giải quyết
          </button>
        </div>
      </div>
    </div>
    <div class="flex p-4 mt-4 space-x-6">
      <div class="px-4 flex flex-col space-y-1 w-1/2">
        <div class="flex items-center space-x-4">
          <div class="font-semibold w-56">Người gửi</div>
          <div class="flex items-center">
            <router-link
              :to="{
                name: 'profile',
                params: {
                  id: report.data.user.id,
                },
              }"
              class="text-dark"
            >
              {{ report.data.user.firstName + " " + report.data.user.lastName }}
            </router-link>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="font-semibold w-56">Ngày gửi</div>
          <div class="">
            {{ converDateToDDMMYYY(report.data.createdAt) }}
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="font-semibold w-56">Trạng thái</div>
          <div class="">
            {{ report.data.isSolved ? "Đã giải quyết" : "Chưa giải quyết" }}
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="font-semibold w-56">Hành động đã thực hiện</div>
          <div class="">
            <template v-for="action in actions.data" :key="action.id">
              <p class="font-semibold" v-if="action.actionReportDid">
                {{ action.actionName }}

                <button
                  v-if="action.actionReportDid"
                  class="ms-2"
                  @click="handleUndoAction(action.id)"
                >
                  <i
                    class="pi pi-undo text-13 text-green-600 font-semibold"
                  ></i>
                </button>
              </p>
            </template>
          </div>
        </div>

        <div class="flex items-start space-x-4" v-if="!report.data.isSolved">
          <div class="font-semibold w-56">Xử lý</div>
          <div class="">
            <template v-for="action in actions.data" :key="action.id">
              <button
                class="rounded-lg p-4 py-2 font-semibold text-13 mb-2 text-center"
                v-if="!action.actionReportDid"
                :class="
                  action.actionReportDid
                    ? 'bg-gray-200 text-dark'
                    : 'bg-primary text-white'
                "
                @click="handleCreateAction(action.id)"
              >
                {{ action.actionName }}
              </button>
              <br />
            </template>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-1/2">
        <div class="font-semibold mb-2">Nội dung</div>
        <div class="ms-2">{{ report.data.content }}</div>
        <template v-if="report.data.reportType == REPORT_TYPE.POST">
          <div class="border p-2 rounded-lg mt-4">
            <PostHeader
              :data="report.data.jsonDetails"
              :isSharePost="report.data.jsonDetails.sharePost"
            ></PostHeader>
            <PostContent :data="report.data.jsonDetails.content"></PostContent>
            <PostMedia
              :data="report.data.jsonDetails.postMedias"
              :postId="report.data.jsonDetails.id"
            ></PostMedia>
            <PostShare
              v-if="report.data.jsonDetails.sharePost"
              :post="report.data.jsonDetails.sharePost"
            ></PostShare>
          </div>
        </template>
        <template v-if="report.data.reportType == REPORT_TYPE.COMMENT">
          <div class="comment-item mt-4">
            <div class="user-avatar w-8 h-8">
              <img :src="report.data.jsonDetails.user.avatarUrl" alt="" />
            </div>
            <div class="main-comment">
              <div class="comment-content">
                <router-link
                  :to="{
                    name: 'profile',
                    params: {
                      id: report.data.jsonDetails.user.id,
                    },
                  }"
                  class="user-name"
                >
                  {{
                    report.data.jsonDetails.user.firstName +
                    " " +
                    report.data.jsonDetails.user.lastName
                  }}
                </router-link>
                <pre class="main-content">{{
                  report.data.jsonDetails.content
                }}</pre>
              </div>
              <div class="comment-info">
                <div class="day-ago">
                  {{
                    convertDateDisplay(
                      new Date(report.data.jsonDetails.createdAt)
                    )
                  }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="report.data.reportType == REPORT_TYPE.GROUP">
          <GroupDetails :id="report.data.jsonDetails.id"></GroupDetails>
        </template>
        <template v-if="report.data.reportType == REPORT_TYPE.USER">
          <ProfileView :id="report.data.jsonDetails.id"></ProfileView>
        </template>
      </div>
    </div>
  </div>
  <ModalConfirm
    :title="'Đánh dấu đã giải quyết'"
    :content="'Bạn có chắc chắn đánh dấu báo cáo này đã được giải quyết không? Mọi thao tác sẽ không thể hoàn tác.'"
    v-if="isShowConfim"
    @onClose="isShowConfim = false"
    @onSubmit="handleMarkProcessed"
  ></ModalConfirm>
</template>

<script>
import { toastAlert } from "@/utilities/toastAlert";
import { reportService } from "@/services/report.service";
import { onMounted, reactive, ref } from "vue";
import { converDateToDDMMYYY, convertDateDisplay } from "@/utilities/dateUtils";
import { REPORT_TYPE } from "@/constants";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const report = reactive({
      data: null,
    });

    const actions = reactive({
      data: null,
    });

    const isShowConfim = ref(false);

    onMounted(async () => {
      const res = await getReport(props.id);
      report.data = res.report;
      actions.data = res.action;
    });

    async function handleCreateAction(id) {
      const action = actions.data.find((x) => x.id == id);

      if (action) {
        try {
          const res = await reportService.createAction(props.id, id);
          action.actionReportDid = res.data;
          toastAlert.success("Thao tác thành công");
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi thực hiện hành động");
        }
      }
    }

    async function handleUndoAction(id) {
      const action = actions.data.find((x) => x.id == id);
      if (action) {
        try {
          await reportService.undoAction(props.id, action.actionReportDid.id);
          action.actionReportDid = null;
          toastAlert.success("Hoàn tác thành công");
        } catch (err) {
          console.error(err);
          toastAlert.error("Có lỗi khi hoàn tác");
        }
      }
    }

    async function handleMarkProcessed() {
      try {
        await reportService.markProcessed(props.id);
        report.data.isSolved = true;
        isShowConfim.value = false;
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi đánh dấu đã giải quyết");
      }
    }

    return {
      report,
      actions,
      REPORT_TYPE,
      isShowConfim,
      converDateToDDMMYYY,
      handleCreateAction,
      handleUndoAction,
      handleMarkProcessed,
      convertDateDisplay,
    };
  },
};

async function getReport(id) {
  try {
    const res = await reportService.getById(id);
    res.data.jsonDetails = JSON.parse(res.data.jsonDetails);
    console.log(res);

    const actionRes = await reportService.getAction(id);

    console.log(actionRes);

    return {
      report: res.data,
      action: actionRes.data,
    };
  } catch (err) {
    console.error(err);
    toastAlert.error("Có lỗi khi tải báo cáo");
  }
}
</script>

<style lang="scss" scoped>
.comment-item {
  @apply flex z-10;

  .user-avatar {
    @apply rounded-full overflow-hidden border border-gray-200 me-2;

    img {
      @apply w-full h-full object-cover;
    }
  }

  .main-comment {
    @apply flex-1;

    .comment-content {
      @apply relative;

      &::before {
        position: absolute;
        content: "";
        display: block;
        width: 20px;
        top: 0;
        bottom: 0;
        left: 100%;
      }

      @apply inline-flex flex-col bg-gray-100 rounded-xl py-1.5 px-3 pr-5 relative;

      .user-name {
        @apply text-13 font-semibold leading-15;
      }

      .main-content {
        @apply text-15 leading-18;
      }

      .comment-reaction-container {
        @apply absolute -bottom-0.5 left-85;

        .comment-reaction-list {
          @apply flex items-center bg-white rounded-full ps-0.5 shadow-md border border-gray-50;

          .comment-reaction-item {
            .reaction-img {
              @apply w-5 h-5  p-0.5 -ms-0.5;
            }
          }

          .comment-reaction-total {
            @apply leading-15 ms-0.5 pe-1 text-13 text-gray-500;
          }
        }
      }

      .comment-more-container {
        @apply absolute left-full ms-2 right-0 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 hover:bg-gray-100 flex items-center justify-center cursor-pointer z-50;

        .comment-more-icon {
          i {
            @apply text-13 text-gray-500;
          }
        }

        .comment-more-list {
          @apply absolute top-0 mt-10 bg-white p-2 rounded-lg shadow-custom-sm;

          .comment-more-item {
            @apply px-2 py-1 rounded-md text-15 font-semibold min-w-44 hover:bg-gray-100;
          }
        }
      }
    }

    .child-comment-list {
      @apply mt-1 space-y-2;

      .btn-show-child-comment {
        @apply font-semibold text-15 text-gray-500 cursor-pointer hover:underline;
      }
    }
  }
  .comment-info {
    @apply mt-0.5 flex space-x-2 ms-4 text-12 text-gray-500;

    .day-ago {
      @apply hover:underline cursor-pointer;
    }

    .reaction {
      @apply font-bold cursor-pointer relative;
    }

    .reply-comment {
      @apply font-bold hover:underline cursor-pointer;
    }
  }
}
</style>
