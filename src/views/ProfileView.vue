<template>
  <profile-component :userData="user"></profile-component>
</template>

<script>
import ProfileComponent from "@/components/Profile/ProfileComponent.vue";
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  components: { ProfileComponent },
  setup() {
    const store = useStore();
    return {
      user: computed(() => store.getters["user/getUser"]),
    };
  },
};
</script>
