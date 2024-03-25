import api from "./api";
const BASE_URL = "/CommentReactions";

export const commentReactionService = {
  create(data) {
    return api.post(`${BASE_URL}`, data);
  },

  delete(id) {
    return api.delete(`${BASE_URL}/` + id);
  },

  update(id, data) {
    return api.put(`${BASE_URL}/` + id, data);
  },

  getOverview(id) {
    return api.get(`${BASE_URL}/${id}/GetOverview`);
  },
  getById(id) {
    return api.get(`${BASE_URL}/${id}`);
  },
};
