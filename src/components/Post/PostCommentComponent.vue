<template>
  <template v-if="comments && comments.length > 0">
    <comment-component
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
    ></comment-component>
  </template>
</template>

<script>
import { computed } from "vue";
import CommentComponent from "../Comment/CommentComponent.vue";

export default {
  components: { CommentComponent },
  props: {
    data: {
      type: Array,
    },
  },
  setup(props) {
    return {
      comments: computed(() => props.data),
    };
  },
};
</script>
