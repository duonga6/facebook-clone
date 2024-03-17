import { commentReactionService } from "@/services/comment-reaction.service";
import { postCommentService } from "@/services/post-comment.service";

export const homePostUtils = {
  async getCommentChild(
    postId,
    pageSize,
    parentId = null,
    endCursor = null,
    path = null
  ) {
    const commentsRes = await postCommentService.getCursor(
      postId,
      pageSize,
      endCursor,
      true,
      parentId
    );

    commentsRes.data = await Promise.all(
      commentsRes.data.map(async (comment) => {
        const reaction = await commentReactionService.getOverview(comment.id);
        const childCommentCount = await postCommentService.getChildCount(
          comment.id
        );
        if (!path) {
          comment.path = [comment.id];
        } else {
          comment.path = [...path, comment.id];
        }

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
};
