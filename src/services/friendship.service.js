import api from "@/services/api";

const BASE_URL = "/Friendship";

export const friendshipService = {
  getInfo(id) {
    return api.get(`${BASE_URL}/GetInfo/${id}`);
  },
  get(params) {
    return api.get(`${BASE_URL}`, {
      params: params,
    });
  },
  accept(id) {
    return api.put(`${BASE_URL}/AcceptFriend/${id}`);
  },
  sendRequest(data) {
    return api.post(`${BASE_URL}/AddFriend`, data);
  },
  unFriend(id) {
    return api.delete(`${BASE_URL}/UnFriend/${id}`);
  },
  cancelSendRequest(id) {
    return api.delete(`${BASE_URL}/CancelAddFriendRequest/${id}`);
  },
  refuseFriend(id) {
    return api.delete(`${BASE_URL}/RefuseFriend/${id}`);
  },
  blockUser(data) {
    return api.post(`${BASE_URL}/BlockFriend`, data);
  },
  unblockUser(id) {
    return api.delete(`${BASE_URL}/UnblockFriend/${id}`);
  },
};
