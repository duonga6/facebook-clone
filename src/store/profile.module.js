import { userService } from "@/services/user.service";
import { toastAlert } from "@/utilities/toastAlert";

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

          return Promise.resolve();
        } catch (error) {
          console.error(error);
          toastAlert.error("Có lỗi khi tải trang cá nhân");
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
