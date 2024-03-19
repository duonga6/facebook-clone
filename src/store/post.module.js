import { commentReactionService } from "@/services/comment-reaction.service";
import { postCommentService } from "@/services/post-comment.service";
import { postReactionService } from "@/services/post-reaction.service";
import { postService } from "@/services/post.service";
import { userService } from "@/services/user.service";
import { PostUtils } from "./postUtils";
import { POST_TYPE } from "@/constants";

export const post = {
  namespaced: true,
  state: {
    total: 0,
    posts: [],
    pageNumber: 0,
    pageSize: 20,
  },
  actions: {
    // Post
    async getPost({ commit, state }, payLoad) {
      try {
        let postResponse;
        if (payLoad.postType == POST_TYPE.HOME_POST) {
          postResponse = await postService.get(
            state.pageSize,
            state.pageNumber + 1
          );
        } else if (payLoad.postType == POST_TYPE.PROFILE_POST) {
          postResponse = await userService.getPost(payLoad.userId, {
            pageSize: state.pageSize,
            pageNumber: state.pageNumber + 1,
          });
        } else if (payLoad.postType == POST_TYPE.SINGLE_POST) {
          const res = await postService.getById(payLoad.postId);
          postResponse = {
            totalItems: 1,
            data: [res.data],
          };
        }

        // Map post => get comment, reaction, author
        const postMapped = await Promise.all(
          postResponse.data.map(async (post) => {
            const reactionsRes = await postReactionService.getOverview(post.id);
            const commentsRes = await PostUtils.getCommentChild(
              post.id,
              Math.floor(Math.random() * 2) + 1
            );
            const totalCommentCount = await postCommentService.getCount(
              post.id
            );

            post.comment = {
              comments: commentsRes.data.reverse(),
              pageSize: 5,
              endCursor: commentsRes.endCursor,
              total: commentsRes.totalItems,
              hasNextPage: commentsRes.hasNextPage,
              totalComment: totalCommentCount.data,
            };

            post.reaction = reactionsRes.data;

            return post;
          })
        );

        commit("getPostSuccess", {
          data: postMapped,
          total: postResponse.totalItems,
        });

        return Promise.resolve();
      } catch (error) {
        console.log(error);
      }
    },
    async createPost({ commit }, payLoad) {
      try {
        const createPostRes = await postService.create(payLoad);
        if (createPostRes.success) {
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
            reactionTypes: [],
            total: 0,
            userReacted: null,
          };

          commit("addPostSuccess", postData);
          return Promise.resolve();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async updatePost({ commit }, payLoad) {
      const updatePostRes = await postService.update(payLoad.id, payLoad.data);
      if (updatePostRes.success) {
        commit("updatePostSuccess", updatePostRes.data);
        return Promise.resolve();
      }
    },
    // User Reaction
    async createUserReaction({ commit }, payLoad) {
      try {
        const res = await postReactionService.create(payLoad);
        if (res.success) {
          const updateReaction = await postReactionService.getOverview(
            res.data.postId
          );
          commit("updatePostReaction", {
            reaction: updateReaction.data,
            postId: res.data.postId,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async updateUserReaction({ commit }, payLoad) {
      try {
        const res = await postReactionService.update(
          payLoad.postReactionId,
          payLoad.data
        );
        if (res.success) {
          const updateReaction = await postReactionService.getOverview(
            res.data.postId
          );
          commit("updatePostReaction", {
            reaction: updateReaction.data,
            postId: res.data.postId,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async deleteUserReacted({ commit }, payLoad) {
      try {
        const res = await postReactionService.delete(payLoad.postReactionId);
        if (res.success) {
          const updateReaction = await postReactionService.getOverview(
            payLoad.postId
          );

          commit("updatePostReaction", {
            reaction: updateReaction.data,
            postId: payLoad.postId,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    // Comment reaction
    async deleteCommentReaction({ commit }, payLoad) {
      try {
        const res = await commentReactionService.delete(
          payLoad.commentReactionId
        );
        if (res.success) {
          const reactionUpdate = await commentReactionService.getOverview(
            payLoad.path[payLoad.path.length - 1]
          );

          commit("updateCommentReaction", {
            path: payLoad.path,
            data: reactionUpdate.data,
            postId: payLoad.postId,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async createCommentReaction({ commit }, payLoad) {
      try {
        const res = await commentReactionService.create(payLoad.data);
        if (res.success) {
          const reactionUpdate = await commentReactionService.getOverview(
            payLoad.path[payLoad.path.length - 1]
          );

          commit("updateCommentReaction", {
            path: payLoad.path,
            data: reactionUpdate.data,
            postId: payLoad.postId,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async updateCommentReaction({ commit }, payLoad) {
      try {
        const res = await commentReactionService.update(
          payLoad.commentReactionId,
          payLoad.data
        );
        if (res.success) {
          const reactionUpdate = await commentReactionService.getOverview(
            payLoad.path[payLoad.path.length - 1]
          );

          commit("updateCommentReaction", {
            path: payLoad.path,
            data: reactionUpdate.data,
            postId: payLoad.postId,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // Comment
    async createComment({ commit }, payLoad) {
      try {
        const createCommentRes = await postCommentService.create(payLoad.data);
        if (createCommentRes.success) {
          const authorcreateCommentRes = await userService.getById(
            createCommentRes.data.userId
          );
          createCommentRes.data.user = authorcreateCommentRes.data;
          commit("createCommentSuccess", {
            path: payLoad.path,
            data: createCommentRes.data,
          });
          return true;
        } else {
          console.log(createCommentRes.errors);
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async deleteComment({ commit }, payLoad) {
      try {
        const res = await postCommentService.delete(payLoad.commentId);
        if (res.success) {
          commit("deleteCommentSuccess", {
            path: payLoad.path,
            postId: payLoad.postId,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getComment({ commit }, payLoad) {
      try {
        const commentRes = await PostUtils.getCommentChild(
          payLoad.postId,
          payLoad.pageSize,
          payLoad.parentId,
          payLoad.endCursor,
          payLoad.path
        );

        if (commentRes.success) {
          commit("getCommentSuccess", {
            response: commentRes,
            path: payLoad.path,
            postId: payLoad.postId,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // Reset
    reset({ commit }) {
      commit("reset");
    },
  },
  mutations: {
    reset(state) {
      state.posts = [];
      state.total = 0;
      state.pageNumber = 0;
    },
    // ===== POST
    getPostSuccess(state, payLoad) {
      state.posts = [...state.posts, ...payLoad.data];
      state.total = payLoad.total;
      state.pageNumber++;
    },
    updatePostSuccess(state, payLoad) {
      const post = state.posts.find((x) => x.id == payLoad.id);
      if (post) {
        post.content = payLoad.content;
        post.postMedias = payLoad.postMedias;
      }
    },
    // ==== Post reaction       =========
    updatePostReaction(state, payLoad) {
      const post = state.posts.find((x) => x.id == payLoad.postId);
      if (post) {
        post.reaction = payLoad.reaction;
      }
    },
    // ==== Comment reaction    =========
    updateCommentReaction(state, payLoad) {
      const post = state.posts.find((x) => x.id == payLoad.postId);
      if (post) {
        const path = payLoad.path;
        let comment = post.comment.comments.find((x) => x.id == path[0]);
        for (let i = 1; i < path.length; i++) {
          comment = comment.childComment.comments.find((x) => x.id == path[i]);
        }

        if (comment != null) {
          comment.reaction = payLoad.data;
        }
      }
    },
    // ==== Post comment        =========
    createCommentSuccess(state, payLoad) {
      const post = state.posts.find((x) => x.id == payLoad.data.postId);
      if (post) {
        const path = payLoad.path;
        payLoad.data.childComment = {
          comments: [],
          pageSize: 5,
          endCursor: null,
          total: 0,
          hasNextPage: false,
        };
        if (path) {
          let comment = post.comment.comments.find((x) => x.id == path[0]);
          for (let i = 1; i < path.length; i++) {
            comment = comment.childComment.comments.find(
              (x) => x.id == path[i]
            );
          }

          payLoad.data.path = [...path, payLoad.data.id];

          comment.childComment.comments = [
            ...comment.childComment.comments,
            payLoad.data,
          ];
          comment.childComment.total++;
          comment.childComment.endCursor = payLoad.data.createdAt;
        } else {
          payLoad.data.path = [payLoad.data.id];
          post.comment.comments = [...post.comment.comments, payLoad.data];
          post.comment.total++;
          post.comment.endCursor = payLoad.data.createdAt;
        }
      }
    },
    deleteCommentSuccess(state, payLoad) {
      const post = state.posts.find((x) => x.id == payLoad.postId);
      if (post) {
        const path = payLoad.path;
        if (path.length == 1) {
          post.comment.comments = post.comment.comments.filter(
            (x) => x.id != path[0]
          );
          post.comment.total--;
        } else {
          let comment = post.comment.comments.find((x) => x.id == path[0]);
          for (let i = 1; i < path.length - 1; i++) {
            comment = comment.childComment.comments.find(
              (x) => x.id == path[i]
            );
          }

          comment.childComment.comments = comment.childComment.comments.filter(
            (x) => x.id != path[path.length - 1]
          );

          comment.childComment.total--;
        }
        post.comment.totalComment--;
      }
    },
    //      =====    Path == null ? add comment for post : add comment for comment (child);
    getCommentSuccess(state, payLoad) {
      const post = state.posts.find((x) => x.id == payLoad.postId);
      if (post) {
        const path = payLoad.path;
        let targetComment;
        if (path) {
          let comment = post.comment.comments.find((x) => x.id == path[0]);
          for (let i = 1; i < path.length; i++) {
            comment = comment.childComment.comments.find(
              (x) => x.id == path[i]
            );
          }
          targetComment = comment.childComment;
        } else {
          targetComment = post.comment;
        }

        console.log(targetComment);

        targetComment.comments = [
          ...payLoad.response.data.reverse(),
          ...targetComment.comments,
        ];

        targetComment.total = payLoad.response.totalItems;
        targetComment.endCursor = payLoad.response.endCursor;
        targetComment.hasNextPage = payLoad.response.hasNextPage;
      }
    },
    addPostSuccess(state, payLoad) {
      state.posts = [payLoad, ...state.posts];
      state.total++;
    },
  },
  getters: {
    getState(state) {
      return state;
    },
    getPosts(state) {
      return state.posts;
    },
  },
};
