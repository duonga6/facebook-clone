import postService from "@/services/post.service";

export const post = {
  namespaced: true,
  state: () => ({
    homePosts: {
      total: 0,
      posts: [],
    },
  }),
  actions: {
    getHomePost({ commit }, params) {
      return postService
        .getPost(params.pageSize, params.pageNumber, params.searchString)
        .then(
          (response) => {
            commit("getPostSuccess", response);
            return Promise.resolve(response);
          },
          (error) => {
            return Promise.reject(error);
          }
        );
    },
  },
  mutations: {
    getPostSuccess(state, response) {
      state.homePosts.total = response.totalItems;
      state.homePosts.posts = response.data;
    },
  },
  getters: {
    getHomePosts(state) {
      return state.homePosts.posts.map((x) => ({
        ...x,
        createdAt: new Date(Date.parse(x.createdAt) + 7 * 60 * 60 * 1000),
      }));
    },
  },
};
