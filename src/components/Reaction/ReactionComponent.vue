<template>
  <div class="reaction-container">
    <div
      class="reaction-item"
      v-for="reaction in reactions"
      :key="reaction.id"
      @click.stop="onSelectReaction(reaction.id)"
    >
      <img class="reaction-img" :src="reaction.iconUrl" alt="" />
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  emits: ["onSelectReaction"],
  setup(props, { emit }) {
    const store = useStore();

    function onSelectReaction(id) {
      emit("onSelectReaction", id);
    }

    return {
      reactions: computed(() => store.state.reaction.reactions),
      onSelectReaction,
    };
  },
};
</script>

<style lang="scss" scoped>
.reaction-container {
  @apply flex bg-white p-1 rounded-full border border-gray-300 shadow-sm space-x-2 transform transition-all duration-200;
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
