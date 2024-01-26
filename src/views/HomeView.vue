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
import NewsComponent from "@/components/Home/MainHomeComponent.vue";
import { onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "HomeView",
  components: {
    NavigationComponent,
    ContactComponent,
    NewsComponent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    async function getData() {
      await store.dispatch("user/getDataUser");
    }

    watch(
      () => store.state.auth.status.loggedIn,
      (newVal) => {
        if (!newVal) {
          router.push("/login");
        }
      }
    );

    onMounted(() => {
      getData();
    });

    return {};
  },
};
</script>
