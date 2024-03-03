import api from "./api";

class ReactionService {
  getDefaultDataReaction() {
    return api
      .get("/Reactions")
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}

export default new ReactionService();
