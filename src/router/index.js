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
import MainContainer from "../views/MainContainer";
import FAQs from "../views/FAQs";
import Terms from "../views/Terms";

import store from "../store";
import mixinPlugin from "../scripts/util";

import SeedPhrase from "../components/RevealSeedPhrase";
import PrivKey from "../components/RevealPrivateKey";

const debug = mixinPlugin.methods.debug;
Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "main",
      component: MainContainer,
      props: {
        hideAppHeader: false,
      },
      children: [
        {
          path: "/home",
          name: "home",
          component: Home,
        },
        {
          path: "/restore",
          name: "Restore",
          component: Restore,
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
          path: "/login",
          name: "login",
          component: Login,
        },
        {
          path: "/revealSeedPhrase",
          name: "seedPhrase",
          component: SeedPhrase,
        },
        {
          path: "/revealPrivKey",
          name: "privKey",
          component: PrivKey,
        },
        {
          path: "/faqs",
          name: "FAQS",
          component: FAQs,
        },
        {
          path: "/terms",
          name: "Terms",
          component: Terms,
        },
      ],
    },

    {
      path: "/create",
      name: "create",
      component: Create,
    },
    {
      path: "/request",
      name: "Request",
      component: Request,
      props: { request: store.getters.getRequest },
    },
  ],
});
router.beforeEach((to, from, next) => {
  const isUnlocked = store.getters.unlocked;
  const completedOnboarding = store.getters.completedOnboarding;
  debug("completedOnboarding", completedOnboarding);
  debug("Path", to.path);
  debug("isUnlocked", isUnlocked);

  if (to.path == "/login") {
    debug("Login Path");
    return next({ params: { hideAppHeader: false } });
  }

  if (!isUnlocked && to.path !== "/login") {
    return next("/login");
  }

  if (to.path == "/" || to.path == "/popup.html") {
    debug("Home Path");
    return next({ path: "/home" });
  }
  const isHandlingPermissionsRequest =
    to.path == "request" || store.getters.getRequest;
  debug("Has Requests ", isHandlingPermissionsRequest);
  if (isHandlingPermissionsRequest && to.path !== "/request") {
    next({ path: "/request", params: { hideAppHeader: true } });
  } else {
    next();
  }
});

export default router;
