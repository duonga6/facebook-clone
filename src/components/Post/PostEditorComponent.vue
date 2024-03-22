<template>
  <div class="add-post__form">
    <form class="form-container" @submit.prevent="handleSubmitForm">
      <div class="form-heading">
        <p class="form-heading__title">Tạo bài viết</p>
        <div
          class="form-heading__icon-container"
          @click="handleCloseCreatePost"
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
      <template v-if="action == POST_EDITOR_TYPE.SHARE">
        <div class="post-content">
          <textarea
            class="post-content__text"
            :placeholder="`${user?.lastName} ơi, bạn đang nghĩ gì thế?`"
            v-model="postData.content"
          />
        </div>
        <PostShare :post="data"></PostShare>
      </template>
      <template v-else>
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
                <template v-if="image.mediaTypeId == 2">
                  <img class="image" :src="image.showUrl" alt="" />
                </template>
                <template v-else>
                  <video class="video" :src="image.showUrl" controls></video>
                </template>
                <div class="upload-image uploading" v-if="image.uploading">
                  <loading-component
                    :classCss="'w-10 h-10'"
                  ></loading-component>
                </div>
                <div
                  class="upload-image upload-fail"
                  v-if="!image.uploading && !image.uploaded"
                >
                  <i class="upload-fail-icon pi pi-exclamation-triangle"></i>
                </div>
                <span
                  class="remove-uploaded-image"
                  @click="deleteUploadedImage(image.id)"
                >
                  <i class="pi pi-times remove-icon"></i>
                </span>
              </div>
            </li>
          </ul>
        </div>
        <drag-file @DragedFile="onDragedFile"></drag-file>
      </template>
      <div class="add-post-btn p-4">
        <button
          class="w-full rounded-lg p-2 font-semibold transition-all"
          :class="
            isCanPost ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
          "
          :disabled="!isCanPost"
        >
          <span v-if="action == POST_EDITOR_TYPE.CREATE"> Đăng </span>
          <span v-if="action == POST_EDITOR_TYPE.UPDATE"> Lưu </span>
          <span v-if="action == POST_EDITOR_TYPE.SHARE"> Chia sẻ </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import DragFile from "../Utils/DragFileComponent.vue";
