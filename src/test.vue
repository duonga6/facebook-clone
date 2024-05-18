<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double Count: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
    <button @click="incrementAsync">Increment Async</button>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "TestComponent",
  setup() {
    const store = useStore();

    const count = computed(() => store.state.count);
    const doubleCount = computed(() => store.getters.doubleCount);

    function increment() {
      store.commit("increment", { amount: 1 });
    }

    function incrementAsync() {
      store.dispatch("incrementAsync", { amount: 1 });
    }

    return { count, doubleCount, increment, incrementAsync };
  },
};
</script>
