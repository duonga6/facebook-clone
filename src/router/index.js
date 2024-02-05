import { createRouter, createWebHistory, useRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    meta: {
      requiresAuth: true,
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
