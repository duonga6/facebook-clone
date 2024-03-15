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
    "CreatePost",
    defineAsyncComponent(() => import("@/components/Post/CreatePostComponent"))
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
    "ProfileComponent",
    defineAsyncComponent(() => import("@/components/Profile/ProfileComponent"))
  );

  app.component("drop-down", Dropdown);
}
