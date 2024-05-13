<template>
  <i
    class="pi pi-circle-fill"
    :style="{
      'font-size': size + 'px',
    }"
    :class="classCss"
  ></i>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 2,
    },
    classCss: {
      type: String,
    },
  },
  setup() {},
};
</script>
