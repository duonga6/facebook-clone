import { FRIEND_TYPE, GROUP_TYPE } from "@/constants";
import { createRouter, createWebHistory, useRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/HomeView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: {
      layout: "auth",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Auth/LoginView.vue"),
  },
  {
    path: "/profile/:id?",
    name: "profile",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/ProfileView.vue"),
  },
  {
    path: "/friends",
    name: "friends",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(/* webpackChunkName: "friend" */ "@/views/Friend/FriendView.vue"),
  },
  {
    path: "/friends/request",
    name: "friends-request",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(
        /* webpackChunkName: "friend-request" */ "../views/Friend/FriendDetailsView.vue"
      ),
    props: {
      friendType: FRIEND_TYPE.PENDING_OTHER,
    },
  },
  {
    path: "/friends/suggests",
    name: "friends-suggests",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(
        /* webpackChunkName: "friend-suggest" */ "../views/Friend/FriendDetailsView.vue"
      ),
    props: {
      friendType: FRIEND_TYPE.NOT_FRIEND,
    },
  },
  {
    path: "/friends/list",
    name: "friends-list",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(
        /* webpackChunkName: "friend-list" */ "../views/Friend/FriendDetailsView.vue"
      ),
    props: {
      friendType: FRIEND_TYPE.ACCEPTED,
    },
  },
  {
    path: "/post/:id",
    name: "post-detail",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(
        /* webpackChunkName: "post-detail" */ "../views/PostDetailView.vue"
      ),
  },
  {
    path: "/group/:id",
    name: "group-details",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(
        /* webpackChunkName: "group-details" */ "@/views/Group/GroupDetailsView.vue"
      ),
    children: [
      {
        path: "",
        name: "group-details-post",
        meta: {
          requiresAuth: true,
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "group-details-post" */ "@/components/Group/Details/GroupDiscuss/GroupDiscussComponent.vue"
          ),
      },
      {
        path: "member",
        name: "group-details-member",
        meta: {
          requiresAuth: true,
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "group-details-member" */ "@/components/Group/Details/GroupMember/GroupMemberComponent.vue"
          ),
      },
      {
        path: "media",
        name: "group-details-media",
        meta: {
          requiresAuth: true,
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "group-details-member" */ "@/components/Group/Details/GroupMedia/GroupMediaComponent.vue"
          ),
      },
      {
        path: "manager",
        name: "group-details-manager",
        meta: {
          requiresAuth: true,
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "group-details-managner" */ "@/components/Group/Details/GroupManager/GroupManagerComponent.vue"
          ),
      },
    ],
  },
  {
    path: "/groups",
    name: "group",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(/* webpackChunkName: "group" */ "@/views/Group/GroupView.vue"),
    children: [
      {
        path: "joined",
        name: "group-joined",
        meta: {
          requiresAuth: true,
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "group-joind" */ "@/components/Group/GroupJoinedComponent.vue"
          ),
      },
      {
        path: "search",
        name: "group-search",
        meta: {
          requiresAuth: true,
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "group-search" */ "@/components/Group/GroupSearchComponent.vue"
          ),
      },
      {
        path: "group-manage",
        name: "group-manage",
        meta: {
          requiresAuth: true,
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "group-manage" */ "@/components/Group/GroupJoinedComponent.vue"
          ),
        props: {
          groupType: GROUP_TYPE.MANAGE_BY_ME,
        },
      },
      {
        path: "feed",
        name: "group-feed",
        meta: {
          requiresAuth: true,
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "group-feed" */ "@/components/Group/Feed/FeedComponent.vue"
          ),
      },
      {
        path: ":id",
        name: "group-details-preview",
        meta: {
          requiresAuth: true,
          layout: "default",
        },
        component: () =>
          import(
            /* webpackChunkName: "group-details-preview" */ "@/components/Group/GroupDetailPreview.vue"
          ),
        children: [
          {
            path: "",
            name: "group-details-preview-post",
            meta: {
              requiresAuth: true,
              layout: "default",
            },
            component: () =>
              import(
                /* webpackChunkName: "group-details-preview-post" */ "@/components/Group/Details/GroupDiscuss/GroupDiscussComponent.vue"
              ),
          },
        ],
      },
    ],
  },
  {
    path: "/search",
    name: "search",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(
        /* webpackChunkName: "search-component" */ "../views/SearchView.vue"
      ),
  },
  {
    path: "/not-found",
    name: "not-found",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(/* webpackChunkName: "not-found" */ "../views/NotFoundView.vue"),
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    meta: {
      requiresAuth: false,
      layout: "auth",
    },
    component: () =>
      import(
        /* webpackChunkName: "forgot-password" */ "../views/Auth/ForgotPasswordView.vue"
      ),
  },
  {
    path: "/reset-password",
    name: "reset-password",
    meta: {
      requiresAuth: false,
      layout: "auth",
    },
    component: () =>
      import(
        /* webpackChunkName: "reset-password" */ "../views/Auth/ResetPasswordView.vue"
      ),
  },
  {
    path: "/confirm-email",
    name: "confirm-email",
    meta: {
      requiresAuth: false,
      layout: "auth",
    },
    component: () =>
      import(
        /* webpackChunkName: "confirm-email" */ "../views/Auth/ConfirmEmailView.vue"
      ),
  },
  {
    path: "/dashboards",
    name: "dashboard-page",
    meta: {
      requiresAuth: true,
      layout: "admin",
    },
    component: () =>
      import(
        /* webpackChunkName: "reset-password" */ "../views/Admin/DashboardView.vue"
      ),
  },
  {
    path: "/dashboards/user",
    name: "admin-user-page",
    meta: {
      requiresAuth: false,
      layout: "admin",
    },
    component: () =>
      import(
        /* webpackChunkName: "admin-user-page" */ "../views/Admin/UserView.vue"
      ),
  },
  {
    path: "/dashboards/group",
    name: "admin-group-page",
    meta: {
      requiresAuth: false,
      layout: "admin",
    },
    component: () =>
      import(
        /* webpackChunkName: "admin-group-page" */ "../views/Admin/GroupView.vue"
      ),
  },
  {
    path: "/dashboards/post",
    name: "admin-post-page",
    meta: {
      requiresAuth: false,
      layout: "admin",
    },
    component: () =>
      import(
        /* webpackChunkName: "admin-post-page" */ "../views/Admin/PostView.vue"
      ),
  },
  {
    path: "/dashboards/report",
    name: "admin-report-page",
    meta: {
      requiresAuth: false,
      layout: "admin",
    },
    component: () =>
      import(
        /* webpackChunkName: "admin-report-page" */ "../views/Admin/ReportView.vue"
      ),
  },
  {
    path: "/dashboards/report/:id",
    name: "admin-report-detail-page",
    meta: {
      requiresAuth: false,
      layout: "admin",
    },
    component: () =>
      import(
        /* webpackChunkName: "admin-report-detail-page" */ "../views/Admin/ReportDetailView.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("user");

    if (!token) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export function redirectToLogin() {
  const router = useRouter();
  router.push({ name: "login", params: {} });
}

export default router;
