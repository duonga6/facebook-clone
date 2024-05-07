import { commentReactionService } from "@/services/comment-reaction.service";
import { postCommentService } from "@/services/post-comment.service";
import { postReactionService } from "@/services/post-reaction.service";
import { postService } from "@/services/post.service";
import { toastAlert } from "@/utilities/toastAlert";

const createModule = () => ({
  namespaced: true,
  state: {
    data: [],
    _isFetched: false,
  },
  actions: {
    // #region POST

    setPosts({ commit }, payLoad) {
      commit("setPosts", payLoad);
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

        commit("createPostSuccess", postData);

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

        commit("createPostSuccess", postData);
      } catch (err) {
        console.error(err);
        toastAlert.error("Có lỗi khi tạo bài viết");
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
        console.error(err);
        toastAlert.error("Có lỗi khi bày tỏ cảm xúc");
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
        console.error(err);
        toastAlert.error("Có lỗi khi bày tỏ cảm xúc");
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
        console.error(error);
        toastAlert.error("Có lỗi khi bày tỏ cảm xúc");
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
        console.error(err);
        toastAlert.error("Có lỗi khi bày tỏ cảm xúc");
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
        console.error(error);
        toastAlert.error("Có lỗi khi bày tỏ cảm xúc");
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
        console.error(error);
        toastAlert.error("Có lỗi khi bày tỏ cảm xúc");
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
        console.error(error);
        toastAlert.error("Có lỗi khi tạo bình luận");
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
    setPosts(state, payLoad) {
      state.data = [...state.data, ...payLoad];
      state._isFetched = true;
    },

    createPostSuccess(state, payLoad) {
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
      state.data = [];
      state._isFetched = false;
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

    // #endregion
  },
  getters: {
    // #region POST
    getPosts(state) {
      return state.data;
    },

    getFecthStatus(state) {
      return state._isFetched;
    },

    // #endregion
  },
});

export default createModule;
