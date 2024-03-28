import { NOTIFICATION_TYPE } from "@/constants";
import { postCommentService } from "@/services/post-comment.service";
import { toastAlert } from "./toastAlert";

export async function generateNotificationUrl(data) {
  let router;
  switch (data.notificationType) {
    case NOTIFICATION_TYPE.POST_REACTION:
      router = {
        name: "post-detail",
        params: {
          id: data.jsonDetail.PostId,
        },
      };
      break;
    case NOTIFICATION_TYPE.POST_COMMENT:
      router = {
        name: "post-detail",
        params: {
          id: data.jsonDetail.PostId,
        },
        query: {
          commentId: data.jsonDetail.Id,
        },
      };
      break;

    case NOTIFICATION_TYPE.COMMENT_REACTION:
      try {
        const comment = await postCommentService.getById(
          data.jsonDetail.CommentId
        );

        router = {
          name: "post-detail",
          params: {
            id: comment.data.postId,
          },
          query: {
            commentId: data.jsonDetail.CommentId,
          },
        };
      } catch (err) {
        toastAlert.error(err);
      }

      break;
    case NOTIFICATION_TYPE.CREATE_POST:
      router = {
        name: "post-detail",
        params: {
          id: data.jsonDetail.Id,
        },
      };
      break;
    case NOTIFICATION_TYPE.SHARE_POST:
      router = {
        name: "post-detail",
        params: {
          id: data.jsonDetail.Id,
        },
      };
      break;
    case NOTIFICATION_TYPE.FRIEND_REQUEST:
      router = {
        name: "friend-request",
        query: {
          id: data.jsonDetail.Id,
        },
      };
      break;
  }

  return router;
}
