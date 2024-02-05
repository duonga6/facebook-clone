<template>
  <div
    class="reaction-container"
    :class="
      isShow
        ? 'translate-y-0 visible opacity-100'
        : 'translate-y-10 invisible opacity-0'
    "
  >
    <div
      class="reaction-item"
      v-for="reaction in reactions"
      :key="reaction.id"
      @click.stop="onSelectReaction(reaction.id)"
      :class="{ active: reaction.id == reactionSelectedId }"
    >
      <img class="reaction-img" :src="reaction.iconUrl" alt="" />
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  props: {
    isShowReaction: {
      type: Boolean,
    },
    selectedReactionId: {
      type: Object,
    },
  },
  emits: ["onSelectReaction"],
  setup(props, { emit }) {
    const store = useStore();
    const reactions = reactive(store.state.reaction.reactions);
    const reactionSelectedId = ref(props.selectedReactionId);
    const isShow = ref(props.isShowReaction);

    watch(
      () => props.isShowReaction,
      (newVal) => {
        isShow.value = newVal;
      }
    );

    function onSelectReaction(id) {
      emit("onSelectReaction", id);
    }

    return {
      reactions,
      isShow,
      onSelectReaction,
      reactionSelectedId,
    };
  },
};
</script>

<style lang="scss" scoped>
.reaction-container {
  @apply flex bg-white p-1 rounded-full border border-gray-300 shadow-sm space-x-2 transform transition-all;
  .reaction-item {
    @apply w-10 h-10;
    .reaction-img {
      @apply transition-all;

      &:hover {
        @apply transform scale-120 -translate-y-1;
      }
    }
  }
}
</style>
