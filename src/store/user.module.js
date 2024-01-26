import userService from "@/services/user.service";

export const user = {
  namespaced: true,
  state: () => ({
    user: {},
  }),
  actions: {
    getDataUser({ commit }) {
      return userService.getUserInfo().then((response) => {
        commit("getDataSuccess", response.data);
        return Promise.resolve(response.data);
      });
    },
  },
  mutations: {
    getDataSuccess(state, user) {
      state.user = user;
    },
  },
};
