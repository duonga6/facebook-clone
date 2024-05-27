<template>
  <div class="add-post__form">
    <form class="form-container" @submit.prevent="handleSubmitForm">
      <div class="form-heading">
        <p class="form-heading__title">
          <span v-if="action == POST_EDITOR_TYPE.CREATE">Tạo bài viết</span>
          <span v-else-if="action == POST_EDITOR_TYPE.UPDATE"
            >Cập nhật bài viết</span
          >
          <span v-else>Chia sẻ bài viết</span>
        </p>
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
          <img class="avatar-img" :src="user.avatarUrl" alt="" />
        </div>
        <div class="user-info">
          <p class="user-info__name">
            {{ user.firstName + " " + user.lastName }}
          </p>
          <drop-down
            v-if="!groupShareId"
            v-model="postData.access"
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
          <div class="post-access" v-else>
            <template v-if="groupInfo.isPublic">
              <div class="post-access-icon">
                <AccessIcon :value="3"></AccessIcon>
              </div>
              <div class="post-access-text">Nhóm công khai</div>
            </template>
            <template v-else>
              <div class="post-access-icon">
                <AccessIcon :value="4"></AccessIcon>
              </div>
              <div class="post-access-text">Nhóm riêng tư</div>
            </template>
          </div>
        </div>
      </div>
      <div class="post-scroll-container">
        <div class="post-content">
          <textarea
            class="post-content__text"
            :placeholder="`${user?.lastName} ơi, bạn đang nghĩ gì thế?`"
            v-model="postData.content"
            rows="2"
            :class="postContentTextSize"
            @input="onContentChange"
          />
        </div>
        <PostShare
          v-if="action == POST_EDITOR_TYPE.SHARE || data?.sharePost"
          :post="data.sharePost ? data.sharePost : data"
        ></PostShare>
        <div
          class="post-media-container"
          v-if="
            postData.postMedias.length > 0 && action != POST_EDITOR_TYPE.SHARE
          "
        >
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
        <DragFile
          v-if="
            action == POST_EDITOR_TYPE.CREATE ||
            (action == POST_EDITOR_TYPE.UPDATE && !data?.sharePost)
          "
          @DragedFile="onDragedFile"
        ></DragFile>
      </div>
      <div class="add-post-btn p-4">
        <button
          class="w-full rounded-lg p-2 font-semibold transition-all"
          :class="
            isCanSubmit ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
          "
          :disabled="!isCanSubmit"
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
import { uploadFileService } from "@/services/upload-file.service";
import { generateUUID } from "@/utilities";
import tokenService from "@/services/token.service";
import { POST_EDITOR_TYPE } from "@/constants";
import { useStore } from "vuex";
import { toastAlert } from "@/utilities/toastAlert";
import { groupService } from "@/services/group.service";
export default {
  props: {
    data: {
      type: Object,
    },
    postId: {
      type: String,
    },
    action: {
      type: Number,
      default: POST_EDITOR_TYPE.CREATE,
    },
    groupShareId: {
      type: String,
    },
  },
  emits: ["closePostEditor", "submittedForm"],
  async setup(props, { emit }) {
    console.log(props.data);
    const store = useStore();
    const groupShareData = ref(null);
    const groupInfo = computed(() =>
      props.groupShareId
        ? groupShareData.value
        : store.getters["group/getGroupInfo"]
    );
    const user = tokenService.getUser();
    const postEditorType = { ...props }.action;
    const postContentTextSize = computed(() => {
      if (postData.postMedias.length || props.groupShareId) return "text-15";
      return "text-2xl";
    });

    if (props.groupShareId) {
      try {
        const groupRes = await groupService.getById(props.groupShareId);
        groupShareData.value = groupRes.data;
      } catch (error) {
        console.error(error);
        toastAlert.error("Có lỗi khi lấy dữ liệu nhóm chia sẻ");
      }
    }

    const dataAccessRange = ref([
      {
        name: "Công khai",
        value: 2,
        icon: "",
      },
      {
        name: "Bạn bè",
        value: 1,
        icon: "",
      },
      {
        name: "Chỉ mình tôi",
        value: 0,
        icon: "",
      },
    ]);

    const postData = reactive({
      content: null,
      postMedias: [],
      groupId: null,
      sharePostId: null,
      sharePostData: null,
      // access: computed(() => {
      //   // if (groupInfo.value && groupInfo.value.isPublic)
      //   //   return {
      //   //     value: 3,
      //   //   };

      //   return props.data?.access
      //     ? 2
      //     : dataAccessRange.value.find((x) => x.value == props.data.access);
      // }),
      access: () => {
        if (groupInfo.value && groupInfo.value.isPublic)
          return {
            value: 3,
          };

        return props.data?.access
          ? dataAccessRange.value[0]
          : dataAccessRange.value.find((x) => x.value == props.data.access);
      },
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
        postData.groupId = { ...props }.groupShareId;
        break;
    }

    const isCanSubmit = computed(() => {
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

    function handleCloseCreatePost() {
      emit("closePostEditor");
    }

    function handleSubmitForm() {
      const postDataMapped = {
        ...postData,
        access: postData.access.value,
        postMedias: postData.postMedias.map((media) => {
          return {
            id: media.id,
            mediaTypeId: media.mediaTypeId,
            url: media.url,
            title: media.title,
          };
        }),
      };

      delete postDataMapped.sharePostData;

      emit("submittedForm", {
        action: postEditorType,
        data: postDataMapped,
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

    function onContentChange(e) {
      const textareaElement = e.target;
      textareaElement.style.height = 0;
      textareaElement.style.height = textareaElement.scrollHeight + "px";
    }

    return {
      user,
      groupInfo,
      postData,
      isCanSubmit,
      dataAccessRange,
      postContentTextSize,
      POST_EDITOR_TYPE,
      deleteUploadedImage,
      onDragedFile,
      generateClassMedias,
      handleCloseCreatePost,
      handleSubmitForm,
      onContentChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-post__form {
  @apply fixed top-0 left-0 bottom-0 right-0 bg-gray-100 bg-opacity-80 z-10 flex justify-center items-center transition-all;

  .form-container {
    @apply bg-white rounded-lg shadow-lg row-end-auto relative overflow-hidden flex flex-col;
    max-height: 90vh;
    width: 600px;

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

        .post-access {
          @apply flex items-center space-x-1 bg-gray-100 rounded-md p-2 py-0.5;

          .post-access-icon {
          }
          .post-access-text {
            @apply text-13 font-semibold text-gray-600 leading-18;
          }
        }
      }
    }

    .post-scroll-container {
      @apply flex-1 overflow-y-auto mt-4;

      &::-webkit-scrollbar {
        @apply w-2;
      }

      &::-webkit-scrollbar-thumb {
        @apply rounded-lg bg-gray-300;
      }

      &::-webkit-scrollbar-track {
        @apply hidden;
      }
    }

    .post-content {
      @apply p-4 pt-0;

      .post-content__text {
        @apply placeholder:text-gray-600 outline-none w-full resize-none;
      }
    }

    .post-media-container {
      @apply m-4 border border-gray-200 rounded-lg p-2 relative;

      .post-media-list {
        @apply overflow-y-auto;

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
