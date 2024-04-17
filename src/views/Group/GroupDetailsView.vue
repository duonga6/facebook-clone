<template>
  <GroupDetails :key="groupId" :id="groupId"></GroupDetails>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    return {
      groupId: computed(() => route.params.id),
    };
  },
};
</script>
