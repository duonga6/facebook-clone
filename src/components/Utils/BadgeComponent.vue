<template>
  <span
    class="rounded-full bg-red-500 w-4 h-4 leading-16 absolute text-white font-bold text-center text-11"
    :class="position"
    >{{ value }}</span
  >
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    position: {
      type: String,
      default: "top-1 right-1",
    },
  },
  setup() {},
};
</script>
