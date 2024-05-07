<template>
  <div class="group-create-post-overlay-container">
    <form class="create-post-container" @submit.prevent="handleSubmitPost">
      <div class="create-post-header">
        <div class=""></div>
        <div class="header-text">Tạo bài viết</div>
        <div class="header-btn">
          <div class="header-btn-close" @click="handleCloseCreatePost">
            <i class="header-btn-icon pi pi-times"></i>
          </div>
        </div>
      </div>
      <div class="post-user">
        <div class="user-avatar">
          <img :src="user.avatarUrl" alt="" />
        </div>
        <div class="user-name">
          <div class="user-name-text">
            {{ user.firstName + " " + user.lastName }}
          </div>
          <div class="group-access-range">
            {{ isPublic ? "Nhóm Công khai" : "Nhóm Riêng tư" }}
          </div>
        </div>
      </div>
      <div class="post-content">
        <textarea
          class="post-content-input"
          rows="6"
          placeholder="Bạn viết gì đi..."
          v-model="postData.content"
        ></textarea>
      </div>
      <div class="post-media grid" v-show="postData.postMedias.length">
        <div
          class="post-media-list"
          :class="generateClassMedias(postData.postMedias.length)"
        >
          <div
            class="media-item"
            :class="generateClassMedias(postData.postMedias.length, index)"
            v-for="(item, index) in postData.postMedias"
            :key="index"
          >
            <div
              class="media-item-delete"
              @click="handleDeleteMediaItem(item.id)"
            >
              <i class="pi pi-times media-item-delete-icon"></i>
            </div>
            <img v-if="item.mediaTypeId == 2" :src="item.showUrl" alt="" />
            <video
              controls
              v-if="item.mediaTypeId == 3"
              :src="item.showUrl"
            ></video>
          </div>
        </div>
      </div>
      <DragFile @DragedFile="onDragedFile"></DragFile>
      <div class="post-action">
        <button
          class="form-submit-btn btn"
          :class="{ disable: !isCanPost }"
          :disabled="!isCanPost"
        >
          Đăng
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { generateUUID } from "@/utilities";
import { computed, reactive } from "vue";
import { uploadFileService } from "@/services/upload-file.service";
import { toastAlert } from "@/utilities/toastAlert";
import tokenService from "@/services/token.service";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  emits: ["onCloseCreatePost"],
  setup(_, { emit }) {
    const store = useStore();
    const route = useRoute();
    const groupId = route.params.id;
    const user = tokenService.getUser();
    const isPublic = computed(
      () => store.getters["group/getGroupInfo"]?.isPublic
    );

    const postData = reactive({
      content: null,
      postMedias: [],
    });
    const isCanPost = computed(
      () => postData.content || postData.postMedias.length
    );

    function onDragedFile(files) {
      const filesMapped = files.map((item) => {
        return {
          id: generateUUID(),
          showUrl: URL.createObjectURL(item),
          mediaTypeId: item.type.split("/")[0] == "image" ? 2 : 3,
          file: item,
        };
      });

      postData.postMedias = [...postData.postMedias, ...filesMapped];
    }

    function handleDeleteMediaItem(id) {
      postData.postMedias = postData.postMedias.filter((x) => x.id != id);
    }

    async function handleSubmitPost() {
      if (isCanPost.value) {
        isCanPost.value = false;
        let mediaUploaded = [];
        if (postData.postMedias.length) {
          mediaUploaded = await Promise.all(
            postData.postMedias.map(async (item) => {
              try {
                const resUploadMedia = await uploadFileService.upload(
                  item.file,
                  "upload"
                );

                return {
                  mediaTypeId: item.mediaTypeId,
                  url: resUploadMedia.data.url,
                  title: resUploadMedia.data.name,
                };
              } catch (err) {
                toastAlert.error("Có lỗi khi upload media");
                return;
              }
            })
          );
        }

        try {
          await store.dispatch("groupPost/createPost", {
            groupId: groupId,
            access: 3,
            content: postData.content,
            postMedias: mediaUploaded,
          });
        } catch (err) {
          console.log(err);
          toastAlert.error("Có lỗi khi tạo bài viết");
        }
        isCanPost.value = true;
        handleCloseCreatePost();
      }
    }

    function handleCloseCreatePost() {
      emit("onCloseCreatePost");
    }

    return {
      postData,
      isCanPost,
      user,
      isPublic,
      generateClassMedias,
      onDragedFile,
      handleDeleteMediaItem,
      handleSubmitPost,
      handleCloseCreatePost,
    };
  },
};

function generateClassMedias(totalItems, index = null) {
  if (index == null) {
    return `grid-cols-2`;
  }

  if (totalItems % 2 == 1 && index == 0) {
    return "col-span-2";
  }

  return "col-span-1";
}
</script>

<style lang="scss" scoped>
.group-create-post-overlay-container {
  @apply fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white bg-opacity-50 z-10;

  .create-post-container {
    @apply flex flex-col bg-white rounded-lg border w-500px;

    .create-post-header {
      @apply flex justify-between items-center p-4 py-3 border-b;

      .header-text {
        @apply text-xl font-bold;
      }

      .header-btn {
        .header-btn-close {
          @apply flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-200 hover:bg-gray-300 transition-all cursor-pointer;

          .header-btn-icon {
            @apply text-gray-500 font-semibold text-15;
          }
        }
      }
    }
    .post-user {
      @apply flex items-center p-4;

      .user-avatar {
        @apply w-10 h-10 rounded-full overflow-hidden;

        img {
          @apply w-full h-full object-cover;
        }
      }
      .user-name {
        @apply ms-3;

        .user-name-text {
          @apply text-15 font-semibold;
        }

        .group-access-range {
          @apply bg-gray-200 px-2 py-0.5 text-gray-600 font-semibold text-13 rounded-md;
        }
      }
    }
    .post-content {
      @apply px-4;

      .post-content-input {
        @apply text-xl outline-none border-none w-full resize-none;

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
    }
    .post-media {
      @apply mx-4 border rounded-lg mb-4;

      .post-media-list {
        @apply m-2 grid gap-0.5 max-h-96 overflow-y-auto;

        &::-webkit-scrollbar {
          @apply w-1.5;
        }

        &::-webkit-scrollbar-thumb {
          @apply rounded-lg bg-gray-300;
        }

        &::-webkit-scrollbar-track {
          @apply hidden;
        }

        .media-item {
          @apply max-h-56 rounded-lg overflow-hidden relative;

          img {
            @apply w-full h-full object-cover;
          }

          video {
            @apply w-full h-full object-contain;
          }

          .media-item-delete {
            @apply absolute top-1 right-1 z-10 rounded-full overflow-hidden w-6 h-6 bg-gray-200 items-center justify-center hidden cursor-pointer hover:bg-red-500 hover:text-white transition-all;

            .media-item-delete-icon {
              @apply text-12;
            }
          }

          &:hover {
            .media-item-delete {
              @apply flex;
            }
          }
        }
      }
    }
    .post-add-media {
      @apply mx-4 border rounded-lg text-center py-3;
    }
    .post-action {
      @apply p-4;

      .form-submit-btn {
        @apply bg-primary text-white py-2 w-full transition-all;

        &.disable {
          @apply bg-gray-200 text-gray-600;
        }
      }
    }
  }
}
</style>
