<template>
  <div class="post-container-shared">
    <PostHeader
      :author="post.user"
      :createdAt="new Date(post.createdAt)"
      :isSharedPost="true"
    ></PostHeader>
    <PostContent :data="post.content"></PostContent>
    <PostMedia :data="post.postMedias" :postId="post.id"></PostMedia>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup() {},
};
</script>

<style lang="scss" scoped>
.post-container-shared {
  @apply mx-4 mt-4 pt-2 rounded-lg border border-gray-200 overflow-hidden;
}
</style>
