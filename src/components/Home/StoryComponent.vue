<template>
  <div style="width: 680px">
    <ul class="story-list">
      <li>
        <div class="story-item">
          <div class="story-img">
            <img :src="user?.avatarUrl" alt="" />
          </div>
          <div class="add-story-container">
            <p class="add-story-text">Tạo tin</p>
            <div class="add-story-btn">
              <svg
                viewBox="0 0 20 20"
                width="20"
                height="20"
                fill="currentColor"
                class="text-white"
              >
                <g fill-rule="evenodd" transform="translate(-446 -350)">
                  <g fill-rule="nonzero">
                    <path
                      d="M95 201.5h13a1 1 0 1 0 0-2H95a1 1 0 1 0 0 2z"
                      transform="translate(354.5 159.5)"
                    ></path>
                    <path
                      d="M102.5 207v-13a1 1 0 1 0-2 0v13a1 1 0 1 0 2 0z"
                      transform="translate(354.5 159.5)"
                    ></path>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="story-item">
          <div class="story-img">
            <img
              src="https://cand.com.vn/Files/Image/daudung/2017/07/14/thumb_660_bfc91729-e563-4696-ba5b-71f1364d403a.png"
              alt=""
            />
          </div>
          <div class="story-owner-img">
            <img
              class="w-full h-full object-contain"
              :src="user?.avatarUrl"
              alt=""
            />
          </div>
          <div class="story-owner-name">Phạm Dương</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();

    return {
      user: computed(() => store.getters["user/getUser"]),
    };
  },
};
</script>

<style lang="scss" scoped>
.story-list {
  @apply flex mt-6 space-x-2 w-full scroll-smooth;

  ::-webkit-scrollbar {
    display: none;
  }

  .story-item {
    @apply flex w-36 h-62 rounded-lg shadow-md relative cursor-pointer;

    &::after {
      @apply absolute top-0 bottom-0 right-0 left-0 rounded-lg shadow-xl block;
      content: "";
    }

    .story-img {
      @apply rounded-lg overflow-hidden;

      img {
        @apply w-full h-full object-cover transition-all;
      }

      &::before {
        @apply absolute top-0 bottom-0 left-0 right-0 rounded-lg bg-black opacity-0 invisible z-10 transition-all;
        content: "";
      }
    }

    .story-owner-img {
      @apply w-10 h-10 rounded-full overflow-hidden absolute top-2.5 left-2.5 border-4 border-primary;
    }

    .story-owner-name {
      @apply absolute bottom-2 left-3 text-white font-bold text-13;
    }

    .add-story-container {
      @apply absolute bottom-0 left-0 right-0 pb-2 pt-6 bg-white rounded-br-md rounded-bl-md;

      .add-story-text {
        @apply text-center mb-0 text-13 font-semibold text-dark;
      }

      .add-story-btn {
        @apply absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary border-4 border-sky-50 flex justify-center items-center;
      }
    }

    &:hover {
      .story-img {
        img {
          transform: scale(1.02);
        }

        &::before {
          @apply opacity-10 visible;
        }
      }
    }
  }
}
</style>
