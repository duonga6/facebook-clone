<template>
  <!-- Header -->
  <div class="relative bg-primary md:pt-32 pb-32 pt-12">
    <div class="px-4 md:px-10 mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              v-if="userStats.data"
              statSubtitle="Người dùng"
              :statTitle="userStats.data.totalUser"
              statArrow="up"
              :statPercent="userStats.data.activingUser"
              statPercentColor="text-emerald-500"
              statDescripiron="Đang hoạt động"
              statIconName="far fa-chart-bar"
              statIconColor="bg-primary"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              v-if="postStats.data"
              statSubtitle="Bài viết"
              :statTitle="postStats.data.totalPost"
              statArrow="down"
              :statPercent="postStats.data.postPerDay"
              statPercentColor="text-red-500"
              statDescripiron="Bài viết hôm nay"
              statIconName="fas fa-chart-pie"
              statIconColor="bg-orange-500"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              v-if="groupStats.data"
              statSubtitle="Nhóm"
              :statTitle="groupStats.data.totalGroup"
              statArrow="up"
              :statPercent="groupStats.data.publicGroup"
              statPercentColor="text-orange-500"
              statDescripiron="Nhóm công khai"
              statIconName="fas fa-users"
              statIconColor="bg-pink-500"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              v-if="commentStats.data"
              statSubtitle="Bình luận"
              :statTitle="commentStats.data.totalComment"
              statArrow="up"
              statPercentColor="text-emerald-500"
              statIconName="fas fa-percent"
              statIconColor="bg-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardStats from "@/components/Admin/Cards/CardStats.vue";
import { onMounted, reactive } from "vue";
import { toastAlert } from "@/utilities/toastAlert";
import { userService } from "@/services/user.service";
import { groupService } from "@/services/group.service";
import { postService } from "@/services/post.service";
import { postCommentService } from "@/services/post-comment.service";

export default {
  components: {
    CardStats,
  },
  setup() {
    const userStats = reactive({
      data: null,
    });
    const groupStats = reactive({
      data: null,
    });
    const commentStats = reactive({
      data: null,
    });
    const postStats = reactive({
      data: null,
    });

    onMounted(async () => {
      await getUserStat(userStats);
      await getGroupStat(groupStats);
      await getPostStat(postStats);
      await getCommentStat(commentStats);
    });

    return {
      userStats,
      groupStats,
      commentStats,
      postStats,
    };
  },
};

async function getUserStat(data) {
  try {
    const res = await userService.getStats();
    data.data = res.data;
  } catch (err) {
    console.error(err);
    toastAlert.error("Có lỗi khi lấy dữ liệu User");
  }
}

async function getGroupStat(data) {
  try {
    const res = await groupService.getStats();
    data.data = res.data;
  } catch (err) {
    console.error(err);
    toastAlert.error("Có lỗi khi lấy dữ liệu User");
  }
}

async function getPostStat(data) {
  try {
    const res = await postService.getStats();
    data.data = res.data;
  } catch (err) {
    console.error(err);
    toastAlert.error("Có lỗi khi lấy dữ liệu User");
  }
}

async function getCommentStat(data) {
  try {
    const res = await postCommentService.getStats();
    data.data = res.data;
  } catch (err) {
    console.error(err);
    toastAlert.error("Có lỗi khi lấy dữ liệu User");
  }
}
</script>
