import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home";
import Login from "../views/Login";
import Create from "../views/Create";
import Restore from "../views/Restore";
import Details from "../views/Details";
import Sites from "../views/ConnectedSites";
import Settings from "../views/Settings";
import About from "../views/About";
import Request from "../views/Request";

import store from "../store";

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
    {
      path: "/details",
      name: "details",
      component: Details,
    },
    {
      path: "/sites",
      name: "sites",
      component: Sites,
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
    },
    {
      path: "/about",
      name: "About",
      component: About,
    },
    {
      path: "/request",
      name: "Request",
      component: Request,
      props: {
        websiteData: {
          url: "https://www.wallid.io/favicon.ico",
          name: "wallid.io",
        },
        type: "connection",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isInitializing = !store.getters.unlocked || !store.getters.address;
  console.log(store.getters.unlocked);
  console.log(store.getters.address);
  console.log(to.path);
  console.log(isInitializing);

  if (to.path == "/login") {
    console.log("Login Path");
    return next();
  }
  if (isInitializing && to.path !== "/login") {
    return next("/login");
  }
  const isHandlingPermissionsRequest =
    to.path == "request" || store.getters.hasPermissionsRequests;
  console.log(isHandlingPermissionsRequest);
  if (isHandlingPermissionsRequest && to.path !== "/request") {
    next({ path: "/request", params: { hideAppHeader: true } });
  } else {
    next();
  }
});

export default router;
