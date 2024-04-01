<template>
  <div class="create-group-container">
    <form @submit.prevent="handleSubmitForm" class="create-group-form">
      <div class="group-header">
        <div class=""></div>
        <span class="group-header-text">Tạo nhóm</span>
        <div class="group-close-btn">
          <i class="group-close-icon pi pi-times"></i>
        </div>
      </div>
      <div class="group-cover-image">
        <img
          src="https://scontent-hkg1-2.xx.fbcdn.net/v/t1.6435-9/31435806_1249955258441579_134985303080304640_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeH5X1Z3k08D-5sUDsxeQbSx1GD2WIuydMvUYPZYi7J0y7G5dFFMIZY1dS1C8ozpHMU-uPgHkZB8esFpVMwfRiaE&_nc_ohc=sRXOppQjkR8AX9SPSQu&_nc_ht=scontent-hkg1-2.xx&oh=00_AfDT5EGB1XprhhiTwhfyIXw7rFlu6Oltbxr4f_jE87WrEw&oe=66319255"
          alt=""
        />
        <button class="cover-btn-add">
          <i class="cover-btn-icon pi pi-camera"></i>
        </button>
      </div>
      <div class="group-info">
        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
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
          :disabled="!isCanSubmit"
          :class="isCanSubmit ? 'btn-primary' : 'btn-disable'"
        >
          Tạo
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
export default {
  emits: ["onSubmit"],
  setup(_, { emit }) {
    const isCanSubmit = computed(() => {
      if (groupData.name) {
        return groupData.name.trim();
      }

      return groupData.name;
    });
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
      name: null,
      description: null,
      isPublic: accessRange.value[0],
    });

    function handleSubmitForm() {
      emit("onSubmit", {
        ...groupData,
        isPublic: groupData.isPublic.value,
      });
    }

    return {
      accessRange,
      groupData,
      isCanSubmit,
      handleSubmitForm,
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

      .cover-btn-add {
        @apply absolute bottom-2 right-2 bg-white w-8 h-8 flex items-center justify-center rounded-lg border;
        .cover-btn-icon {
          @apply text-gray-600 font-bold;
        }
      }
    }

    .group-info {
      @apply mt-4;

      .group-info-input {
        @apply outline-none border rounded-md p-2 placeholder:text-gray-500 text-15 w-full;
      }
    }

    .form-action {
      @apply mt-4;
      .submit-btn {
        @apply w-full;
      }
    }
  }
}
</style>
