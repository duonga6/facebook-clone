import api from "@/services/api";
const BASE_URL = "/Notifications";

export const notificatonService = {
  get(params) {
    return api.get(BASE_URL + "/GetCursor", {
      params: params,
    });
  },
  seen(id) {
    return api.put(BASE_URL + `/${id}`);
  },
};
