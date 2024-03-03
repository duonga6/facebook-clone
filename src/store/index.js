import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { mediaType } from "./mediaType.module";
import { homePost } from "./homePost.module";
import { reaction } from "./reaction.module";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    logout({ commit }) {
      commit("homePost/reset");
      commit("user/reset");
      commit("auth/logout");
    },
  },
  modules: { auth, user, mediaType, homePost, reaction },
});
