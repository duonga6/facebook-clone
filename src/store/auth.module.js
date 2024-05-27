import AuthService from "@/services/auth.service";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        (res) => {
          commit("loginSuccess", res.data);
          return Promise.resolve(res);
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        (res) => {
          return Promise.resolve(res);
        },
        (error) => {
          commit("registerFailure");
          return Promise.reject(error);
        }
      );
    },
    refreshToken({ commit }, token) {
      commit("refreshToken", token);
    },
    changeAvatar({ commit }, payLoad) {
      commit("changeAvatar", payLoad);
    },
    setUser({ commit }, user) {
      commit("setUser", user);
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      AuthService.logout();
      state.user = null;
    },
    registerSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    refreshToken(state, token) {
      state.user.token = token;
    },
    changeAvatar(state, payLoad) {
      state.user.avatarUrl = payLoad;
    },
    setUser(state, payLoad) {
      state.user = payLoad.user;
      state.state.loggedIn = true;
    },
  },
  getters: {
    getUser: (state) => state.user,
    getLoginStatus: (state) => state.status.loggedIn,
  },
};
