import api from "./api";

class CommentReactionService {
  createPostCommentReaction(data) {
    return api
      .post("CommentReactions", data)
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

  deletePostCommentReaction(id) {
    return api
      .delete("CommentReactions/" + id)
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

  updatePostCommentReaction(id, data) {
    return api
      .put("CommentReactions/" + id, data)
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

  getOverviewPostCommentReaction(id) {
    return api
      .get(`CommentReactions/${id}/GetOverview`)
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

export default new CommentReactionService();
