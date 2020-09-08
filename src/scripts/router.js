import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home";
import Login from "../views/Login";
import Create from "../views/Create";
import Restore from "../views/Restore";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/restore",
      name: "Restore",
      component: Restore,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/create",
      name: "create",
      component: Create,
    },
  ],
});

export default router;
