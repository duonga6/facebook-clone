import { FRIEND_TYPE } from "@/constants";
import { createRouter, createWebHistory, useRouter } from "vue-router";

const routes = [
  {
    path: "/home",
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
    children: [
      {
        name: "profile-post",
        path: "post",
        component: () =>
          import(
            /* webpackChunkName: "profile-post" */ "@/components/Profile/ProfilePostComponent.vue"
          ),
        props: (route) => ({ userId: route.params.id }),
      },
      {
        name: "profile-photo",
        path: "photo",
        component: () =>
          import(
            /* webpackChunkName: "profile-photo" */ "@/components/Profile/ProfilePhotoComponent.vue"
          ),
      },
      {
        name: "profile-friend",
        path: "friends",
        component: () =>
          import(
            /* webpackChunkName: "profile-friend" */ "@/components/Profile/ProfileFriendComponent.vue"
          ),
      },
    ],
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
    name: "friend-request",
    meta: {
      requiresAuth: true,
      layout: "default",
    },
    component: () =>
      import(
        /* webpackChunkName: "friendsuggest" */ "../views/Friend/FriendDetailsView.vue"
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
        /* webpackChunkName: "friendsuggest" */ "../views/Friend/FriendDetailsView.vue"
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
        /* webpackChunkName: "friendsuggest" */ "../views/Friend/FriendDetailsView.vue"
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
        /* webpackChunkName: "friendsuggest" */ "../views/PostDetailView.vue"
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
