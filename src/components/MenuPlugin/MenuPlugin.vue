<template>
  <div>
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
            <jazz-icon :address="walletAddress" :id="'menu'" :size="32" :margin="2" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="T1" style="margin-bottom: 7px">
              {{ domainENS || $t("menu.title") }}
            </v-list-item-title>
            <v-list-item-subtitle class="subtitle">
              <v-tooltip content-class="wallet-tooltip" bottom>
                <template v-slot:activator="{ on }">
                  <div
                    class="wallet-address"
                    v-on="on"
                    @click="copyToClip"
                    @mouseover="copy = true"
                    @mouseleave="delay()"
                  >
                    {{ address | truncate(12, "...") }}
                    <Copy v-if="!copy" style="max-width: 14px; margin-left: 8px"></Copy>
                    <CopyHover v-else style="max-width: 14px; margin-left: 8px"></CopyHover>
                  </div>
                </template>
                <div class="arrow-seed-tooltip"></div>
                <div class="metamask-login">
                  <p class="mb-0" v-if="show">
                    {{ copyAfter[$i18n.locale] }}
                  </p>
                  <p class="mb-0" v-else>
                    {{ copyBefore[$i18n.locale] }}
                  </p>
                </div>
              </v-tooltip>
            </v-list-item-subtitle>
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

        <v-list-item v-if="false" @click="openViewActivityModal()">
          <v-list-item-icon>
            <IconActivity />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Activity</v-list-item-title>
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
    <!-- <ViewActivityModal v-if="showViewActivityModal" /> -->
  </div>
</template>

<script>
import IconWallet from "../../images/icon-wallet-unselected.vue"
import IconSites from "../../images/icon-connect-unselected.vue"
import IconSettings from "../../images/icon-settings-unselected.vue"
import IconAbout from "../../images/icon-about-unselected.vue"
import IconLock from "../../images/icon-logout-unselected.vue"
import IconWalletConnect from "../../images/icons/icon-walletconnect.vue"
import IconActivity from "../../images/icon-activity.vue"
// import ViewActivityModal from '../../modals/ViewActivityModal'
import CopyHover from "../../images/icon-copyclipboard-selected"
import Copy from "../../images/icon-copyclipboard-unselected"

import { LOCK_WALLET } from "../../store/actions"
import { DETAILS, SITES, SETTINGS, ABOUT, WALLET_CONNECT } from "../../router/routes"
import { mapState } from "vuex"

export default {
  props: ["address", "showMenu"],
  components: {
    IconWallet,
    IconSites,
    IconSettings,
    IconAbout,
    IconLock,
    IconWalletConnect,
    IconActivity,
    // ViewActivityModal,
    CopyHover,
    Copy,
  },
  computed: {
    ...mapState({
      walletAddress: "address",
      domainENS: "domainENS",
      showViewActivityModal: "showViewActivityModal",
    }),
  },
  created() {
    this.DETAILS = DETAILS
    this.SITES = SITES
    this.SETTINGS = SETTINGS
    this.ABOUT = ABOUT
    this.WALLET_CONNECT = WALLET_CONNECT
    console.log("walletaddress", this.walletAddress)
  },
  watch: {},
  mounted() {},
  methods: {
    close(input) {
      if (!input) {
        this.$emit("close", !this.showMenu)
      }
    },

    // se estiver ja na pagina fechar o menu
    goRoute(route) {
      this.debug("Menu Option: ", route)
      this.debug(this.$route.path)
      this.debug(this.$route?.path == route)
      this.$emit("close", !this.showMenu)
      if (this.$route.path != route) {
        this.debug(this.showMenu)
        this.$router.push(route)
      }
    },
    details() {
      this.debug("Detail Page")
      this.$router.push("/details")
    },
    sites() {
      this.debug("sites Page")
      this.$router.push("/sites")
    },
    settings() {
      this.debug("settings Page")
      this.$router.push("/settings")
    },
    about() {
      this.debug("about Page")
      this.$router.push("/about")
    },
    lock() {
      this.debug("lock wallet")

      this.$store.dispatch(LOCK_WALLET)

      // this.$API
      //   .lockApp()
      //   .then(() => this.refreshState())
      //   .catch((e) => {
      //     console.error(e);
      //   });
    },
    openViewActivityModal() {
      this.$store.commit("setCurrentCred", null)
      this.$store.commit("showViewActivityModal", true)
    },
    copyToClip() {
      try {
        this.copyToClipboard(this.walletAddress)
        this.show = true
      } catch (err) {
        console.error(err)
      }

      /* unselect the range */
      // testingCodeToCopy.setAttribute('type', 'hidden');
      // window.getSelection().removeAllRanges();
    },
    copyToClipboard(text) {
      if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text)
      } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        const textarea = document.createElement("textarea")
        textarea.textContent = text
        textarea.style.position = "fixed" // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea)
        textarea.select()
        try {
          return document.execCommand("copy") // Security exception may be thrown by some browsers.
        } catch (ex) {
          console.warn("Copy to clipboard failed.", ex)
          return false
        } finally {
          document.body.removeChild(textarea)
        }
      }
    },
    delay() {
      this.copy = false
      setTimeout(() => {
        this.show = false
      }, 400)
    },
  },

  data() {
    return {
      show: false,
      copy: false,
      copyBefore: { en: "Copy to clipboard", pt: "Copiar" },
      copyAfter: {
        en: "Copied!",
        pt: "Copiado!",
      },
    }
  },
}
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
  .wallet-address {
    margin: 0;
    background-color: unset;
    padding-left: 0;
  }
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
