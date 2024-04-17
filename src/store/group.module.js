import { POST_TYPE } from "@/constants";
import { PostUtils } from "./postUtils";
import { groupService } from "@/services/group.service";

export const group = {
  namespaced: true,
  state: {
    info: null,
    post: {
      data: [],
      pageSize: 10,
      pageNumber: 0,
      total: 0,
      isFetched: false,
    },
    media: {
      data: [],
      pageSize: 10,
      pageNumber: 0,
      total: 0,
      isFetched: false,
    },
  },
  actions: {
    async initGroupStore({ dispatch }, payLoad) {
      await dispatch("getGroupInfo", payLoad);
      await dispatch("getPost");
      await dispatch("getMedia");
    },

    async getGroupInfo({ commit }, payLoad) {
      const groupRes = await groupService.getById(payLoad);
      commit("getGroupDataSuccess", groupRes.data);
    },

    async getPost({ commit, state, dispatch }) {
      const postRes = await PostUtils.getPostWithDependent({
        type: POST_TYPE.GROUP_POST,
        pageSize: state.post.pageSize,
        pageNumber: state.post.pageNumber,
        groupId: state.info.id,
      });

      commit("getPostSuccess", postRes);
      dispatch("groupPost/setPosts", postRes.data, { root: true });
    },

    async getMedia({ commit, state }) {
      const mediaRes = await groupService.getMedia(state.info.id, {
        pageSize: state.media.pageSize,
        pageNumber: state.media.pageNumber + 1,
      });

      commit("getMediaSuccess", mediaRes);
    },

    reset({ commit, dispatch }) {
      dispatch("groupPost/reset", null, { root: true });
      commit("resetStore");
    },
  },
  mutations: {
    getGroupDataSuccess(state, payLoad) {
      state.info = payLoad;
    },

    getPostSuccess(state, payLoad) {
      state.post.total = payLoad.totalItems;
      state.post.pageNumber++;
      state.post.isFetched = true;
    },

    getMediaSuccess(state, payLoad) {
      state.media.total = payLoad.totalItems;
      state.media.data = [...state.media.data, ...payLoad.data];
      state.media.pageNumber++;
      state.media.isFetched = true;
    },

    resetStore(state) {
      state.info = null;
      state.post.pageNumber = 0;
      state.post.isFetched = false;
      state.post.total = 0;
      state.media.pageNumber = 0;
      state.media.isFetched = false;
      state.media.total = 0;
      state.media.data = [];
    },
  },
  getters: {
    getGroupInfo: (state) => state.info,
    getPostState: (state) => state.post,
    getMediaState: (state) => state.media,
  },
};
