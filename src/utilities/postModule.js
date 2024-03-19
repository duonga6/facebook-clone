import { reactive } from "vue";

const state = reactive({
  data: null,
});

const actions = {
  setState(payload) {
    state.data = payload;
  },
};

export default {
  state,
  actions,
};
