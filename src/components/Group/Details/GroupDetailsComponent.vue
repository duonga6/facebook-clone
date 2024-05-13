<template>
  <GroupHeader></GroupHeader>
  <div class="group-details-bg bg-gray-200 py-4 flex-1">
    <router-view></router-view>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const groupData = computed(() => store.getters["group/getGroupInfo"]);

    onMounted(async () => {
      try {
        await store.dispatch("group/initGroupStore", props.id);
      } catch (err) {
        console.error(err);
        if (err?.errors[0]?.substring(0, 5) == "Group") {
          router.push({
            name: "not-found",
          });
        }
      }
    });

    onUnmounted(() => {
      store.dispatch("group/reset");
    });

    return {
      groupData,
    };
  },
};
</script>
