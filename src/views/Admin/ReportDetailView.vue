<template>
  <ReportDetail v-if="reportId" :id="reportId"></ReportDetail>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();

    return {
      reportId: computed(() => route.params.id),
    };
  },
};
</script>
