/* eslint-disable */
import { defineAsyncComponent } from "vue";
import Dropdown from "primevue/dropdown";
export function registerGlobalComponents(app) {
  // ==== Layout
  app.component(
    "auth-layout",
    defineAsyncComponent(() => import("@/layouts/AuthLayout"))
  );

  app.component(
    "default-layout",
    defineAsyncComponent(() => import("@/layouts/DefaultLayout"))
  );

  app.component(
    "KeyWrapper",
    defineAsyncComponent(() => import("@/components/Utils/KeyWrapper"))
  );

  // ==== POST
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
    defineAsyncComponent(() => import("@/components/Post/PostEditorComponent"))
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
    defineAsyncComponent(() => import("@/components/Post/CreatePostComponent"))
  );

  app.component(
    "CreateComment",
    defineAsyncComponent(() => import("@/components/Post/Component/CreateCommentComponent"))
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

  // === Home

  app.component(
    "HomePost",
    defineAsyncComponent(() => import("@/components/Home/HomePostComponent"))
  );

  app.component(
    "StoryComponent",
    defineAsyncComponent(() => import("@/components/Home/StoryComponent"))
  );

  // === Profile

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

  // === GROUP

  app.component(
    "CreateGroup",
    defineAsyncComponent(() => import("@/components/Group/CreateGroupComponent"))
  );

  app.component(
    "EditGroup",
    defineAsyncComponent(() => import("@/components/Group/EditGroupComponent"))
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

  app.component("drop-down", Dropdown);
}
