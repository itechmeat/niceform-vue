import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/:category",
    name: "CategoryPage",
    props: ({ params }) => ({ category: +params.category }),
    component: () =>
      import(/* webpackChunkName: "category" */ "../views/_category"),
  },
  {
    path: "/:category/:id",
    name: "QuestionnairePage",
    props: ({ params }) => ({ questionnaire: +params.questionnaire }),
    component: () =>
      import(
        /* webpackChunkName: "category: questionnaire" */ "../views/_category/_questionnaire"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
