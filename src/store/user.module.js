import userService from "@/services/user.service";

const initialState = {
  user: null,
};

export const user = {
  namespaced: true,
  state: initialState,
  actions: {
    getDataUser({ commit }) {
      return userService
        .getUserInfo()
        .then((response) => {
          commit("getDataSuccess", response.data);
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
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
