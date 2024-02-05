import reactionService from "@/services/reaction.service";

export const reaction = {
  namespaced: true,
  state: () => ({
    reactions: [],
  }),
  actions: {
    getDefaultReaction({ commit }) {
      return reactionService.getDefaultDataReaction().then(
        (response) => {
          commit("getDefaultDataReactionSuccess", response.data);
          return Promise.resolve(response.date);
        },
        (error) => {
          commit("getDefaultDataReactionFail", error);
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    getDefaultDataReactionSuccess(state, reaction) {
      state.reactions = reaction;
    },
    getDefaultDataReactionFail(state, error) {
      console.log(error);
    },
  },
};
