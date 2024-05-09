import { commentReactionService } from "@/services/comment-reaction.service";
import { postCommentService } from "@/services/post-comment.service";
import { postReactionService } from "@/services/post-reaction.service";
import { postService } from "@/services/post.service";
import { toastAlert } from "@/utilities/toastAlert";
import { PostUtils } from "./postUtils";
import { POST_TYPE } from "@/constants";
import { deepCopy } from "@/utilities";

const defaultState = () => {
  return {
    data: [],
    endCursor: null,
    hasNextPage: true,
    total: 0,
    pageSize: 10,
    postType: null,
    // for group post
    groupId: null,
    // for post profile
    userId: null,
    // for single post,
    postId: null,
    isFetched: false,
  };
};

const createModuleCursor = () => ({
  namespaced: true,
  state: defaultState,
  actions: {
    // #region POST

    initStore({ commit }, payLoad) {
      commit("initStore", payLoad);
    },

    async getPost({ commit, state }) {
      if (state.hasNextPage) {
        const postRes = await PostUtils.getPostCursorWithDependent({
          type: state.postType,
          cursor: state.endCursor,
          pageSize: state.pageSize,
          groupId: state.groupId,
          userId: state.userId,
          postId: state.postId,
        });

        commit("getPostSuccess", postRes);
      }
    },

    async createPost({ commit }, payLoad) {
      try {
        const createPostRes = await postService.create(payLoad);

        const postData = createPostRes.data;

        postData.comment = {
          comments: [],
          pageSize: 5,
          endCursor: null,
          total: 0,
          hasNextPage: false,
          totalComment: 0,
        };

        postData.reaction = {
          reactions: [],
          userReacted: null,
        };

        commit("addPostSuccess", postData);

        return Promise.resolve();
      } catch (error) {
        toastAlert.error(error);
      }
    },

    async updatePost({ commit }, payLoad) {
      try {
        const updatePostRes = await postService.update(
          payLoad.id,
          payLoad.data
        );

        commit("updatePostSuccess", updatePostRes.data);

        return Promise.resolve();
      } catch (err) {
        toastAlert.error(err);
      }
    },

    async deletePost({ commit }, payLoad) {
      try {
        await postService.delete(payLoad.id);
        commit("deletePostSuccess", payLoad.id);
      } catch (err) {
        toastAlert.error("Có lỗi khi xóa post");
        console.error(err);
      }
    },

    async sharePost({ commit }, payLoad) {
      try {
        const res = await postService.sharePost({
          content: payLoad.data.content,
          sharePostId: payLoad.data.sharePostId,
        });

        const postData = res.data;

        postData.comment = {
          comments: [],
          pageSize: 5,
          endCursor: null,
          total: 0,
          hasNextPage: false,
          totalComment: 0,
        };

        postData.reaction = {
          reactions: [],
          userReacted: null,
        };

        commit("addPostSuccess", postData);
      } catch (err) {
        toastAlert.error(err);
      }
    },

    // #endregion

    // #region USER REACTION

    async createUserReaction({ commit }, payLoad) {
      try {
        const createRes = await postReactionService.create(payLoad);

        commit("createUserReactionSuccess", {
          postId: createRes.data.postId,
          data: createRes.data,
        });
      } catch (err) {
        toastAlert.error(err);
      }
    },

    async updateUserReaction({ commit }, payLoad) {
      try {
        const res = await postReactionService.update(payLoad.id, payLoad.data);
        commit("updateUserReactionSuccess", {
          postId: payLoad.postId,
          data: res.data,
          oldReactionId: payLoad.oldReactionId,
        });
      } catch (err) {
        toastAlert.error(err);
      }
    },

    async deleteUserReaction({ commit }, payLoad) {
      try {
        await postReactionService.delete(payLoad.id);

        commit("deletePostReactionSuccess", {
          postId: payLoad.postId,
          reactionId: payLoad.reactionId,
        });
      } catch (error) {
        toastAlert.error(error);
      }
    },

    // #endregion

    // #region COMMENT REACTION

    async createCommentReaction({ commit }, payLoad) {
      try {
        const res = await commentReactionService.create(payLoad.data);
        commit("createCommentReactionSuccess", {
          path: payLoad.path,
          postId: payLoad.postId,
          data: res.data,
        });
      } catch (err) {
        toastAlert.error(err);
      }
    },

    async deleteCommentReaction({ commit }, payLoad) {
      try {
        await commentReactionService.delete(payLoad.commentReactionId);
        commit("deleteCommentReactionSuccess", {
          path: payLoad.path,
          postId: payLoad.postId,
          reactionId: payLoad.reactionId,
        });
      } catch (error) {
        toastAlert.error(error);
      }
    },

    async updateCommentReaction({ commit }, payLoad) {
      try {
        console.log(payLoad);
        const res = await commentReactionService.update(
          payLoad.commentReactionId,
          payLoad.data
        );
        commit("updateCommentReactionSuccess", {
          postId: payLoad.postId,
          path: payLoad.path,
          reactionIdOld: payLoad.reactionIdOld,
          data: res.data,
        });
      } catch (error) {
        toastAlert.error(error);
      }
    },

    // #endregion

    // #region COMMENT

    async createComment({ commit }, payLoad) {
      try {
        const res = await postCommentService.create(payLoad.data);

        commit("createCommentSuccess", {
          path: payLoad.path,
          data: res.data,
        });

        return Promise.resolve();
      } catch (error) {
        toastAlert.error(error);
      }
    },

    async updateComment({ commit }, payLoad) {
      try {
        const updateRes = await postCommentService.update(payLoad.commentId, {
          content: payLoad.content,
        });

        commit("updateCommentSuccess", {
          ...updateRes.data,
          path: payLoad.path,
        });
      } catch (err) {
        console.log(err);
        toastAlert.error("Có lỗi khi chỉnh sửa bình luận");
      }
    },

    async deleteComment({ commit }, payLoad) {
      try {
        await postCommentService.delete(payLoad.commentId);

        commit("deleteCommentSuccess", payLoad);
      } catch (error) {
        console.error(error);
        toastAlert.error("Cõ lỗi khi xóa bình luận");
      }
    },

    setComments({ commit }, payLoad) {
      commit("setComments", payLoad);
    },

    // #endregion

    reset({ commit }) {
      commit("reset");
    },
  },

  mutations: {
    // #region POST

    initStore(
      state,
      {
        pageSize = 10,
        groupId = null,
        userId = null,
        postId = null,
        postType = POST_TYPE.HOME_POST,
      } = {}
    ) {
      state.pageSize = pageSize || 10;
      state.groupId = groupId || null;
      state.userId = userId || null;
      state.postId = postId || null;
      state.postType = postType || POST_TYPE.HOME_POST;
    },

    getPostSuccess(state, payLoad) {
      state.data.push(...payLoad.data);
      state.endCursor = payLoad.endCursor;
      state.hasNextPage = payLoad.hasNextPage;
      state.total = payLoad.totalItems;
      state.isFetched = true;
    },

    addPostSuccess(state, payLoad) {
      state.data = [payLoad, ...state.data];
    },

    updatePostSuccess(state, payLoad) {
      const post = state.data.find((x) => x.id == payLoad.id);
      if (post) {
        post.content = payLoad.content;
        post.postMedias = payLoad.postMedias;
        post.access = payLoad.access;
      }
    },

    deletePostSuccess(state, payLoad) {
      state.data = state.data.filter((x) => x.id != payLoad);
    },

    reset(state) {
      const newState = deepCopy(defaultState());
      Object.assign(state, newState);
    },

    // #endregion

    // #region COMMENT REACTION

    createCommentReactionSuccess(state, payLoad) {
      const path = payLoad.path;
      const postId = payLoad.postId;
      const newReaction = payLoad.data;

      const post = state.data.find((x) => x.id == postId);
      if (post) {
        let commentTarget = post.comment.comments.find((x) => x.id == path[0]);

        for (let i = 1; i < path.length; i++) {
          commentTarget = commentTarget.childComment.comments.find(
            (x) => x.id == path[i]
          );
        }

        // Check xem có reaction này trong reaction comment chưa
        // có rồi thì thêm số lượng
        // chưa có thì tạo mới
        const commentReaction = commentTarget.reaction.reactions.find(
          (x) => x.reactionId == newReaction.reactionId
        );

        if (commentReaction) {
          commentReaction.total++;
        } else {
          commentTarget.reaction.reactions = [
            ...commentTarget.reaction.reactions,
            {
              reactionId: newReaction.reactionId,
              total: 1,
            },
          ];
        }

        // Thêm user reacted
        commentTarget.reaction.userReacted = newReaction;
      }
    },

    deleteCommentReactionSuccess(state, payLoad) {
      const path = payLoad.path;
      const postId = payLoad.postId;
      const reactionIdDeleted = payLoad.reactionId;

      const post = state.data.find((x) => x.id == postId);

      if (post) {
        let commentTarget = post.comment.comments.find((x) => x.id == path[0]);

        for (let i = 1; i < path.length; i++) {
          commentTarget = commentTarget.childComment.comments.find(
            (x) => x.id == path[i]
          );
        }

        // Giảm số lượng reaction, nếu nó = 1 thì xóa luôn
        const commentReaction = commentTarget.reaction.reactions.find(
          (x) => x.reactionId == reactionIdDeleted
        );
        if (commentReaction.total > 1) {
          commentReaction.total--;
        } else {
          commentTarget.reaction.reactions =
            commentTarget.reaction.reactions.filter(
              (x) => x.reactionId != reactionIdDeleted
            );
        }

        commentTarget.reaction.userReacted = null;
      }
    },

    updateCommentReactionSuccess(state, payLoad) {
      const postId = payLoad.postId;
      const path = payLoad.path;
      const reactionIdOld = payLoad.reactionIdOld;
      const newReaction = payLoad.data;

      const post = state.data.find((x) => x.id == postId);

      if (post) {
        let commentTarget = post.comment.comments.find((x) => x.id == path[0]);

        for (let i = 1; i < path.length; i++) {
          commentTarget = commentTarget.childComment.comments.find(
            (x) => x.id == path[i]
          );
        }

        // Giảm số lượng reaction, nếu nó = 1 thì xóa luôn
        const commentReactionOld = commentTarget.reaction.reactions.find(
          (x) => x.reactionId == reactionIdOld
        );
        if (commentReactionOld.total > 1) {
          commentReactionOld.total--;
        } else {
          commentTarget.reaction.reactions =
            commentTarget.reaction.reactions.filter(
              (x) => x.reactionId != reactionIdOld
            );
        }

        // Check xem có reaction này trong reaction comment chưa
        // có rồi thì thêm số lượng
        // chưa có thì tạo mới
        const commentReactionNew = commentTarget.reaction.reactions.find(
          (x) => x.reactionId == newReaction.reactionId
        );

        if (commentReactionNew) {
          commentReactionNew.total++;
        } else {
          commentTarget.reaction.reactions = [
            ...commentTarget.reaction.reactions,
            {
              reactionId: newReaction.reactionId,
              total: 1,
            },
          ];
        }

        // Cập nhật user reacted
        commentTarget.reaction.userReacted = newReaction;
      }
    },

    // #endregion

    // #region POST REACTION
    createUserReactionSuccess(state, payLoad) {
      const post = state.data.find((x) => x.id == payLoad.postId);

      if (post) {
        post.reaction.userReacted = payLoad.data;

        const postReactionItem = post.reaction.reactions.find(
          (x) => x.reactionId == payLoad.data.reactionId
        );

        if (postReactionItem) {
          postReactionItem.total++;
        } else {
          post.reaction.reactions = [
            ...post.reaction.reactions,
            {
              reactionId: payLoad.data.reactionId,
              total: 1,
            },
          ];
        }
      }
    },

    updateUserReactionSuccess(state, payLoad) {
      const post = state.data.find((x) => x.id == payLoad.postId);
      const newUserReaction = payLoad.data;

      if (post) {
        post.reaction.userReacted = newUserReaction;

        const postReactionItemOld = post.reaction.reactions.find(
          (x) => x.reactionId == payLoad.oldReactionId
        );
        if (postReactionItemOld) {
          if (postReactionItemOld.total > 1) {
            postReactionItemOld.total--;
          } else {
            post.reaction.reactions = post.reaction.reactions.filter(
              (x) => x.reactionId != payLoad.oldReactionId
            );
          }
        }

        const postReactionItemNew = post.reaction.reactions.find(
          (x) => x.reactionId == newUserReaction.reactionId
        );
        if (postReactionItemNew) {
          postReactionItemNew.total++;
        } else {
          post.reaction.reactions = [
            ...post.reaction.reactions,
            {
              reactionId: newUserReaction.reactionId,
              total: 1,
            },
          ];
        }
      }
    },

    deletePostReactionSuccess(state, payLoad) {
      const post = state.data.find((x) => x.id == payLoad.postId);

      if (post) {
        post.reaction.userReacted = null;

        const postReactionItem = post.reaction.reactions.find(
          (x) => x.reactionId == payLoad.reactionId
        );

        if (postReactionItem) {
          if (postReactionItem.total > 1) {
            postReactionItem.total--;
          } else {
            post.reaction.reactions = post.reaction.reactions.filter(
              (x) => x.reactionId != payLoad.reactionId
            );
          }
        }
      }
    },

    // #endregion

    // #region COMMENT

    createCommentSuccess(state, payLoad) {
      const post = state.data.find((x) => x.id == payLoad.data.postId);

      if (post) {
        post.comment.totalComment++;
        const newComment = payLoad.data;
        const path = payLoad.path;

        newComment.childComment = {
          comments: [],
          pageSize: 5,
          endCursor: null,
          total: 0,
          hasNextPage: false,
        };

        newComment.reaction = {
          reactions: [],
          userReacted: null,
        };

        // Có path là comment nằm trong comment khác, ngược lại là comment của post
        if (path) {
          let commentParent = post.comment.comments.find(
            (x) => x.id == path[0]
          );
          for (let i = 1; i < path.length; i++) {
            commentParent = commentParent.childComment.comments.find(
              (x) => x.id == path[i]
            );
          }

          if (commentParent.childComment.comments.length == 0) {
            commentParent.childComment.endCursor = newComment.createdAt;
          }

          commentParent.childComment.comments = [
            ...commentParent.childComment.comments,
            newComment,
          ];
          commentParent.childComment.total++;
        } else {
          post.comment.comments = [...post.comment.comments, newComment];
          post.comment.total++;
        }
      }
    },

    updateCommentSuccess(state, payLoad) {
      const post = state.data.find((x) => x.id == payLoad.postId);
      const path = payLoad.path;
      if (post && path) {
        let commentTarget = post.comment.comments.find((x) => x.id == path[0]);

        for (let i = 1; i < path.length; i++) {
          commentTarget = commentTarget.childComment.comments.find(
            (x) => x.id == path[i]
          );
        }

        commentTarget.content = payLoad.content;
      }
    },

    deleteCommentSuccess(state, payLoad) {
      const post = state.data.find((x) => x.id == payLoad.postId);
      const path = payLoad.path;

      if (post && payLoad.path) {
        if (path.length == 1) {
          post.comment.comments = post.comment.comments.filter(
            (x) => x.id != payLoad.commentId
          );
        } else {
          let commentTarget = post.comment.comments.find(
            (x) => x.id == payLoad.commentId
          );

          for (let i = 1; i < payLoad.path.length - 1; i++) {
            commentTarget = commentTarget.childComment.comments.find(
              (x) => x.id == path[i]
            );
          }

          commentTarget.childComment.comments =
            commentTarget.childComment.comments.filter(
              (x) => x.id != payLoad.commentId
            );
        }
      }
    },

    setComments(state, payLoad) {
      const path = payLoad.path;
      const postId = payLoad.postId;
      const commentData = payLoad.data;

      const post = state.data.find((x) => x.id == postId);

      if (post) {
        if (path) {
          let commentTarget = post.comment.comments.find(
            (x) => x.id == path[0]
          );
          for (let i = 1; i < path.length; i++) {
            commentTarget = commentTarget.childComment.comments.find(
              (x) => x.id == path[i]
            );
          }

          commentTarget.childComment.comments = [
            ...commentData.data,
            ...commentTarget.childComment.comments,
          ];

          commentTarget.childComment.hasNextPage = commentData.hasNextPage;
          commentTarget.childComment.endCursor = commentData.endCursor;
          commentTarget.childComment.total = commentData.totalItems;
        } else {
          post.comment.comments = [
            ...commentData.data,
            ...post.comment.comments,
          ];
          post.comment.hasNextPage = commentData.hasNextPage;
          post.comment.endCursor = commentData.endCursor;
          post.comment.total = commentData.totalItems;
        }
      }
    },

    // #endregion
  },
  getters: {
    // #region POST
    getPosts(state) {
      return state;
    },

    getPostById: (state) => (id) => state.data.find((item) => item.id == id),

    // #endregion
  },
});

export default createModuleCursor;
