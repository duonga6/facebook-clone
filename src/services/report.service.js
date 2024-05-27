import api from "./api";

export const reportService = {
  create(data) {
    return api.post("/Reports", data);
  },
  get(params) {
    return api.get("/Reports", {
      params: params,
    });
  },
  markProcessed(id) {
    return api.put("/Reports/" + id);
  },
  getById(id) {
    return api.get("/Reports/" + id);
  },
  getAction(id) {
    return api.get("/Reports/" + id + "/Actions");
  },
  createAction(id, actionId) {
    return api.post(`/Reports/${id}/Actions`, {
      actionId: actionId,
    });
  },
  undoAction(id, actionDidId) {
    return api.delete(`/Reports/${id}/Actions/${actionDidId}`);
  },
  getStats() {
    return api.get(`/Reports/Stats`);
  },
};
