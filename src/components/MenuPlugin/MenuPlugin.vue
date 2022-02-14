<template>
  <v-navigation-drawer
    :value="showMenu"
    @input="close"
    app
    right
    temporary
    width="324"
    class="menu-plugin"
  >
    <template v-slot:prepend>
      <v-list-item two-line>
        <v-list-item-avatar>
          <jazz-icon
            :address="walletAddress"
            :id="'menu'"
            :size="32"
            :margin="2"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="T1" style="margin-bottom: 7px">
            {{ domainENS || $t('menu.title') }}</v-list-item-title
          >
          <v-list-item-subtitle class="subtitle">{{
            address | truncate(12, '...')
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-divider></v-divider>
    <v-list>
      <v-list-item @click="goRoute(DETAILS)">
        <v-list-item-icon>
          <IconWallet />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.details') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="goRoute(SITES)">
        <v-list-item-icon>
          <IconSites />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.sites') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="goRoute(WALLET_CONNECT)">
        <v-list-item-icon>
          <IconWalletConnect />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>WalletConnect</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item @click="goRoute(SETTINGS)">
        <v-list-item-icon>
          <IconSettings />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.settings') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="goRoute(ABOUT)">
        <v-list-item-icon>
          <IconAbout />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.about') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="lock">
        <v-list-item-icon>
          <IconLock />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.lock') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mt-2"></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import IconWallet from '../../images/icon-wallet-unselected.vue';
import IconSites from '../../images/icon-connect-unselected.vue';
import IconSettings from '../../images/icon-settings-unselected.vue';
import IconAbout from '../../images/icon-about-unselected.vue';
import IconLock from '../../images/icon-logout-unselected.vue';
import IconWalletConnect from '../../images/icons/icon-walletconnect.vue';

import { LOCK_WALLET } from '../../store/actions';
import {
  DETAILS,
  SITES,
  SETTINGS,
  ABOUT,
  WALLET_CONNECT,
} from '../../router/routes';
import { mapState } from 'vuex';

export default {
  props: ['address', 'showMenu'],
  components: {
    IconWallet,
    IconSites,
    IconSettings,
    IconAbout,
    IconLock,
    IconWalletConnect,
  },
  computed: {
    ...mapState({
      walletAddress: 'address',
      domainENS: 'domainENS',
    }),
  },
  created() {
    this.DETAILS = DETAILS;
    this.SITES = SITES;
    this.SETTINGS = SETTINGS;
    this.ABOUT = ABOUT;
    this.WALLET_CONNECT = WALLET_CONNECT;
    console.log('walletaddress', this.walletAddress);
  },
  watch: {},
  mounted() {},
  methods: {
    close(input) {
      if (!input) {
        this.$emit('close', !this.showMenu);
      }
    },

    // se estiver ja na pagina fechar o menu
    goRoute(route) {
      this.debug('Menu Option: ', route);
      this.debug(this.$route.path);
      this.debug(this.$route?.path == route);
      this.$emit('close', !this.showMenu);
      if (this.$route.path != route) {
        this.debug(this.showMenu);
        this.$router.push(route);
      }
    },
    details() {
      this.debug('Detail Page');
      this.$router.push('/details');
    },
    sites() {
      this.debug('sites Page');
      this.$router.push('/sites');
    },
    settings() {
      this.debug('settings Page');
      this.$router.push('/settings');
    },
    about() {
      this.debug('about Page');
      this.$router.push('/about');
    },
    lock() {
      this.debug('lock wallet');

      this.$store.dispatch(LOCK_WALLET);

      // this.$API
      //   .lockApp()
      //   .then(() => this.refreshState())
      //   .catch((e) => {
      //     console.error(e);
      //   });
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
#metamask-logo-menu {
  max-height: 40px;
  max-width: 40px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
}

.menu-plugin {
  top: 74px !important;
  box-shadow: none !important;
  .v-navigation-drawer__prepend {
    .v-list-item {
      padding: 0 24px;
      .v-list-item__avatar {
        margin-top: 19px;
        margin-bottom: 20px;
      }
      .v-list-item__content {
        padding: 17px 0;
      }
    }
    .v-list-item__content {
      text-align: left;
      .subtitle {
        font-size: 13px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--charcoal-grey);
      }
    }
  }
  .v-navigation-drawer__content {
    .v-list-item {
      padding: 0 30px;
      .v-list-item__icon {
        margin-right: 18px;
        margin-top: 14px;
        margin-bottom: 12px;
      }
      .v-list-item__title {
        text-align: left;
        font-size: 16px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--charcoal-grey);
      }
      .v-ripple__container {
        color: #87c2c9;
      }
      &:hover {
        background-color: var(--pale-blue);
        .v-list-item__title {
          color: var(--teal-blue);
        }
        path {
          fill: #009fb1;
        }
      }
    }
  }
}
</style>
