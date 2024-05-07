<template>
  <div class="edit-comment-container">
    <div class="edit-comment-area">
      <textarea
        id="comment-input"
        class="edit-comment-input"
        v-model="commentInput"
        @input="onCommentChange"
        rows="1"
      />
      <button
        class="edit-comment-btn"
        @click="handleSubmitEditComment"
        :disabled="!isCanSubmit"
      >
        <i
          class="edit-btn-icon"
          :class="{ active: isCanSubmit }"
          style="
            background-image: url('/src/images/icons/post-icon.png');
            background-position: 0px -1269px;
            background-size: auto;
            width: 16px;
            height: 16px;
            background-repeat: no-repeat;
            display: block;
          "
        ></i>
      </button>
    </div>
    <div class="edit-comment-action">
      <div class="edit-action-cancel" @click="handleCancelEditComment">Hủy</div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
export default {
  props: {
    data: {
      type: String,
      required: true,
    },
  },
  emits: ["onSubmitEditComment", "onCancelEditComment"],
  setup(props, { emit }) {
    const commentInput = ref(props.data);
    const isCanSubmit = computed(
      () => commentInput.value && commentInput.value.trim()
    );

    function onCommentChange(e) {
      const textareaElement = e.target;
      textareaElement.style.height = 0;
      textareaElement.style.height = textareaElement.scrollHeight + "px";
    }

    function handleSubmitEditComment() {
      emit("onSubmitEditComment", commentInput.value);
    }

    function handleCancelEditComment() {
      emit("onCancelEditComment");
    }

    onMounted(() => {
      document.getElementById("comment-input").focus();
    });

    return {
      onCommentChange,
      handleSubmitEditComment,
      handleCancelEditComment,
      commentInput,
      isCanSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.edit-comment-container {
  @apply flex-1;

  .edit-comment-area {
    @apply relative flex;

    .edit-comment-input {
      @apply bg-gray-100 rounded-xl w-full text-15 p-2 pe-8 outline-none border-none resize-none;
    }

    .edit-comment-btn {
      @apply absolute right-2 top-1/2 -translate-y-1/2;

      .edit-btn-icon {
        filter: invert(80%) sepia(6%) saturate(200%) saturate(120%)
          hue-rotate(173deg) brightness(98%) contrast(89%);

        &.active {
          filter: invert(19%) sepia(70%) saturate(5671%) hue-rotate(203deg)
            brightness(96%) contrast(101%);
        }
      }
    }
  }
  .edit-comment-action {
    .edit-action-cancel {
      @apply text-12 text-primary cursor-pointer ms-2;
    }
  }
}
</style>
