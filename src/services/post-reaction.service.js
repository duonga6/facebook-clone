import api from "./api";

class PostReactionService {
  getOverviewReaction(postId) {
    return api
      .get("/PostReactions/GetOverview/" + postId)
      .then((res) => {
        if (res.data.success) {
          return res.data;
        } else {
          return Promise.reject(res.data);
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}

export default new PostReactionService();
