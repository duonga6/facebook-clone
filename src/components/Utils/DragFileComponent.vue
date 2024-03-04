<template>
  <div
    ref="dragElement"
    class="drag-zone w-full h-52"
    @dragover="onDropFile"
  ></div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    extension: {
      type: Array,
      default: new Array("image/jpg", "image/png", "image/jpeg"),
    },
  },
  setup(props) {
    const dragElement = ref(null);

    function onDropFile(e) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "copy";

      const fileList = e.originalEvent.dataTransfer.files;

      console.log(fileList[0]);
      const invalidFile = Array.from(fileList).some(
        (x) => !props.extension.includes(x.type)
      );

      if (invalidFile) {
        console.log("file not support");
        dragElement.value.classList.add("cursor-not-allowed");
        return;
      }
    }

    return {
      dragElement,
      onDropFile,
    };
  },
};
</script>
