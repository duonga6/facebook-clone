<template>
  <div class="flex bg-gray-100">
    <navigation-component />
    <news-component />
    <contact-component />
  </div>
</template>

<script>
// @ is an alias to /src
import NavigationComponent from "@/components/Home/NavigationComponent.vue";
import ContactComponent from "@/components/Home/ContactComponent.vue";
import NewsComponent from "@/components/Home/NewsComponent.vue";

export default {
  name: "HomeView",
  components: {
    NavigationComponent,
    ContactComponent,
    NewsComponent,
  },
  setup() {},
};
</script>
