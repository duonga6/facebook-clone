import api from "./api";

class PostService {
  // Post
  getPost(pageSize, pageNumber, searchString) {
    let url = `/Posts?pageSize=${pageSize}&pageNumber=${pageNumber}`;

    if (searchString) {
      url += `&searchString=${searchString}`;
    }

    return api
      .get(url)
      .then((response) => {
        if (response.data.success) {
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
  // Reaction
  getReaction(postId) {
    return api
      .get("/PostReactions/GetByPost/" + postId)
      .then((response) => {
        if (response.data.success) {
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  getUserReaction(postId) {
    return api
      .get("/PostReactions/GetByUser?postId=" + postId)
      .then((response) => {
        if (response.data.success) {
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  createPostReaction(request) {
    return api.post("/PostReactions", request).then(
      (response) => {
        if (response.data.success) {
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  updatePostReaction(request) {
    return api
      .put("/PostReactions", request)
      .then((response) => {
        if (response.data.success) {
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  deletePostReaction(postId) {
    return api
      .delete("/PostReactions/" + postId)
      .then((res) => {
        if (res.data.success) {
          return res.data;
        } else {
          Promise.reject(res.data);
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  // Comment
  getCountComment(postId) {
    return api
      .get(`/PostComments/GetCount?postId=${postId}`)
      .then((response) => {
        if (response.data.success) {
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

export default new PostService();
