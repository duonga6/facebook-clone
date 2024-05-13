import tokenService from "@/services/token.service";
import { userService } from "@/services/user.service";

const initialState = {
  user: null,
};

export const user = {
  namespaced: true,
  state: initialState,
  actions: {
    getDataUser({ commit }) {
      if (!tokenService.getUser()) return;
      userService
        .getUserInfo()
        .then((res) => {
          commit("getDataSuccess", res.data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    changeAvatar({ commit }, payLoad) {
      commit("changeAvatar", payLoad);
    },
  },
  mutations: {
    getDataSuccess(state, user) {
      state.user = user;
    },

    changeAvatar(state, payLoad) {
      state.user.avatarUrl = payLoad;
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
