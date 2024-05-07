<template>
  <div class="group-create-post-container">
    <div class="create-post-main">
      <div class="user-avatar">
        <img :src="user.avatarUrl" alt="" />
      </div>
      <input
        readonly
        class="create-post-input"
        type="text"
        placeholder="Bạn viết gì đi..."
        @click="isShowCreatePost = true"
      />
    </div>
    <hr />
    <div class="create-post-options">
      <div class="post-option-item">
        <div class="post-option-icon">
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yf/r/ssTo4r5Wdqv.png?_nc_eui2=AeEr3iBP1Lp3lzy5ZECp_Nh55v3gJTwOaYHm_eAlPA5pgSVakC4jNanGGkIDpo3fctiNyTNvYHNusFv1SbsDqHtq"
            alt=""
          />
        </div>
        <div class="post-option-text" @click="isShowCreatePost = true">
          Bài viết ẩn danh
        </div>
      </div>
      <div class="post-option-item">
        <div class="post-option-icon">
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeHiOb2walsELzNmiIvTVE6WPL4YoeGsw5I8vhih4azDkiXTBIXsRGzgyEzQwR5FJ4H7A3rfvpb_p5SqhmStK7mf"
            alt=""
          />
        </div>
        <div class="post-option-text" @click="isShowCreatePost = true">
          Ảnh/Video
        </div>
      </div>
    </div>
  </div>
  <PostEditor
    v-if="isShowCreatePost"
    @closePostEditor="isShowCreatePost = false"
    @submittedForm="onSubmitPost"
  ></PostEditor>
</template>

<script>
import tokenService from "@/services/token.service";
import { ref } from "vue";
import { POST_EDITOR_TYPE } from "@/constants";
import { useStore } from "vuex";
export default {
  setup() {
    const user = tokenService.getUser();
    const store = useStore();
    const isShowCreatePost = ref(false);

    async function onSubmitPost(payLoad) {
      await store.dispatch("groupPost/createPost", payLoad.data).then(() => {
        isShowCreatePost.value = false;
      });
    }

    return {
      user,
      isShowCreatePost,
      POST_EDITOR_TYPE,
      onSubmitPost,
    };
  },
};
</script>

<style lang="scss" scoped>
.group-create-post-container {
  @apply px-4 pt-3 pb-2 bg-white rounded-lg border border-gray-50;

  .create-post-main {
    @apply flex items-center mb-4;

    .user-avatar {
      @apply w-10 h-10 rounded-full overflow-hidden;

      img {
        @apply w-full h-full object-cover;
      }
    }
    .create-post-input {
      @apply flex-1 outline-none border-none rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-17 placeholder:text-gray-500 ms-2 py-2 ps-4 cursor-pointer;
    }
  }
  .create-post-options {
    @apply flex items-center mt-2;

    .post-option-item {
      @apply flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer;

      .post-option-icon {
      }

      .post-option-text {
        @apply text-gray-600 font-semibold;
      }
    }
  }
}
</style>
