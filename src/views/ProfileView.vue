<template>
  <ProfileComponent :userData="user"></ProfileComponent>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    return {
      user: computed(() => store.getters["user/getUser"]),
    };
  },
};
</script>
