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
    },
    video: {
      data: [],
      pageSize: 12,
      pageNumber: 0,
      total: 0,
    },
    friend: {
      data: [],
      pageSize: 6,
      pageNumber: 0,
      total: 0,
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
          toastAlert.error(error);
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
    reset({ commit }) {
      commit("reset");
    },
    resetFriendSearch({ commit }) {
      commit("resetFriendSearch");
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
    },
    getFriendSuccess(state, payLoad) {
      state.friend.data = [...state.friend.data, ...payLoad.data];
      state.friend.pageNumber++;
      state.friend.total = payLoad.totalItems;
    },
    getFriendSearchSuccess(state, payLoad) {
      state.friendSearch.data = [...state.friendSearch.data, ...payLoad.data];
      state.friendSearch.total = payLoad.totalItems;
      state.friendSearch.pageNumber++;
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
    },
    resetFriendSearch(state) {
      state.friendSearch.data = [];
      state.friendSearch.total = 0;
      state.friendSearch.pageNumber = 0;
    },
  },
  getters: {
    getPhoto: (state) => state.photo,
    getUser: (state) => state.userData,
    getFriend: (state) => state.friend,
  },
};
