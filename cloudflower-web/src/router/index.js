import { createRouter, createWebHistory } from "vue-router";
import HomePresenter from "@/presenters/HomePresenter";
import ProfilePresenter from "@/presenters/ProfilePresenter";
import IdeaPresenter from "@/presenters/IdeaPresenter";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePresenter
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePresenter
    },
    {
      path: "/idea/:id",
      name: "Idea",
      component: IdeaPresenter,
      props: true
    }
  ],
})

export default router;
