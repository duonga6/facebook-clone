<template>
  <img :src="src" alt="" class="access-icon" />
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      validator: (val) => [0, 1, 2, 3].includes(val),
    },
  },
  setup(props) {
    const srcData = [
      "/src/images/access-range/private-access.png",
      "/src/images/access-range/friend-access.png",
      "/src/images/access-range/public-access.png",
      "/src/images/access-range/public-access.png",
      "/src/images/access-range/private-group.png",
    ];

    return {
      src: srcData[props.value],
    };
  },
};
</script>

<style scoped>
.access-icon {
  filter: invert(39%) sepia(21%) saturate(200%) saturate(109.5%)
    hue-rotate(174deg) brightness(94%) contrast(86%);
}
</style>
