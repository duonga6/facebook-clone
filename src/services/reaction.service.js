import api from "./api";

class ReactionService {
  getDefaultDataReaction() {
    return api
      .get("/Reactions")
      .then((response) => {
        if (response.data.status) {
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}

export default new ReactionService();
