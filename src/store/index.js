import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { mediaType } from "./mediaType.module";
import { post } from "./post.module";
import { reaction } from "./reaction.module";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: { auth, user, mediaType, post, reaction },
});
