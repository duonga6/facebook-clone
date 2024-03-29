import { userService } from "@/services/user.service";
import { toastAlert } from "@/utilities/toastAlert";
import { PostUtils } from "./postUtils";
import { POST_TYPE } from "@/constants";

export const profile = {
  namespaced: true,
  state: {
    userId: null,
    userData: null,
    photo: {
      data: [],
      pageSize: 12,
      pageNumber: 0,
      total: 0,
      _isFetched: false,
    },
    video: {
      data: [],
      pageSize: 12,
      pageNumber: 0,
      total: 0,
      _isFetched: false,
    },
    friend: {
      data: [],
      pageSize: 6,
      pageNumber: 0,
      total: 0,
      _isFetched: false,
    },
    post: {
      data: [],
      total: 0,
      pageSize: 10,
      pageNumber: 0,
      _isFetched: false,
    },
  },
  actions: {
    async initStore({ commit, state, dispatch }, payLoad) {
      if (payLoad.userId) {
        commit("setUserId", payLoad.userId);
        try {
          const userRes = await userService.getById(state.userId);
          commit("getUserSuccess", userRes);

          await dispatch("getPhoto");
          await dispatch("getFriend");
          await dispatch("getPost");

          return Promise.resolve();
        } catch (error) {
          toastAlert.error("profile/initStore: " + error);
        }
      }
    },
    async getPhoto({ commit, state }) {
      const photoRes = await userService.getPhoto(state.userId, {
        pageSize: state.photo.pageSize,
        pageNumber: state.photo.pageNumber + 1,
      });
      commit("getPhotoSuccess", photoRes);
    },
    async getFriend({ commit, state }) {
      const friendRes = await userService.getFriends(state.userId, {
        pageSize: state.friend.pageSize,
        pageNumber: state.friend.pageNumber + 1,
      });
      commit("getFriendSuccess", friendRes);
    },
    async getPost({ commit, state, dispatch }) {
      const postRes = await PostUtils.getPostWithDependent({
        type: POST_TYPE.PROFILE_POST,
        pageSize: state.post.pageSize,
        pageNumber: state.post.pageNumber,
        userId: state.userId,
      });

      commit("getPostSuccess", postRes);
      dispatch("profilePost/setPosts", postRes.data, { root: true });
    },
    reset({ commit, dispatch }) {
      commit("reset");
      dispatch("profilePost/reset", null, { root: true });
    },
  },
  mutations: {
    setUserId(state, payLoad) {
      state.userId = payLoad;
    },
    getUserSuccess(state, payLoad) {
      state.userData = payLoad.data;
    },
    getPhotoSuccess(state, payLoad) {
      state.photo.data = [...state.photo.data, ...payLoad.data];
      state.photo.pageNumber++;
      state.photo.total = payLoad.totalItems;
      state.photo._isFetched = true;
    },
    getFriendSuccess(state, payLoad) {
      state.friend.data = [...state.friend.data, ...payLoad.data];
      state.friend.pageNumber++;
      state.friend.total = payLoad.totalItems;
      state.photo._isFetched = true;
    },
    getPostSuccess(state, payLoad) {
      state.post.total = payLoad.totalItems;
      state.post.pageNumber++;
      state.post._isFetched = true;
    },
    reset(state) {
      state.userId = null;
      state.userData = null;
      state.photo = {
        data: [],
        pageSize: 10,
        pageNumber: 0,
        total: 0,
      };
      state.friend = {
        data: [],
        pageSize: 10,
        pageNumber: 0,
        total: 0,
      };
      state.video = {
        data: [],
        pageSize: 10,
        pageNumber: 0,
        total: 0,
      };
      state.post = {
        data: [],
        total: 0,
        pageSize: 10,
        pageNumber: 0,
        _isFetched: false,
      };
    },
  },
  getters: {
    getPhoto: (state) => state.photo,
    getUser: (state) => state.userData,
    getFriend: (state) => state.friend,
    getPostState: (state) => {
      return {
        pageSize: state.post.pageSize,
        pageNumber: state.post.pageNumber,
        total: state.post.total,
        _isFetched: state.post._isFetched,
      };
    },
  },
};
