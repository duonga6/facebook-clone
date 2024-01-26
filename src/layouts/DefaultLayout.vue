<template>
  <HeaderComponent />
  <slot />
</template>

<script>
import HeaderComponent from "@/components/Layout/HeaderComponent.vue";
export default {
  components: { HeaderComponent },
  setup() {},
};
</script>
