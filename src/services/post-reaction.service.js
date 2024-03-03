import api from "./api";
const BASE_URL = "/PostReactions";

export const postReactionService = {
  getOverview(postId) {
    return api.get(`${BASE_URL}/GetOverview/${postId}`).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },
  create(data) {
    return api.post(`${BASE_URL}`, data).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },
  delete(id) {
    return api.delete(`${BASE_URL}/${id}`).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },
  update(id, data) {
    return api.put(`${BASE_URL}/${id}`, data).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },
};
