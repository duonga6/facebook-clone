import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { mediaType } from "./mediaType.module";
import { reaction } from "./reaction.module";
import { profile } from "@/store/profile.module";
import { group } from "@/store/group.module";
import createModule from "./postModuleFactory";

const groupPost = createModule();
const homePost = createModule();
const profilePost = createModule();
const singlePost = createModule();
const feedPost = createModule();

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
    groupPost,
    user,
    mediaType,
    reaction,
    homePost,
    profilePost,
    singlePost,
    profile,
    group,
    feedPost,
  },
});
