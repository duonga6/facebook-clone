import { userService } from "@/services/user.service";

const initialState = {
  user: null,
};

export const user = {
  namespaced: true,
  state: initialState,
  actions: {
    getDataUser({ commit }) {
      userService
        .getUserInfo()
        .then((res) => {
          commit("getDataSuccess", res.data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
  mutations: {
    getDataSuccess(state, user) {
      state.user = user;
    },
    reset(state) {
      state.user = null;
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
  },
};
