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
            /* webpackChunkName: "group-feed" */ "@/components/Group/FeedComponent.vue"
          ),
      },
    ],
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
