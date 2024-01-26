<template>
  <div class="flex-1 flex justify-center">
    <div class="max-w-news-width">
      <story-component />
      <add-post-component />
      <home-post-component />
    </div>
  </div>
</template>

<script>
import StoryComponent from "@/components/Home/StoryComponent.vue";
import AddPostComponent from "@/components/Post/AddPostComponent.vue";
import HomePostComponent from "../Post/HomePostComponent.vue";

export default {
  components: { StoryComponent, AddPostComponent, HomePostComponent },
  setup() {},
};
</script>
