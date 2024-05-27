/* eslint-disable */
import { defineAsyncComponent } from "vue";
import Dropdown from "primevue/dropdown";
import Divider from 'primevue/divider';
import Paginator from "primevue/paginator";

export function registerGlobalComponents(app) {
  // #region ==== Layout
  app.component(
    "auth-layout",
    defineAsyncComponent(() => import("@/layouts/AuthLayout"))
  );

  app.component(
    "default-layout",
    defineAsyncComponent(() => import("@/layouts/DefaultLayout"))
  );

  app.component(
    "admin-layout",
    defineAsyncComponent(() => import("@/layouts/AdminLayout"))
  );

  app.component(
    "KeyWrapper",
    defineAsyncComponent(() => import("@/components/Utils/KeyWrapper"))
  );

  // #endregion

  // #region ==== POST
  app.component(
    "CommentComponent",
    defineAsyncComponent(() =>
      import("@/components/Post/Comment/CommentComponent")
    )
  );

  app.component(
    "ReactionComponent",
    defineAsyncComponent(() =>
      import("@/components/Post/Reaction/ReactionComponent")
    )
  );

  app.component(
    "LoadingComponent",
    defineAsyncComponent(() => import("@/components/Utils/LoadingComponent"))
  );

  app.component(
    "PostEditor",
    defineAsyncComponent(() => import("@/components/Post/Component/PostEditorComponent"))
  );

  app.component(
    "PostComponent",
    defineAsyncComponent(() => import("@/components/Post/PostComponent"))
  );

  app.component(
    "PostDetailControl",
    defineAsyncComponent(() => import("@/components/Post/PostDetailControl"))
  );

  app.component(
    "PostDetailComponent",
    defineAsyncComponent(() => import("@/components/Post/PostDetailComponent"))
  );

  app.component(
    "CreatePost",
    defineAsyncComponent(() => import("@/components/Post/Component/CreatePostComponent"))
  );

  app.component(
    "CreateComment",
    defineAsyncComponent(() => import("@/components/Post/Comment/CreateCommentComponent"))
  );

  app.component(
    "EditComment",
    defineAsyncComponent(() => import("@/components/Post/Comment/EditCommentComponent"))
  );

  app.component(
    "PostHeader",
    defineAsyncComponent(() => import("@/components/Post/Component/PostHeaderComponent"))
  );

  app.component(
    "PostMedia",
    defineAsyncComponent(() => import("@/components/Post/Component/PostMediaComponent"))
  );

  app.component(
    "PostComment",
    defineAsyncComponent(() => import("@/components/Post/Component/PostCommentComponent"))
  );

  app.component(
    "Gallery",
    defineAsyncComponent(() => import("@/components/Post/Component/GalleryComponent"))
  );

  app.component(
    "PostContent",
    defineAsyncComponent(() => import("@/components/Post/Component/PostContentComponent"))
  );

  app.component(
    "PostShare",
    defineAsyncComponent(() => import("@/components/Post/PostShareComponent"))
  );

  app.component(
    "DragFile",
    defineAsyncComponent(() => import("@/components/Utils/DragFileComponent"))
  );

  app.component(
    "SelectGroupShare",
    defineAsyncComponent(() => import("@/components/Post/Component/SelectGroupShare"))
  );

  // #endregion

  // #region === Home

  app.component(
    "HomePost",
    defineAsyncComponent(() => import("@/components/Home/HomePostComponent"))
  );

  app.component(
    "StoryComponent",
    defineAsyncComponent(() => import("@/components/Home/StoryComponent"))
  );

  // #endregion

  // #region === Profile

  app.component(
    "ProfileView",
    defineAsyncComponent(() => import("@/views/ProfileView"))
  );

  app.component(
    "ProfileComponent",
    defineAsyncComponent(() => import("@/components/Profile/ProfileComponent"))
  );

  app.component(
    "ProfilePost",
    defineAsyncComponent(() => import("@/components/Profile/ProfilePostComponent"))
  );

  app.component(
    "ProfilePhoto",
    defineAsyncComponent(() => import("@/components/Profile/ProfilePhotoComponent"))
  );

  app.component(
    "ProfileFriend",
    defineAsyncComponent(() => import("@/components/Profile/ProfileFriendComponent"))
  );

  app.component(
    "EditProfile",
    defineAsyncComponent(() => import("@/components/Profile/EditProfileComponent"))
  );

  app.component(
    "ChangePassword",
    defineAsyncComponent(() => import("@/components/Profile/ChangePasswordComponent"))
  );

  // #endregion

  // #region === GROUP

  app.component(
    "GroupMain",
    defineAsyncComponent(() => import("@/components/Group/GroupMainComponent"))
  );

  app.component(
    "CreateGroup",
    defineAsyncComponent(() => import("@/components/Group/Component/CreateGroupComponent"))
  );

  app.component(
    "EditGroup",
    defineAsyncComponent(() => import("@/components/Group/Component/EditGroupComponent"))
  );

  app.component(
    "GroupDetails",
    defineAsyncComponent(() => import("@/components/Group/Details/GroupDetailsComponent"))
  );

  app.component(
    "GroupHeader",
    defineAsyncComponent(() => import("@/components/Group/Details/GroupHeaderComponent"))
  );

  app.component(
    "GroupCreatePostOverlay",
    defineAsyncComponent(() => import("@/components/Group/Details/GroupDiscuss/GroupCreatePostOverlayComponent"))
  );

  app.component(
    "GroupCreatePost",
    defineAsyncComponent(() => import("@/components/Group/Details/GroupDiscuss/GroupCreatePostComponent"))
  );

  app.component(
    "GroupPost",
    defineAsyncComponent(() => import("@/components/Group/Details/GroupDiscuss/GroupPostComponent"))
  );

  app.component(
    "GroupManager",
    defineAsyncComponent(() => import("@/components/Group/Details/GroupManager/GroupManagerComponent"))
  );

  app.component(
    "PostFeed",
    defineAsyncComponent(() => import("@/components/Group/Feed/PostFeedComponent"))
  );

  // #endregion

  // #region === Conversation

  app.component(
    "MessageWindow",
    defineAsyncComponent(() => import("@/components/Messages/MessageWindowComponent"))
  );

  app.component(
    "CreateConversationGroup",
    defineAsyncComponent(() => import("@/components/Messages/Component/CreateConversationComponent"))
  );

  app.component(
    "EditContactName",
    defineAsyncComponent(() => import("@/components/Messages/Component/EditContactNameComponent"))
  );

  app.component(
    "ConversationParticipant",
    defineAsyncComponent(() => import("@/components/Messages/Component/ConversationParticipantComponent"))
  );

  app.component(
    "AddParticipant",
    defineAsyncComponent(() => import("@/components/Messages/Component/AddParticipantComponent"))
  );

  app.component(
    "LeaveConversation",
    defineAsyncComponent(() => import("@/components/Messages/Component/LeaveGroupComponent"))
  );

  app.component(
    "ConfirmDeleteConversation",
    defineAsyncComponent(() => import("@/components/Messages/Component/ConfirmDeleteConversationComponent"))
  );

  // #endregion

  // #region === SEARCH

  app.component(
    "SearchComponent",
    defineAsyncComponent(() => import("@/components/Search/SearchComponent"))
  );

  // #endregion

  // #region === Manager

  app.component("UserManager",
    defineAsyncComponent(() => import("@/components/Admin/Manager/UserManagerComponent")))

  app.component("GroupManager",
    defineAsyncComponent(() => import("@/components/Admin/Manager/GroupManagerComponent")))

  app.component("PostManager",
    defineAsyncComponent(() => import("@/components/Admin/Manager/PostManagerComponent")))

  app.component("ReportManager",
    defineAsyncComponent(() => import("@/components/Admin/Manager/ReportManagerComponent")))

  app.component("ReportDetail",
    defineAsyncComponent(() => import("@/components/Admin/Manager/ReportDetailComponent")))

  // #endregion

  // #region == PrimeVue
  app.component("drop-down", Dropdown);
  app.component("Divider", Divider);
  app.component("Paginator", Paginator);

  // #endregion

  // #region === Utilities component
  app.component("DotSplit",
    defineAsyncComponent(() => import("@/components/Utils/DotSplitComponent")))

  app.component("Badge",
    defineAsyncComponent(() => import("@/components/Utils/BadgeComponent")))

  app.component("AccessIcon",
    defineAsyncComponent(() => import("@/components/Utils/AccessIconComponent")))

  app.component("TriangleArrow",
    defineAsyncComponent(() => import("@/components/Utils/TriangleArrowBorder")))

  app.component("ModalConfirm",
    defineAsyncComponent(() => import("@/components/Utils/ModalConfirmComponent")))


  app.component("ReportComponent",
    defineAsyncComponent(() => import("@/components/Utils/ReportComponent")))

  // #endregion
}
