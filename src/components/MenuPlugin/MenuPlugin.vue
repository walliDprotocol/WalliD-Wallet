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
          <div id="metamask-logo-menu"></div>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="T1" style="margin-bottom: 7px">
            {{ $t("menu.title") }}</v-list-item-title
          >
          <v-list-item-subtitle class="subtitle"
            >0x{{ address | truncate(6, "...") }}</v-list-item-subtitle
          >
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
          <v-list-item-title>{{ $t("menu.details") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="goRoute(SITES)">
        <v-list-item-icon>
          <IconSites />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t("menu.sites") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item @click="goRoute(SETTINGS)">
        <v-list-item-icon>
          <IconSettings />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t("menu.settings") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="goRoute(ABOUT)">
        <v-list-item-icon>
          <IconAbout />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t("menu.about") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="lock">
        <v-list-item-icon>
          <IconLock />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t("menu.lock") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mt-2"></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import IconWallet from "../../images/icon-wallet-unselected.vue";
import IconSites from "../../images/icon-connect-unselected.vue";
import IconSettings from "../../images/icon-settings-unselected.vue";
import IconAbout from "../../images/icon-about-unselected.vue";
import IconLock from "../../images/icon-logout-unselected.vue";
import jazzicon from "jazzicon";

import { DETAILS, SITES, SETTINGS, ABOUT } from "../../router/routes";

export default {
  props: ["address", "showMenu"],
  components: {
    IconWallet,
    IconSites,
    IconSettings,
    IconAbout,
    IconLock,
  },
  created() {
    this.DETAILS = DETAILS;
    this.SITES = SITES;
    this.SETTINGS = SETTINGS;
    this.ABOUT = ABOUT;
  },
  mounted() {
    console.log(this.address);
    console.log(this.value);
    this.setIcon();
  },
  methods: {
    close(input) {
      console.log("close clicked");
      if (!input) {
        this.$emit("close", !this.showMenu);
      }
      // this.$emit("input", !this.showMenu);
    },

    // se estiver ja na pagina fechar o menu

    goRoute(route) {
      console.log("Menu Option: ", route);
      console.log(this.$route.path);
      let matchRoute = "/" + route;
      console.log(matchRoute);
      console.log(this.$route.path == matchRoute);
      this.$emit("close", !this.showMenu);
      if (this.$route.path == matchRoute) {
        console.log(this.showMenu);
        // this.$emit("input", !this.closeDrawer);
      } else {
        this.$router.push(route);
      }
    },
    details() {
      console.log("Detail Page");
      this.$router.push("/details");
    },
    sites() {
      console.log("sites Page");
      this.$router.push("/sites");
    },
    settings() {
      console.log("settings Page");
      this.$router.push("/settings");
    },
    about() {
      console.log("about Page");
      this.$router.push("/about");
    },
    lock() {
      console.log("lock wallet");

      this.$API
        .lockApp()
        .then(() => this.refreshState())
        .catch((e) => {
          console.error(e);
        });
    },
    refreshState() {
      this.$emit("close");
      this.$emit("refreshState");
    },
    setIcon() {
      if (!this.iconSet && this.address) {
        let body = document.getElementById("metamask-logo-menu");
        let icon = document.getElementById("metamask-logo-menu-icon");
        console.log("metamask-logo", body);
        if (body && !icon) {
          var el = jazzicon(32, this.address);
          var styles = el.getAttribute("style");
          styles = styles.concat(" margin: 2px;");

          el.setAttribute("style", styles);
          el.id = "metamask-logo-menu-icon";
          body.insertBefore(el, body.firstChild);
          this.iconSet = true;
        }
      }
    },
  },
  data() {
    return {
      //   showMenu: false,
    };
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
        font-weight: 500;
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
