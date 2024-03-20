import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { mediaType } from "./mediaType.module";
import { post } from "./post.module";
import { reaction } from "./reaction.module";
import createModule from "./postModuleFactory";

const homePost = createModule();
const profilePost = createModule();
const singlePost = createModule();

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    logout({ commit }) {
      commit("user/reset");
      commit("auth/logout");
      commit("homePost/reset");
    },
  },
  modules: {
    auth,
    user,
    mediaType,
    post,
    reaction,
    homePost,
    profilePost,
    singlePost,
  },
});
