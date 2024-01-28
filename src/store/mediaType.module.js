import mediaTypeService from "@/services/mediaType.service";

export const mediaType = {
  namespaced: true,
  state: () => ({
    mediaTypes: [],
  }),
  actions: {
    getAll({ commit }) {
      return mediaTypeService.getAll().then(
        (response) => {
          commit("getAllSuccess", response.data);
          return Promise.resolve(response.data);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    getAllSuccess(state, data) {
      state.mediaTypes = data;
    },
  },
};
