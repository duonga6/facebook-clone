import api from "@/services/api";

const BASE_URL = "/Friendship";

export const friendshipService = {
  getInfo(id) {
    return api.get(`${BASE_URL}/GetInfo/${id}`);
  },
};
