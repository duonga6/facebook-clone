<template>
  <div class="group-search-container" v-scroll-bottom="onScrollToBottom">
    <div class="group-search-list">
      <div
        class="group-search-item"
        v-for="group in groupData.data"
        :key="group.id"
      >
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
        <div class="group-item-info">
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
            <span class="group-item-type">{{
              group.isPublic ? "Công khai" : "Riêng tư"
            }}</span>
            <i class="group-status-split pi pi-circle-fill"></i>
            <span class="group-member">{{ group.totalMember }} thành viên</span>
          </div>
          <div class="group-item-desc">
            {{ group.description }}
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
            class="group-action-btn btn--access"
            v-if="group.currentMember"
          >
            Truy cập
          </router-link>
          <button
            class="group-action-btn btn--access"
            v-else-if="
              group.currentInvite && !group.currentInvite.adminAccepted
            "
            @click="handleCancelRequestJoin(group.id)"
          >
            Đang chờ
          </button>
          <button
            class="group-action-btn btn--join"
            v-else
            @click="handleSendRequestJoin(group.id)"
          >
            Tham gia
          </button>
        </div>
      </div>
    </div>
    <div
      class="search-result-empty"
      v-if="groupData._isFetched && !groupData.total"
    >
      Không tìm thấy kết quả cho từ khóa "{{ searchString }}"
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { toastAlert } from "@/utilities/toastAlert";
import { groupService } from "@/services/group.service";
import { GROUP_TYPE } from "@/constants";
import { groupInviteService } from "@/services/group-invite.service";
import { grMemberService } from "@/services/group-member.service";
import tokenService from "@/services/token.service";

export default {
  setup() {
    const route = useRoute();
    const searchString = route.query.s;

    const groupData = reactive({
      pageSize: 10,
      pageNumber: 0,
      data: [],
      total: 0,
      _isFetched: false,
    });

    async function onScrollToBottom() {
      await getGroupData(groupData, searchString);
    }

    async function handleSendRequestJoin(groupId) {
      try {
        const res = await groupInviteService.create({
          groupId: groupId,
        });

        const group = groupData.data.find((x) => x.id == groupId);

        switch (res.message.substring(0, 4)) {
          case "GA01":
            group.currentInvite = res.data;
            break;
          case "GA02":
            group.currentMember = true;
            break;
          case "GF01":
            toastAlert.error("Bạn đã gửi yêu cầu tham gia rồi");
            break;
          case "GF03":
            toastAlert.error("Bạn đã tham gia nhóm này rồi");
            break;
        }
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi gửi yêu cầu tham gia");
      }
    }

    async function handleCancelRequestJoin(groupId) {
      try {
        await groupInviteService.deleteByGroupId(groupId);

        const group = groupData.data.find((x) => x.id == groupId);
        group.currentInvite = null;
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi hủy yêu cầu");
      }
    }

    onMounted(async () => {
      await getGroupData(groupData, searchString);
    });

    return {
      groupData,
      searchString,
      onScrollToBottom,
      handleSendRequestJoin,
      handleCancelRequestJoin,
    };
  },
};

async function getGroupData(groupData, searchString) {
  if (
    !groupData._isFetched ||
    (groupData.pageNumber != 0 &&
      groupData.pageSize * groupData.pageNumber < groupData.total)
  )
    try {
      const res = await groupService.get({
        pageSize: groupData.pageSize,
        pageNumber: groupData.pageNumber + 1,
        type: GROUP_TYPE.ALL,
        searchString,
      });

      const userId = tokenService.getUser().id;

      const groupResMapped = await Promise.all(
        res.data.map(async (item) => {
          try {
            const currentMemberRes = await grMemberService.getByGrIdAndUserId(
              item.id,
              userId
            );
            item.currentMember = currentMemberRes.data;
          } catch (err) {
            if (err.status != 404) {
              console.error(err);
              toastAlert.error("Có lỗi khi tải trạng thái member");
            }

            item.currentMember = null;
          }

          try {
            const currentInviteRes = await groupInviteService.getByUIDandGrID(
              item.id,
              userId
            );
            item.currentInvite = currentInviteRes.data;
          } catch (err) {
            if (err.status != 404) {
              console.error(err);
              toastAlert.error("Có lỗi khi tải trạng thái member");
            }

            item.currentInvite = null;
          }

          return item;
        })
      );

      console.log(groupResMapped);

      groupData.total = res.totalItems;
      groupData._isFetched = true;
      groupData.data = [...groupData.data, ...groupResMapped];
      groupData.pageNumber++;
    } catch (err) {
      console.error(err);
      toastAlert.error("Có lỗi khi tải dữ liệu nhóm");
    }
}
</script>

<style lang="scss" scoped>
.group-search-container {
  @apply pt-8 h-full overflow-y-auto;

  &::-webkit-scrollbar {
    @apply w-2;
  }

  &::-webkit-scrollbar-thumb {
    @apply rounded-lg bg-gray-300;
  }

  &::-webkit-scrollbar-track {
    @apply hidden;
  }

  .group-search-list {
    max-width: 680px;
    @apply mx-auto flex flex-col space-y-4;

    .group-search-item {
      @apply bg-white rounded-lg px-4 py-3 flex items-center border;

      .group-item-image {
        @apply w-15 h-15 min-w-16 min-h-16 rounded-lg overflow-hidden;

        img {
          @apply w-full h-full object-cover;
        }
      }

      .group-item-info {
        @apply ms-3 flex-1;

        .group-item-name {
          @apply text-17 font-semibold leading-5;
        }

        .group-item-status {
          @apply flex items-center space-x-1 text-15 text-gray-700 leading-18;

          .group-status-split {
            font-size: 2px;
          }
        }
        .group-item-desc {
          @apply text-13 text-gray-700 leading-4 line-clamp-2;
        }
      }

      .group-item-action {
        @apply ms-4 text-right;

        .group-action-btn {
          &.btn--join {
            @apply bg-primary text-primary bg-opacity-5 hover:bg-opacity-10;
          }
          &.btn--access {
            @apply bg-dark bg-opacity-5 hover:bg-opacity-10;
          }

          @apply px-3 py-2 rounded-lg font-semibold text-15 transition-all;
        }
      }
    }
  }

  .search-result-empty {
    @apply text-center font-semibold text-15;
  }
}
</style>