import LoadingComponent from "../Utils/LoadingComponent.vue";
import { uploadFileService } from "@/services/upload-file.service";
import { generateUUID } from "@/utilities";
import tokenService from "@/services/token.service";
import { POST_EDITOR_TYPE } from "@/constants";
export default {
  components: { DragFile, LoadingComponent },
  props: {
    data: {
      type: Object,
    },
    action: {
      type: Number,
      default: POST_EDITOR_TYPE.CREATE,
    },
  },
  emits: ["closePostEditor", "submittedForm"],
  setup(props, { emit }) {
    const user = tokenService.getUser();
    const postEditorType = { ...props }.action;

    const postData = reactive({
      content: null,
      postMedias: [],
      sharePostId: null,
      sharePostData: null,
    });

    switch (postEditorType) {
      case POST_EDITOR_TYPE.UPDATE:
        postData.content = { ...props.data }.content;
        postData.postMedias = props.data.postMedias.map((item) => {
          return {
            ...item,
            uploading: false,
            uploaded: true,
            showUrl: item.url,
          };
        });
        break;
      case POST_EDITOR_TYPE.SHARE:
        postData.sharePostId = { ...props.data }.id;
        postData.sharePostData = { ...props.data };
        break;
    }

    const isCanPost = computed(() => {
      if (
        !postData.content &&
        postData.postMedias.length == 0 &&
        props.action != POST_EDITOR_TYPE.SHARE
      ) {
        return false;
      }

      if (postData.postMedias.some((x) => x.uploading)) {
        return false;
      }

      return true;
    });

    const dataAccessRange = ref([
      {
        name: "Công khai",
        value: 1,
        icon: "",
      },
      {
        name: "Bạn bè",
        value: 2,
        icon: "",
      },
      {
        name: "Chỉ mình tôi",
        value: 3,
        icon: "",
      },
    ]);
    const selectedAccessRange = ref(dataAccessRange.value[0]);

    function handleCloseCreatePost() {
      emit("closePostEditor");
    }

    function handleSubmitForm() {
      emit("submittedForm", {
        action: postEditorType,
        data: postData,
      });
    }

    function onDragedFile(files) {
      const fileDatas = files.map((item) => {
        return {
          id: generateUUID(),
          showUrl: URL.createObjectURL(item),
          uploading: true,
          uploaded: false,
          mediaTypeId: item.type.split("/")[0] == "image" ? 2 : 3,
          file: item,
        };
      });

      postData.postMedias = [...postData.postMedias, ...fileDatas];

      for (const file of fileDatas) {
        const fileRef = postData.postMedias.find((x) => x.id == file.id);
        uploadFileService
          .upload(file.file, "upload")
          .then((res) => {
            fileRef.uploaded = true;
            fileRef.url = res.data.url;
            fileRef.title = res.data.name;
          })
          .catch(() => {
            fileRef.uploaded = false;
          })
          .finally(() => {
            fileRef.uploading = false;
          });
      }
    }

    function deleteUploadedImage(id) {
      postData.postMedias = postData.postMedias.filter((x) => x.id != id);
    }

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
      user,
      postData,
      selectedAccessRange,
      isCanPost,
      dataAccessRange,
      POST_EDITOR_TYPE,
      deleteUploadedImage,
      onDragedFile,
      generateClassMedias,
      handleCloseCreatePost,
      handleSubmitForm,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-post__form {
  @apply fixed top-0 left-0 bottom-0 right-0 bg-gray-100 bg-opacity-80 z-10 flex justify-center items-center transition-all;

  .form-container {
    @apply bg-white w-500px rounded-lg shadow-lg row-end-auto relative overflow-hidden;

    .bg-overlay-drag-file {
      @apply absolute top-0 left-0 right-0 bottom-0 bg-gray-100 bg-opacity-75 z-50 flex items-center justify-center;

      .overlay-drag-text {
        @apply text-xl;
      }
    }

    .form-heading {
      @apply relative;

      .form-heading__title {
        @apply mb-0 text-xl font-bold text-center p-4;
      }

      .form-heading__icon-container {
        @apply absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full overflow-hidden bg-gray-200 cursor-pointer transition-all;

        &:hover {
          @apply bg-gray-300;
        }

        .form-heading__icon {
          @apply w-5 h-5 inline-block;
        }
      }
    }

    .user-info-container {
      @apply flex p-4 pb-0;

      .avatar-container {
        @apply w-10 h-10 rounded-full flex items-center justify-center overflow-hidden;

        .avatar-img {
          @apply object-cover w-full h-full;
        }
      }

      .user-info {
        @apply ms-3;

        .user-info__name {
          @apply font-semibold text-15;
        }
      }
    }

    .post-content {
      @apply p-4;

      .post-content__text {
        @apply text-2xl placeholder:text-gray-600 outline-none w-full;
      }
    }

    .post-media-container {
      @apply m-4 border border-gray-200 rounded-lg p-2 relative;
      .post-media-list {
        @apply max-h-96 overflow-y-auto;
        .post-media-item {
          @apply w-auto;
          .post-media-type {
            @apply w-full h-full rounded-md overflow-hidden relative;
            .image {
              @apply object-cover w-full h-full max-h-56 min-h-32;
            }

            .upload-image {
              @apply absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200 bg-opacity-70;
            }

            .upload-image.upload-fail {
              .upload-fail-icon {
                @apply text-red-600 text-2xl;
              }
            }

            .remove-uploaded-image {
              @apply hidden absolute top-1 right-1 w-7 h-7 items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition-all cursor-pointer;
              .remove-icon {
                @apply text-12;
              }
            }

            &:hover {
              .remove-uploaded-image {
                @apply flex;
              }
            }
          }
        }

        &::-webkit-scrollbar {
          @apply w-1;
        }

        &::-webkit-scrollbar-thumb {
          @apply bg-gray-300 rounded-md;
        }
      }

      .post-media-close {
        @apply w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 absolute -top-2 -right-2;
        .close-icon {
          @apply text-gray-500 font-semibold;
        }
      }
    }

    .additional-container {
      @apply m-4 mb-0 px-4 py-2 flex items-center justify-between
        border border-gray-300 rounded-lg;

      .additional-text {
        @apply mb-0 font-semibold text-15;
      }

      .additional-list {
        @apply flex space-x-1;

        .additional-item {
          @apply w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all;

          &:hover {
            @apply bg-gray-100;
          }
          .additional-item__img {
            @apply w-6 h-6 object-cover;
          }
        }
      }
    }
  }
}
</style>
