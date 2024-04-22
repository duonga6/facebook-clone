<template>
  <div class="create-group-container">
    <form @submit.prevent="handleSubmitForm" class="create-group-form">
      <div class="group-header">
        <div class=""></div>
        <span class="group-header-text">Cập nhật nhóm</span>
        <button @click.prevent="handleCloseGroupEdit" class="group-close-btn">
          <i class="group-close-icon pi pi-times"></i>
        </button>
      </div>
      <div class="group-cover-image">
        <img
          :src="
            groupData.coverImage ??
            'https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png'
          "
          alt=""
        />
        <button
          class="cover-btn-add"
          @click.prevent="handleOpenSelectCoverImage"
        >
          <i class="btn-add-icon pi pi-camera"></i>
        </button>
        <button
          class="cover-btn-remove"
          @click.prevent="handleRemoveCoverImage"
          v-if="groupData.coverImage"
        >
          <i class="btn-remove-icon pi pi-times"></i>
        </button>
      </div>
      <div class="group-info">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-1 flex flex-col">
            <input
              class="group-info-input"
              type="text"
              name="name"
              placeholder="Tên nhóm"
              v-model="groupData.name"
            />
          </div>
          <div class="col-span-1">
            <drop-down
              v-model="groupData.isPublic"
              :options="accessRange"
              optionLabel="status"
              placeholder="Chọn quyền riêng tư"
              :pt="{
                root: 'w-full px-2 py-2 inline-flex items-center relative rounded-md cursor-pointer rounded-md border col-span-1',
                input: 'p-0 text-15 text-gray-500 me-auto',
                trigger:
                  'flex items-center justify-center shrink-0 text-surface-500 rounded-tr-md rounded-br-md ms-1 mt-1',
              }"
            >
            </drop-down>
          </div>
          <div class="group-info-checkbox col-span-2">
            <input
              type="checkbox"
              id="group-info-checkbox"
              class="cursor-pointer"
              v-model="groupData.preCensored"
            />
            <label for="group-info-checkbox" class="cursor-pointer"
              >Bật tính năng phê duyệt thành viên</label
            >
          </div>
          <textarea
            class="group-info-input col-span-2"
            rows="5"
            placeholder="Mô tả về nhóm của bạn..."
            v-model="groupData.description"
          ></textarea>
        </div>
      </div>
      <div class="form-action">
        <button
          class="submit-btn btn"
          :disabled="!isCanSubmit || isUploading"
          :class="isCanSubmit ? 'btn-primary' : 'btn-disable'"
        >
          <template v-if="isUploading">
            <LoadingComponent :classCss="'w-6 h-6'"></LoadingComponent>
          </template>
          <template v-else> Lưu </template>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { uploadFileService } from "@/services/upload-file.service";
import { toastAlert } from "@/utilities/toastAlert";
import { useStore } from "vuex";
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ["onSubmit", "onClose"],
  setup(props, { emit }) {
    const store = useStore();
    const isCanSubmit = computed(() => groupData.name?.trim());
    const isUploading = ref(false);
    let fileUpload = null;

    const accessRange = ref([
      {
        status: "Công khai",
        value: true,
      },
      {
        status: "Riêng tư",
        value: false,
      },
    ]);

    const groupData = reactive({
      name: props.data.name,
      description: props.data.description,
      coverImage: props.data.coverImage,
      isPublic: accessRange.value.find((x) => x.value == props.data.isPublic),
      preCensored: props.data.preCensored,
    });

    async function handleSubmitForm() {
      isUploading.value = true;

      if (fileUpload) {
        try {
          const uploadRes = await uploadFileService.upload(
            fileUpload,
            "upload"
          );
          groupData.coverImage = uploadRes.data.url;
        } catch (ex) {
          toastAlert.error("Có lỗi khi upload ảnh bìa");
          handleCloseGroupEdit();
          isUploading.value = false;
        }
      }

      await store.dispatch("group/updateGroupInfo", {
        ...groupData,
        isPublic: groupData.isPublic.value,
      });

      isUploading.value = false;
      handleCloseGroupEdit();
    }

    function handleOpenSelectCoverImage() {
      const fileUpload = document.createElement("input");
      fileUpload.type = "file";
      fileUpload.multiple = false;
      fileUpload.accept = "image/jpg, image/png, image/jpeg";

      fileUpload.addEventListener("change", function (e) {
        onUpdateCoverImage(e.target.files[0]);
      });

      fileUpload.click();
    }

    function onUpdateCoverImage(file) {
      groupData.coverImage = URL.createObjectURL(file);
      fileUpload = file;
    }

    function handleRemoveCoverImage() {
      fileUpload = null;
      groupData.coverImage = null;
    }

    function handleCloseGroupEdit() {
      emit("onClose");
    }

    return {
      accessRange,
      groupData,
      isCanSubmit,
      isUploading,
      handleOpenSelectCoverImage,
      handleSubmitForm,
      handleRemoveCoverImage,
      handleCloseGroupEdit,
    };
  },
};
</script>

<style lang="scss" scoped>
.create-group-container {
  @apply fixed top-0 left-0 right-0 bottom-0 bg-white bg-opacity-40 z-10 flex items-center justify-center;

  .create-group-form {
    @apply bg-white border rounded-lg overflow-hidden px-4 py-2;

    .group-header {
      @apply flex items-center justify-between py-2 pb-4;
      .group-header-text {
        @apply text-xl font-bold;
      }

      .group-close-btn {
        @apply rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center;
        .group-close-icon {
          @apply text-13 font-semibold;
        }
      }
    }

    .group-cover-image {
      @apply h-90 aspect-video rounded-lg overflow-hidden relative border;

      img {
        @apply w-full h-full object-cover;
      }

      .cover-image-loading {
        @apply absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-70 flex items-center justify-center;
      }

      .cover-btn-add {
        @apply absolute bottom-2 right-2 bg-white w-8 h-8 flex items-center justify-center rounded-lg border;
        .btn-add-icon {
          @apply text-gray-600 font-bold;
        }
      }

      .cover-btn-remove {
        @apply absolute top-2 right-2 bg-white w-8 h-8 flex items-center justify-center rounded-full border;
        .btn-add-remove {
          @apply text-gray-600 font-bold;
        }
      }
    }

    .group-info {
      @apply mt-4;

      .group-info-input {
        @apply outline-none border rounded-md p-2 placeholder:text-gray-500 text-15 w-full;
      }

      .group-info-checkbox {
        @apply flex items-center space-x-2 text-15;
      }
    }

    .form-action {
      @apply mt-4;
      .submit-btn {
        @apply w-full transition-all;
      }
    }
  }
}
</style>
