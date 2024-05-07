<template>
  <svg
    height="12"
    width="25"
    fill="white"
    style="transform: scale(1, -1) translate(0px, 0px)"
    class="absolute"
    :class="css"
    :style="style"
  >
    <path
      d="M24.553.103c-2.791.32-5.922 1.53-7.78 3.455l-9.62 7.023c-2.45 2.54-5.78 1.645-5.78-2.487V2.085C1.373 1.191.846.422.1.102h24.453z"
    ></path>
  </svg>
</template>

<script>
export default {
  props: {
    css: {
      type: String,
      default: "",
    },
    style: {
      type: Object,
      default: null,
    },
  },
  setup() {},
};
</script>
