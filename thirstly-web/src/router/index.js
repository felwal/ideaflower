import { createRouter, createWebHistory } from "vue-router";

import MainPresenter from "../presenters/mainPresenter";
import ProfilePresenter from "../presenters/profilePresenter";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainPresenter
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePresenter
    }
  ],
})

export default router;
