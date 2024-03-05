<template>
  <div
    ref="dragElement"
    class="drag-zone mx-4 p-4 flex items-center justify-center border rounded-lg transition-all hover:cursor-pointer"
    :class="isDragedFile ? 'border-primary' : 'border-gray-200'"
    @dragover="onDrawOver"
    @dragleave="onDragLeave"
    @drop="onDropFile"
    @mouseover="isDragedFile = true"
    @mouseleave="isDragedFile = false"
    @click="handleOpenSelectFile"
  >
    <span class="">Thêm ảnh hoặc video</span>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    extension: {
      type: Array,
      default: () => ["image/jpg", "image/png", "image/jpeg"],
    },
  },
  emits: ["DragedFile"],
  setup(props, { emit }) {
    const dragElement = ref(null);
    const isDragedFile = ref(false);

    function onDrawOver(e) {
      e.preventDefault();
      isDragedFile.value = true;
    }

    function onDragLeave() {
      isDragedFile.value = false;
    }

    async function onDropFile(e) {
      e.preventDefault();

      const fileList = e.dataTransfer.files;

      const acceptedFile = Array.from(fileList).filter((x) =>
        props.extension.includes(x.type)
      );

      if (acceptedFile.length == 0 && fileList.length > 0) {
        alert("Vui lòng chọn file ảnh hoặc video");
      } else {
        emit("DragedFile", acceptedFile);
      }

      isDragedFile.value = false;
    }

    function handleOpenSelectFile() {
      const fileUpload = document.createElement("input");
      fileUpload.type = "file";
      fileUpload.multiple = true;
      fileUpload.accept = props.extension.join(",");

      fileUpload.addEventListener("change", function (e) {
        const files = e.target.files;
        emit("DragedFile", Array.from(files));
      });

      fileUpload.click();
    }

    return {
      dragElement,
      isDragedFile,
      onDrawOver,
      onDragLeave,
      onDropFile,
      handleOpenSelectFile,
    };
  },
};
</script>
