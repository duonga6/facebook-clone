import { POST_TYPE } from "@/constants";
import { commentReactionService } from "@/services/comment-reaction.service";
import { groupService } from "@/services/group.service";
import { postCommentService } from "@/services/post-comment.service";
import { postReactionService } from "@/services/post-reaction.service";
import { postService } from "@/services/post.service";
import { userService } from "@/services/user.service";
import { toastAlert } from "@/utilities/toastAlert";

export const PostUtils = {
  async getCommentChild(postId, pageSize, endCursor = null, parentId = null) {
    const commentsRes = await postCommentService.getCursor(
      postId,
      pageSize,
      endCursor,
      parentId
    );

    commentsRes.data = await Promise.all(
      commentsRes.data.reverse().map(async (comment) => {
        const reaction = await commentReactionService.getOverview(comment.id);
        const childCommentCount = await postCommentService.getChildCount(
          comment.id
        );

        comment.reaction = reaction.data;

        comment.childComment = {
          comments: [],
          total: childCommentCount.data,
          pageSize: 10,
          endCursor: null,
          hasNextPage: childCommentCount.data > 0,
        };

        return comment;
      })
    );

    return commentsRes;
  },

  async getPostWithDependent(payLoad) {
    try {
      let postResponse;
      if (payLoad.type == POST_TYPE.HOME_POST) {
        postResponse = await postService.get({
          pageSize: payLoad.pageSize,
          pageNumber: payLoad.pageNumber + 1,
        });
      } else if (payLoad.type == POST_TYPE.PROFILE_POST) {
        postResponse = await userService.getPost(payLoad.userId, {
          pageSize: payLoad.pageSize,
          pageNumber: payLoad.pageNumber + 1,
        });
      } else if (payLoad.type == POST_TYPE.SINGLE_POST) {
        const res = await postService.getById(payLoad.postId);
        postResponse = {
          data: [res.data],
        };
      } else if (payLoad.type == POST_TYPE.GROUP_POST) {
        postResponse = await postService.get({
          pageSize: payLoad.pageSize,
          pageNumber: payLoad.pageNumber + 1,
          groupId: payLoad.groupId,
        });
      }

      // Map post => get comment, reaction, author
      postResponse.data = await Promise.all(
        postResponse.data.map(async (post) => {
          const reactionsRes = await postReactionService.getOverview(post.id);
          const commentsRes = await PostUtils.getCommentChild(
            post.id,
            // Math.floor(Math.random() * 2) + 1
            3
          );
          const totalCommentCount = await postCommentService.getCount(post.id);
          post.comment = {
            comments: commentsRes.data,
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

      return Promise.resolve(postResponse);
    } catch (error) {
      console.log(error);
    }
  },

  async getPostCursorWithDependent(payLoad) {
    let postResponse = {
      data: [],
      hasNextPage: false,
      endCursor: null,
    };
    try {
      switch (payLoad.type) {
        case POST_TYPE.GROUP_FEED:
          postResponse = await groupService.getPostFeed({
            cursor: payLoad.cursor,
            pageSize: payLoad.pageSize,
          });
          break;
        case POST_TYPE.GROUP_POST:
          postResponse = await groupService.getPostCursor(payLoad.groupId, {
            pageSize: payLoad.pageSize,
            cursor: payLoad.cursor,
            searchString: payLoad.searchString,
          });
          break;
        case POST_TYPE.HOME_POST:
          postResponse = await postService.getCursor({
            pageSize: payLoad.pageSize,
            cursor: payLoad.cursor,
          });
          break;
        case POST_TYPE.SEARCH_POST:
          postResponse = await postService.getCursor({
            pageSize: payLoad.pageSize,
            cursor: payLoad.cursor,
            searchString: payLoad.searchString,
          });
          break;
        case POST_TYPE.PROFILE_POST:
          postResponse = await userService.getPostCursor(payLoad.userId, {
            pageSize: payLoad.pageSize,
            cursor: payLoad.cursor,
          });
          break;
        case POST_TYPE.SINGLE_POST: {
          const res = await postService.getById(payLoad.postId);
          postResponse.data = [res.data];
          break;
        }
      }

      // Map to get comment, reaction

      postResponse.data = await Promise.all(
        postResponse.data.map(async (post) => {
          const reactionsRes = await postReactionService.getOverview(post.id);
          const commentsRes = await PostUtils.getCommentChild(
            post.id,
            // Math.floor(Math.random() * 2) + 1
            3
          );
          const totalCommentCount = await postCommentService.getCount(post.id);
          post.comment = {
            comments: commentsRes.data,
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
    } catch (error) {
      console.error(error);
      toastAlert.error("Có lỗi khi tải bài viết");
    }
    return postResponse;
  },
};
