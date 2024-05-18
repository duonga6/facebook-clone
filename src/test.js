import { createStore } from "vuex";

const store = createStore({
  state: {
    count: 0,
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  mutations: {
    increment(state, payload) {
      state.count += payload.amount;
    },
  },
  actions: {
    incrementAsync({ commit }, payload) {
      setTimeout(() => {
        commit("increment", payload);
      }, 1000);
    },
  },
});

export default store;
