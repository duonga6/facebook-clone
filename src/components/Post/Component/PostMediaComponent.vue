<template>
  <div class="post-media">
    <div
      class="post-media-list grid gap-1"
      :class="generateClassMedias(mediaShow.length)"
    >
      <router-link
        :to="{
          name: 'post-detail',
          params: {
            id: postId,
          },
          query: {
            mediaId: media.id,
          },
        }"
        class="post-media-item"
        v-for="(media, index) in mediaShow"
        :key="media.id"
        :class="generateClassMedias(mediaShow.length, index)"
      >
        <template v-if="media.mediaTypeId == 2">
          <img class="image" :src="media.url" alt="" />
        </template>
        <template v-else-if="media.mediaTypeId == 3">
          <video class="video" :src="media.url" controls></video>
        </template>
        <div class="more-media" v-if="data.length > 4 && index == 3">
          <i class="more-media-icon pi pi-plus"></i>
          <span class="more-media-text">{{ data.length - 4 }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    postId: {
      type: String,
    },
  },
  setup(props) {
    const mediaShow = computed(() => props.data.slice(0, 4));

    function generateClassMedias(totalItems, index = null) {
      if (index == null) {
        return `grid-cols-2`;
      }

      if (totalItems % 2 == 1 && index == 0) {
        return "col-span-2";
      }

      return "col-span-1";
    }

    return {
      mediaShow,
      generateClassMedias,
    };
  },
};
</script>

<style lang="scss" scoped>
.post-media {
  .post-media-list {
    .post-media-item {
      @apply relative aspect-square;

      .image {
        @apply w-full h-full object-cover cursor-pointer;
      }

      .video {
        @apply w-full h-full object-cover;
      }

      .more-media {
        @apply absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center space-x-1 bg-black bg-opacity-50;
        .more-media-icon {
          @apply text-md font-bold text-white mt-1;
        }

        .more-media-text {
          @apply text-3xl font-semibold text-white;
        }
      }
    }
  }
}
</style>
