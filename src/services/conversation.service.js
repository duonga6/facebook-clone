import api from "@/services/api";
const BASE_URL = "/Conversations";

export const conversationService = {
  getByUserId(userId) {
    return api.get(`${BASE_URL}/GetByUID/${userId}`);
  },
  getById(id) {
    return api.get(`${BASE_URL}/${id}`);
  },
  get(params) {
    return api.get(BASE_URL, {
      params: params,
    });
  },
  delete(conversationId) {
    return api.delete(`${BASE_URL}/${conversationId}`);
  },
  update(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
  },
  create(data) {
    return api.post(BASE_URL, data);
  },
  getMessage(conversationId, params) {
    return api.get(`${BASE_URL}/${conversationId}/Messages`, {
      params: params,
    });
  },
  createMessage(conversationId, data) {
    return api.post(`${BASE_URL}/${conversationId}/Messages`, data);
  },
  seenMessage(conversationId, messageId) {
    return api.put(`${BASE_URL}/${conversationId}/Messages/${messageId}`);
  },
  getParticipant(conversationId, params) {
    return api.get(`${BASE_URL}/${conversationId}/Participants`, {
      params: params,
    });
  },
  getParticipantByUserId(conversationId, userId) {
    return api.get(`${BASE_URL}/${conversationId}/Participants/UID`, {
      params: {
        userId: userId,
      },
    });
  },
  createParticipant(conversationId, data) {
    return api.post(`${BASE_URL}/${conversationId}/Participants`, data);
  },
  updateParticipant(conversationId, participantId, data) {
    return api.put(
      `${BASE_URL}/${conversationId}/Participants/${participantId}`,
      data
    );
  },
  deleteParticipant(conversationId, participantId) {
    return api.delete(
      `${BASE_URL}/${conversationId}/Participants/${participantId}`
    );
  },
  getParticipantAdmin(conversationId, params) {
    return api.get(`${BASE_URL}/${conversationId}/Administrators`, {
      params: params,
    });
  },
  createParticipantAdmin(conversationId, data) {
    return api.post(`${BASE_URL}/${conversationId}/Administrators`, data);
  },
  deleteParticipantAdmin(conversationId, participantId) {
    return api.delete(
      `${BASE_URL}/${conversationId}/Administrators/${participantId}`
    );
  },
};
