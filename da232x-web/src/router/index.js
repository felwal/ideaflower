import { createRouter, createWebHistory } from "vue-router";

import MainPresenter from "../presenters/mainPresenter";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainPresenter
    }
  ],
})

export default router;
