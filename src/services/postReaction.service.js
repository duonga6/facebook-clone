/* eslint-disable */

import api from "./api";
const BASE_URL = "/PostReactions";

export const postReaction = {
  async getOverview(postId) {
    try {
      const res = await api.get(`${BASE_URL}/${postId}/GetOverview`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  delete(id) {
    return api.delete(`${BASE_URL}/${id}`);
  },
  create(data) {
    return api.post(`${BASE_URL}`, data);
  }
}
