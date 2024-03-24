/* eslint-disable */
import api from "./api";

const BASE_URL = "/PostComments";

export const postCommentService = {
  get(postId, pageSize, pageNumber, searchString) {
    return api
      .get(
        `${BASE_URL}?postId=${postId}&pageSize=${pageSize}&pageNumber=${pageNumber}&searchString=${searchString ?? ""}`
      )
      .catch((err) => {
        throw new Error(`Error post comment service ${err}`);
      });
  },
  getCursor(postId, pageSize, endCursor, parentId = null, desc = true) {
    return api.get(`${BASE_URL}/GetCursor?postId=${postId}&pageSize=${pageSize}&desc=${desc}&endCursor=${endCursor ?? ""}&parentId=${parentId ?? ""}`)
      .catch((err) => {
        throw new Error(`Error post comment service ${err}`);
      });
  },
  getCount(postId) {
    return api.get(`${BASE_URL}/GetCount/${postId}`).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },
  getChildCount(commetId) {
    return api.get(`${BASE_URL}/${commetId}/GetChildCount`).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },
  getChildComment(commentId, pageSize, pageNumber, searchString) {
    return api.get(`${BASE_URL}/${commentId}/GetChild?pageSize=${pageSize}&pageNumber=${pageNumber}&searchString=${searchString ?? ""}`)
      .catch((err) => {
        throw new Error(`Error post comment service ${err}`);
      });
  },
  create(data) {
    return api.post(`${BASE_URL}`, data).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },
  delete(commetId) {
    return api.delete(`${BASE_URL}/${commetId}`).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
  },
};
