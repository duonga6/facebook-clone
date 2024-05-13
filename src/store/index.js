import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { mediaType } from "./mediaType.module";
import { reaction } from "./reaction.module";
import { profile } from "@/store/profile.module";
import { group } from "@/store/group.module";
import { conversation } from "@/store/conversation.module";
import createModuleCursor from "./postCursorModuleFactory";

const groupPost = createModuleCursor();
const feedPost = createModuleCursor();
const homePost = createModuleCursor();
const profilePost = createModuleCursor();
const singlePost = createModuleCursor();
const searchPost = createModuleCursor();

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    logout({ commit }) {
      commit("user/reset");
      commit("auth/logout");
      commit("homePost/reset");
      commit("conversation/reset");
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
    conversation,
    searchPost,
  },
});
