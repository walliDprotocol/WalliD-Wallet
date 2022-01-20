import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home';
import Login from '../views/Login';
import Create from '../views/Create';
import Restore from '../views/Restore';
import Import from '../views/Import';
import Details from '../views/Details';
import Sites from '../views/ConnectedSites';
import Settings from '../views/Settings';
import About from '../views/About';
import Request from '../views/Request';
import MainContainer from '../views/MainContainer';
import FAQs from '../views/FAQs';
import Terms from '../views/Terms';
import Card from '../views/Card';
import Credential from '../views/Credential';

import WALLET_CONNECT_VIEW from '../views/WalletConnect';

import SHARE_PROFILE_VIEW from '../views/ShareProfile';
import SOCIAL_PROFILE_VIEW from '../views/SocialProfile';

import Proof from '../views/Proof';

import store from '../store';
import mixinPlugin from '../scripts/util';

import SeedPhrase from '../components/RevealSeedPhrase';
import PrivKey from '../components/RevealPrivateKey';

import { SHARE_PROFILE, SOCIAL_PROFILE, WALLET_CONNECT } from './routes';

const debug = mixinPlugin.methods.debug;
Vue.use(Router);

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainContainer,
      props: {
        hideAppHeader: false,
      },
      children: [
        {
          path: SHARE_PROFILE,
          name: 'SHARE_PROFILE_VIEW',
          component: SHARE_PROFILE_VIEW,
          params: true,
        },
        {
          path: SOCIAL_PROFILE,
          name: 'SOCIAL_PROFILE_VIEW',
          component: SOCIAL_PROFILE_VIEW,
          params: true,
        },
        {
          path: '/home',
          name: 'home',
          component: Home,
        },
        {
          path: '/restore',
          name: 'Restore',
          component: Restore,
        },
        {
          path: '/import',
          name: 'Import',
          component: Import,
        },
        {
          path: '/details',
          name: 'details',
          component: Details,
        },
        {
          path: '/sites',
          name: 'sites',
          component: Sites,
          props: (route) => ({ ...route.query, ...route.params }),
        },
        {
          path: '/settings',
          name: 'settings',
          component: Settings,
        },
        {
          path: WALLET_CONNECT,
          name: 'WALLET_CONNECT',
          component: WALLET_CONNECT_VIEW,
        },
        {
          path: '/about',
          name: 'About',
          component: About,
        },
        {
          path: '/login',
          name: 'login',
          component: Login,
        },
        {
          path: '/create',
          name: 'create',
          component: Create,
        },
        {
          path: '/revealSeedPhrase',
          name: 'seedPhrase',
          component: SeedPhrase,
        },
        {
          path: '/revealPrivKey',
          name: 'privKey',
          component: PrivKey,
        },
        {
          path: '/faqs',
          name: 'FAQS',
          component: FAQs,
        },
        {
          path: '/terms',
          name: 'Terms',
          component: Terms,
        },

        {
          path: '/card',
          name: 'Card',
          component: Card,
          params: true,
        },
        {
          path: '/cred',
          name: 'Credential',
          component: Credential,
          params: true,
        },
        {
          path: '/proof',
          name: 'Proof',
          component: Proof,
          params: true,
        },
      ],
    },

    {
      path: '/request',
      name: 'Request',
      component: Request,
      props: {
        request: store.getters.getRequest,
      },
    },
  ],
});
router.beforeEach((to, from, next) => {
  const isUnlocked = store.getters.unlocked;
  const completedOnboarding = store.getters.completedOnboarding;
  debug('completedOnboarding', completedOnboarding);
  debug('toPath', to.path);
  debug('fromPath', from.path);

  debug('isUnlocked', isUnlocked);

  if (to.path == '/popup.html') {
    const identities = store.getters.identities || [];
    const credentials = store.getters.credentials || [];
    const profiles = store.getters.profiles || [];
    switch (true) {
      case profiles.length > 0:
        store.commit('currentTab', 'tab-2');
        break;
      case identities.length > 0:
        store.commit('currentTab', 'tab-1');
        break;
      case credentials.length > 0:
        store.commit('currentTab', 'tab-3');
        break;
      default:
        break;
    }
  }

  // whitelisted pages
  if (
    to.path == '/login' ||
    to.path == '/create' ||
    to.path == '/restore' ||
    to.path == '/sites' ||
    to.path == '/import'
  ) {
    debug('Login/Create/Restore Path');
    return next();
  }

  if (!isUnlocked && completedOnboarding && to.path !== '/login') {
    return next('/login');
  }

  if (!completedOnboarding && to.path !== '/create') {
    return next('/create');
  }

  if (to.path == '/' || to.path == '/popup.html') {
    debug('Home Path');
    return next({ path: '/home' });
  }
  const isHandlingPermissionsRequest =
    to.path == 'request' || store.getters.getRequest;
  debug('Has Requests ', isHandlingPermissionsRequest);
  if (isHandlingPermissionsRequest && to.path !== '/request') {
    next({ path: '/request', params: { hideAppHeader: true } });
  } else {
    next();
  }
});

export default router;
