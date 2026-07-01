import { createRouter, createWebHistory } from "vue-router";
import DetailPresenter from "@/presenters/DetailPresenter";
import HomePresenter from "@/presenters/HomePresenter";
import NotFoundPresenter from "@/presenters/NotFoundPresenter";
import ProfilePresenter from "@/presenters/ProfilePresenter";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePresenter,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePresenter,
    },
    {
      path: "/idea/:id",
      name: "detail",
      component: DetailPresenter,
      props: true,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: NotFoundPresenter,
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    // don't keep scroll position between different pages
    if (savedPosition) {
      return savedPosition;
    }
    else {
      return {top: 0};
    }
  },
});

export default router;
