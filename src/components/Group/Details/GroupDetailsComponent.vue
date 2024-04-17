<template>
  <GroupHeader v-if="groupData" :data="groupData"></GroupHeader>
  <router-view></router-view>
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
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

    const groupData = computed(() => store.getters["group/getGroupInfo"]);

    onMounted(async () => {
      await store.dispatch("group/initGroupStore", groupId);
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
