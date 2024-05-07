<template>
  <i
    class="pi pi-circle-fill"
    :style="{
      'font-size': size + 'px',
    }"
  ></i>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 2,
    },
  },
  setup() {},
};
</script>
