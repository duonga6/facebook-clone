import api from "./api";

export const commentReactionService = {
  create(data) {
    return api.post("CommentReactions", data).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },

  delete(id) {
    return api.delete("CommentReactions/" + id).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },

  update(id, data) {
    return api.put("CommentReactions/" + id, data).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },

  getOverview(id) {
    return api.get(`CommentReactions/${id}/GetOverview`).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },
};
