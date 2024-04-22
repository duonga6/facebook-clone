<template>
  <div class="flex flex-col min-h-screen">
    <GroupHeader v-if="groupData" :data="groupData"></GroupHeader>
    <div class="group-details-bg bg-gray-200 py-4 flex-1">
      <router-view></router-view>
    </div>
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
    // eslint-disable-next-line vue/no-setup-props-destructure
    const groupId = props.id;
    const store = useStore();
    // eslint-disable-next-line no-unused-vars
    const router = useRouter();

    const groupData = computed(() => store.getters["group/getGroupInfo"]);

    onMounted(async () => {
      try {
        await store.dispatch("group/initGroupStore", groupId);
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
