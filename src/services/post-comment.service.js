import api from "./api";

class PostCommentService {
  getOverview(postId) {
    return api
      .get("/PostComments/GetOverview/" + postId)
      .then((res) => {
        if (res.data.success) {
          return res.data;
        } else {
          return Promise.reject(res.data);
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}

export default new PostCommentService();
