<template>
  <div class="gallery-container">
    <div class="gallery-navbar">
      <div class="right-navbar">
        <div class="navbar-item" @click="handleClosePost">
          <i class="pi pi-times"></i>
        </div>
      </div>
      <div class="left-navbar">
        <div class="navbar-item">
          <i class="pi pi-search-plus"></i>
        </div>
        <div class="navbar-item">
          <i class="pi pi-search-minus"></i>
        </div>
        <div class="navbar-item">
          <i class="pi pi-window-maximize"></i>
        </div>
      </div>
    </div>
    <div class="gallery-main">
      <button
        v-if="data.length > 1"
        class="gallery-control-btn btn--left"
        @click.stop="handlePrevMedia"
      >
        <i class="pi pi-chevron-left"></i>
      </button>
      <div class="media-list">
        <div class="media-item">
          <img
            v-if="mediaShow.mediaTypeId == 2"
            class="media-src image"
            :src="mediaShow.url"
            alt=""
          />
          <video
            v-if="mediaShow.mediaTypeId == 3"
            class="media-src video"
            :src="mediaShow.url"
            alt=""
            controls
          />
        </div>
      </div>
      <button
        v-if="data.length > 1"
        class="gallery-control-btn btn--right"
        @click.stop="handleNextMedia"
      >
        <i class="pi pi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  props: {
    data: {
      type: Array,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const mediaIndex = ref(0);

    if (route.query.mediaId) {
      const mediaIdSeleted = props.data.find(
        (x) => x.id == route.query.mediaId
      );
      if (mediaIdSeleted) {
        mediaIndex.value = props.data.findIndex(
          (x) => x["id"] == mediaIdSeleted.id
        );
      }
    }

    function handlePrevMedia() {
      if (props.data.length == 0) {
        return;
      }

      if (mediaIndex.value <= 0) {
        mediaIndex.value = props.data.length - 1;
      } else {
        mediaIndex.value--;
      }
    }

    function handleNextMedia() {
      if (props.data.length == 0) {
        return;
      }

      if (mediaIndex.value >= props.data.length - 1) {
        mediaIndex.value = 0;
      } else {
        mediaIndex.value++;
      }
    }

    function handleClosePost() {
      if (window.history.length <= 1) {
        router.push({
          name: "home",
        });
      } else {
        router.back();
      }
    }

    return {
      mediaShow: computed(() => props.data[mediaIndex.value]),
      handlePrevMedia,
      handleNextMedia,
      handleClosePost,
    };
  },
};
</script>

<style lang="scss" scoped>
.gallery-container {
  @apply h-full bg-black relative;

  .gallery-navbar {
    @apply flex justify-between absolute top-0 left-0 right-0 m-2 z-10;

    .right-navbar {
      @apply flex space-x-2;
    }

    .left-navbar {
      @apply flex space-x-2;
    }

    .navbar-item {
      @apply w-10 h-10 flex items-center justify-center cursor-pointer;

      i {
        @apply text-xl text-white;
      }
    }
  }

  .gallery-main {
    @apply relative h-full;

    .gallery-control-btn {
      @apply absolute top-1/2 -translate-y-1/2 
      w-10 h-20 rounded-lg 
      flex items-center justify-center 
      text-2xl text-gray-100
      hover:bg-white hover:bg-opacity-30 transition-all;

      &.btn--left {
        @apply left-10;
      }

      &.btn--right {
        @apply right-10;
      }
    }

    .media-list {
      @apply h-full;
      .media-item {
        @apply flex items-center justify-center h-full;
        .media-src {
          @apply h-full max-h-full object-contain;
        }
      }
    }
  }
}
</style>
