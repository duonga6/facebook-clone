<template>
  <div class="group-joined-container" v-scroll-bottom="scrolledToBottom">
    <div class="group-joined-header">
      {{ headerText }} ({{ groupData.total }})
    </div>
    <div class="group-joined-list">
      <div
        class="group-joined-item"
        v-for="group in groupData.data"
        :key="group.id"
      >
        <div class="group-item-info">
          <router-link
            :to="{
              name: 'group-details-post',
              params: {
                id: group.id,
              },
            }"
            class="group-item-image"
          >
            <img :src="group.coverImage" alt="" />
          </router-link>
          <div class="group-item-details">
            <router-link
              :to="{
                name: 'group-details-post',
                params: {
                  id: group.id,
                },
              }"
              class="group-item-name"
              >{{ group.name }}</router-link
            >
            <div class="group-item-status">
              <span>{{ group.isPublic ? "Công khai" : "Riêng tư" }}</span>
              <i class="group-item-split pi pi-circle-fill"></i>
              <span>{{ group.totalMember + " Thành viên" }}</span>
            </div>
            <div class="group-item-desc">
              {{ group.description }}
            </div>
          </div>
        </div>
        <div class="group-item-action">
          <router-link
            :to="{
              name: 'group-details-post',
              params: {
                id: group.id,
              },
            }"
            class="group-action-detail"
            >Xem nhóm</router-link
          >
          <button class="group-action-more">
            <i class="group-acion-icon pi pi-ellipsis-h"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { groupService } from "@/services/group.service";
import { GROUP_TYPE } from "@/constants";
import { toastAlert } from "@/utilities/toastAlert";
export default {
  props: {
    groupType: {
      type: Number,
      default: GROUP_TYPE.BOTH_JOINED_MANAGED,
    },
  },
  setup(props) {
    const route = useRoute();

    const headerText =
      props.groupType == GROUP_TYPE.MANAGE_BY_ME
        ? "Tất cả các nhóm bạn đang quản lý"
        : "Tất cả các nhóm bạn đã tham gia";

    const groupData = reactive({
      data: [],
      pageSize: 15,
      pageNumber: 0,
      total: 0,
      _isFetched: false,
    });

    function scrolledToBottom() {
      getGroupData(groupData, props.groupType);
    }

    onMounted(async () => {
      await getGroupData(groupData, props.groupType);
    });

    return {
      route,
      headerText,
      groupData,
      scrolledToBottom,
    };
  },
};

async function getGroupData(groupData, type) {
  if (
    !groupData._isFetched ||
    groupData.pageSize * groupData.pageNumber < groupData.total
  ) {
    try {
      const groupRes = await groupService.get({
        pageSize: groupData.pageSize,
        pageNumber: groupData.pageNumber + 1,
        type: type,
      });

      groupData.data = [...groupData.data, ...groupRes.data];
      groupData.total = groupRes.totalItems;
      groupData.pageNumber++;
      groupData._isFetched = true;
    } catch (err) {
      console.log(err);
      toastAlert.error("Có lỗi khi tải danh sách Group");
    }
  }
}
</script>

<style lang="scss" scoped>
.group-joined-container {
  @apply px-40 h-full overflow-y-auto;

  &::-webkit-scrollbar {
    @apply w-3 left-0;
  }

  &::-webkit-scrollbar-thumb {
    @apply rounded-lg bg-gray-300;
  }

  &::-webkit-scrollbar-track {
    @apply hidden;
  }

  .group-joined-header {
    @apply font-semibold text-17 py-3 px-2;
  }
  .group-joined-list {
    @apply grid grid-cols-3 gap-2;

    .group-joined-item {
      @apply p-4 bg-white rounded-lg border border-gray-200;

      .group-item-info {
        @apply flex;

        .group-item-image {
          @apply w-20 h-20 rounded-lg overflow-hidden border;

          img {
            @apply w-full h-full object-cover;
          }
        }

        .group-item-details {
          @apply flex-1 flex flex-col ms-2 justify-center;

          .group-item-name {
            @apply font-semibold text-15;
          }
          .group-item-status {
            @apply text-15 text-gray-700 flex items-center space-x-1 leading-18;

            .group-item-split {
              @apply text-gray-800;
              font-size: 3px;
            }
          }

          .group-item-desc {
            @apply text-13 leading-15 line-clamp-2;
          }
        }
      }

      .group-item-action {
        @apply mt-4 flex items-center gap-2;

        .group-action-detail {
          @apply flex items-center justify-center font-semibold text-15 text-primary bg-primary bg-opacity-10 h-9 rounded-lg flex-1 hover:bg-opacity-15 transition-all;
        }

        .group-action-more {
          @apply h-9 w-10 bg-gray-200 rounded-lg flex items-center justify-center;
        }
      }
    }
  }
}
</style>
