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
        <div class="type-post-item" @click="handleOpenAddPostForm">
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
        <div class="type-post-item" @click="handleOpenAddPostForm">
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
        <div class="type-post-item" @click="handleOpenAddPostForm">
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
  <!-- <div
    class="add-post__form"
    :class="isShowCreatePost ? 'visible opacity-100' : 'invisible opacity-0'"
  >
    <form class="form-container" @submit.prevent="handleSubmitAddForm">
      <div class="form-heading">
        <p class="form-heading__title">Tạo bài viết</p>
        <div
          class="form-heading__icon-container"
          @click="handleCloseAddPostForm"
        >
          <i
            class="form-heading__icon"
            data-visualcompletion="css-img"
            style="
              background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/W36oMOXK6VG.png?_nc_eui2=AeEWr61o6UQDE05Ob-mQ3ShLE0nt2lFbHYITSe3aUVsdgvQSWYvHM2Mz8oUt7oAVbrNuSZ4PXI9cL02hX3pApnt1');
              background-position: -147px -84px;
              background-size: auto;
              background-repeat: no-repeat;
            "
          ></i>
        </div>
      </div>
      <hr />
      <div class="user-info-container">
        <div class="avatar-container">
          <img class="avatar-img" :src="user?.avatarUrl" alt="" />
        </div>
        <div class="user-info">
          <p class="user-info__name">
            {{ user?.firstName + " " + user?.lastName }}
          </p>
          <drop-down
            v-model="selectedAccessRange"
            :options="dataAccessRange"
            optionLabel="name"
            :pt="{
              root: 'px-2 py-0.5 inline-flex items-center relative rounded-md cursor-pointer rounded-md bg-gray-200',
              input: 'p-0 text-13 font-semibold',
              trigger:
                'flex items-center justify-center shrink-0 text-surface-500 rounded-tr-md rounded-br-md ms-1 mt-1',
            }"
          >
          </drop-down>
        </div>
      </div>
      <div class="post-content">
        <textarea
          class="post-content__text"
          :placeholder="`${user?.lastName} ơi, bạn đang nghĩ gì thế?`"
          v-model="postData.content"
        />
      </div>
      <div class="post-media-container" v-if="postData.postMedias.length > 0">
        <ul
          class="post-media-list grid gap-1"
          :class="generateClassMedias(postData.postMedias.length)"
        >
          <li
            v-for="(image, index) in postData.postMedias"
            :key="index"
            class="post-media-item"
            :class="generateClassMedias(postData.postMedias.length, index)"
          >
            <div class="post-media-type">
              <template v-if="image.type == 'image'">
                <img class="image" :src="image.showUrl" alt="" />
              </template>
              <template v-else>
                <video class="video" :src="image.showUrl" controls></video>
              </template>
              <div class="upload-image uploading" v-if="image.uploading">
                <loading-component :classCss="'w-10 h-10'"></loading-component>
              </div>
              <div
                class="upload-image upload-fail"
                v-if="!image.uploading && !image.uploaded"
              >
                <i class="upload-fail-icon pi pi-exclamation-triangle"></i>
              </div>
              <button
                class="remove-uploaded-image"
                @click="deleteUploadedImage(image.id)"
              >
                <i class="pi pi-times remove-icon"></i>
              </button>
            </div>
          </li>
        </ul>
      </div>
      <drag-file @DragedFile="onDragedFile"></drag-file>

      Additional for post

      <div class="additional-container">
        <p class="additional-text">Thêm vào bài viết của bạn</p>
        <ul class="additional-list">
          <li>
            <div class="additional-item">
              <img
                class="additional-item__img"
                src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeHiOb2walsELzNmiIvTVE6WPL4YoeGsw5I8vhih4azDkiXTBIXsRGzgyEzQwR5FJ4H7A3rfvpb_p5SqhmStK7mf"
                alt=""
              />
            </div>
          </li>
          <li>
            <div class="additional-item">
              <img
                class="additional-item__img"
                src="https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/b37mHA1PjfK.png?_nc_eui2=AeHjtBDQ5D8hPuN0zwPAG1TwohqwRjkkxMOiGrBGOSTEw5_kDePWZwXdQgWiraOKQRI1ScaUYVfZlRPNLTeGsayj"
                alt=""
              />
            </div>
          </li>
          <li>
            <div class="additional-item">
              <img
                class="additional-item__img"
                src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHWXCnwisQ8ILfV-PmweUTivPIN-OmHLJy88g346YcsnFLgec4vNEAEUDT0dQcgBGYPYxwLVuNCOcF57wAm7r-j"
                alt=""
              />
            </div>
          </li>
          <li>
            <div class="additional-item">
              <img
                class="additional-item__img"
                src="https://static.xx.fbcdn.net/rsrc.php/v3/y1/r/8zlaieBcZ72.png?_nc_eui2=AeFJhV5xsU5h9xpbGLBUjqP_88Ps36vvyGDzw-zfq-_IYLeH_VlwZ1_kY7vyFx3DLJC_LKqGDvHMJpN9lSJhlGjO"
                alt=""
              />
            </div>
          </li>
          <li>
            <div class="additional-item">
              <img
                class="additional-item__img"
                src="https://static.xx.fbcdn.net/rsrc.php/v3/yT/r/q7MiRkL7MLC.png?_nc_eui2=AeHFoxOAcdIpT_tHJd8e69uKJTqz5hgP3TklOrPmGA_dOSX7t3MUg1G_3ZWa3572gbyRtmvhe3_5_ES8YXapAGdr"
                alt=""
              />
            </div>
          </li>
        </ul>
      </div>
      <div class="add-post-btn p-4">
        <button
          class="w-full rounded-lg p-2 font-semibold transition-all"
          :class="
            isCanPost ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
          "
          :disabled="!isCanPost"
        >
          Đăng
        </button>
      </div>
    </form>
  </div> -->
  <!-- <post-editor></post-editor> -->
  <post-editor
    v-if="isShowCreatePost"
    @closePostEditor="onCloseCreatePost"
    @submittedForm="onSubmittedForm"
  ></post-editor>
</template>

<script>
/* eslint-disable */
import { computed, ref } from "vue";
import { useStore } from "vuex";
import DragFile from "../Utils/DragFileComponent.vue";
import LoadingComponent from "../Utils/LoadingComponent.vue";
import PostEditor from "@/components/Post/PostEditorComponent.vue";

export default {
  components: { DragFile, LoadingComponent, PostEditor },
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

    function onSubmittedForm(postData) {
      const postMediaFilter = [...postData.postMedias]
        .filter((x) => x.uploaded)
        .map((x) => {
          return {
            title: x.title,
            mediaTypeId: x.mediaTypeId,
            url: x.url,
          };
        });

      store
        .dispatch("homePost/createPost", {
          content: postData.content,
          postMedias: postMediaFilter,
        })
        .then(() => {
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
