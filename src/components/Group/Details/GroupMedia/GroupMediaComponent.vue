<template>
  <div class="group-media-container" v-scroll-bottom-window="onScrollToBottom">
    <div class="group-media-heading">File phương tiện</div>
    <div class="group-media-list">
      <router-link
        :to="{
          name: 'post-detail',
          params: {
            id: media.postId,
          },
          query: {
            mediaId: media.id,
          },
        }"
        class="group-media-item"
        v-for="media in groupMediaData.data"
        :key="media.id"
      >
        <img v-if="media.mediaTypeId == 2" :src="media.url" alt="" />
        <video v-if="media.mediaTypeId == 3" :src="media.url"></video>
      </router-link>
    </div>
    <div
      class="group-media-empty"
      v-if="groupMediaData?.total == 0 && groupMediaData?.isFetched"
    >
      Chưa có file phương tiện nào
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { toastAlert } from "@/utilities/toastAlert";
export default {
  setup() {
    const store = useStore();

    const groupMediaData = computed(() => store.getters["group/getMediaState"]);

    async function onScrollToBottom() {
      if (groupMediaData.value) {
        if (
          groupMediaData.value.pageSize * groupMediaData.value.pageNumber <
          groupMediaData.value.total
        ) {
          try {
            await store.dispatch("group/getMedia");
          } catch (error) {
            console.error(error);
            toastAlert.error("Có lỗi khi tải file phương tiện");
          }
        }
      }
    }

    return {
      groupMediaData,
      onScrollToBottom,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-media-container {
  width: 1250px;

  @apply mx-auto border rounded-lg bg-white p-4;

  .group-media-heading {
    @apply font-bold text-lg;
  }

  .group-media-list {
    @apply grid grid-cols-6 gap-4 mt-4;

    .group-media-item {
      @apply col-span-1 rounded-lg overflow-hidden;

      img,
      video {
        @apply w-full h-full object-cover aspect-square;
      }
    }
  }
  .group-media-empty {
    @apply bg-white text-center text-15 font-semibold;
  }
}
</style>
