<template>
  <div class="add-post">
    <div class="add-post__top-section">
      <div class="top-section__user-img">
        <img
          src="https://cand.com.vn/Files/Image/daudung/2017/07/14/thumb_660_bfc91729-e563-4696-ba5b-71f1364d403a.png"
          alt=""
        />
      </div>
      <div class="top-section__input" @click="handleOpenCreatePost">
        {{ user?.lastName }} ơi, bạn đang nghĩ gì thể?
      </div>
    </div>
    <hr class="mt-3" />
    <div class="add-post__bottom-section">
      <div class="bottom-section__type-post-list">
        <div class="type-post-item" @click="handleOpenCreatePost">
          <div class="type-post__img">
            <img
              height="24"
              width="24"
              alt=""
              class="xz74otr"
              referrerpolicy="origin-when-cross-origin"
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeEEpubiubg8wBpryItUxUPyVnUPE18ZZ-dWdQ8TXxln5yPcETCQgPF7XlpGIi-i9EfIOjAbpVVyRhI5eVbdrtUz"
            />
          </div>
          <div class="type-post__text">Video trực tiếp</div>
        </div>
        <div class="type-post-item" @click="handleOpenCreatePost">
          <div class="type-post__img">
            <img
              height="24"
              width="24"
              alt=""
              class="xz74otr"
              referrerpolicy="origin-when-cross-origin"
              src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeHiOb2walsELzNmiIvTVE6WPL4YoeGsw5I8vhih4azDkiXTBIXsRGzgyEzQwR5FJ4H7A3rfvpb_p5SqhmStK7mf"
            />
          </div>
          <div class="type-post__text">Ảnh/video</div>
        </div>
        <div class="type-post-item" @click="handleOpenCreatePost">
          <div class="type-post__img">
            <img
              height="24"
              width="24"
              alt=""
              class="xz74otr"
              referrerpolicy="origin-when-cross-origin"
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHWXCnwisQ8ILfV-PmweUTivPIN-OmHLJy88g346YcsnFLgec4vNEAEUDT0dQcgBGYPYxwLVuNCOcF57wAm7r-j"
            />
          </div>
          <div class="type-post__text">Cảm xúc hoạt động</div>
        </div>
      </div>
    </div>
  </div>

  <PostEditor
    v-if="isShowCreatePost"
    @closePostEditor="onCloseCreatePost"
    @submittedForm="onSubmittedForm"
  ></PostEditor>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    type: {
      type: String,
      default: "Create",
    },
  },
  setup() {
    const store = useStore();

    const isShowCreatePost = ref(false);

    function handleOpenCreatePost() {
      isShowCreatePost.value = true;
    }

    function onCloseCreatePost() {
      isShowCreatePost.value = false;
    }

    async function onSubmittedForm(payLoad) {
      await store.dispatch("homePost/createPost", payLoad.data).then(() => {
        isShowCreatePost.value = false;
      });
    }

    return {
      user: computed(() => store.getters["user/getUser"]),
      isShowCreatePost,
      handleOpenCreatePost,
      onCloseCreatePost,
      onSubmittedForm,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-post {
  @apply flex flex-col bg-white rounded-lg p-3 mt-6 border border-gray-200 shadow-sm;
  .add-post__top-section {
    @apply flex px-1;
    .top-section__user-img {
      @apply w-10 h-10 rounded-full overflow-hidden;
      img {
        @apply w-full h-full object-cover;
      }
    }
    .top-section__input {
      @apply ms-2 flex-1 bg-gray-100 rounded-full py-2 px-3 text-17 text-gray-500 cursor-pointer hover:bg-gray-200 transition-all;
    }
  }

  .add-post__bottom-section {
    @apply mt-2;
    .bottom-section__type-post-list {
      @apply flex items-center justify-center;
      .type-post-item {
        @apply flex-1 flex space-x-2 items-center justify-center px-1 py-1.5  rounded-lg hover:bg-gray-100 transition-all cursor-pointer;
        .type-post__img {
          @apply w-6 h-6;
          img {
            @apply w-full h-full;
          }
        }
        .type-post__text {
          @apply font-semibold text-gray-500 text-15;
        }
      }
    }
  }
}
</style>
