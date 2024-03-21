import { FRIEND_TYPE } from "@/constants";
import { friendshipService } from "@/services/friendship.service";
import { userService } from "@/services/user.service";
import { toastAlert } from "@/utilities/toastAlert";

export const profile = {
  namespaced: true,
  state: {
    userId: null,
    userData: null,
    photo: {
      data: [],
      pageSize: 10,
      pageNumber: 0,
      total: 0,
    },
    video: {
      data: [],
      pageSize: 10,
      pageNumber: 0,
      total: 0,
    },
    friend: {
      data: [],
      pageSize: 10,
      pageNumber: 0,
      total: 0,
    },
  },
  actions: {
    async initStore({ commit, state }, payLoad) {
      if (payLoad.userId) {
        commit("setUserId", payLoad.userId);
        try {
          const userRes = await userService.getById(state.userId);
          commit("getUserSuccess", userRes);

          const photoRes = await userService.getPhoto(state.userId, {
            pageSize: state.photo.pageSize,
            pageNumber: state.photo.pageNumber + 1,
          });
          commit("getPhotoSuccess", photoRes);

          const friendRes = await friendshipService.get({
            pageSize: state.friend.pageSize,
            type: FRIEND_TYPE.ACCEPTED,
            pageNumber: state.friend.pageNumber + 1,
            userId: state.userId,
          });
          commit("getFriendSuccess", friendRes);
        } catch (error) {
          toastAlert.error(error);
        }
      }
    },
    reset({ commit }) {
      commit("reset");
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
  },
  getters: {
    getPhotos(state) {
      return state.photo.data;
    },
  },
};
