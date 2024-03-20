<template>
  <div class="post-content">
    {{ data }}
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
    },
  },
  setup() {},
};
</script>

<style lang="scss" scoped>
.post-content {
  @apply mt-2 px-4 text-15 leading-18 mb-2;
}
</style>
