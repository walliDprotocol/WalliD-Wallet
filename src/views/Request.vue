<template>
  <v-app class="plugin-request">
    <v-app-bar height="74" flat app class="plugin-header">
      <v-img
        height="50"
        max-width="50"
        contain
        src="../images/logo-header-wallid.png"
      />
      <h1 class="T2 ml-5">{{ $t("request." + type + ".title") }}</h1>
      <div class="arrow-down-header"></div>
      <!-- -->
    </v-app-bar>

    <v-container class="request">
      <v-row class="justify-space-around">
        <v-col cols="12" class="mt-3 pt-7 mb-6 px-6">
          <div class="back-arrow mb-2">
            <h2 class="sub-title-fields">
              <b> {{ websiteData.name }}</b>
              {{ $t("request." + type + ".description") }}
            </h2>
          </div>
        </v-col>

        <!-- website info and wallet -->
        <v-col cols="4" class="pr-0">
          <WebSiteLogo
            class="mr-0"
            :url="websiteData.url"
            :name="websiteData.name"
          />
        </v-col>

        <v-col cols="4" class="px-0">
          <v-divider class="dashed" />
        </v-col>

        <v-col cols="4" class="pl-0">
          <div class="ml-0" id="metamask-logo-request"></div>
          <p class="FIELD-TEXT">{{ walletAddress | truncate(8, "...") }}</p>
        </v-col>

        <v-col cols="10" class="px-16 pt-13 pb-8">
          <router-link class="links" to="/">
            {{ $t("request.bScenes") }}
          </router-link>
        </v-col>

        <v-col cols="12" class="pt-0 pb-5 ">
          <div class="outer-box pr-6">
            <WarningIcon />
            <p class="links">{{ $t("request." + type + ".alert") }}</p>
          </div>
        </v-col>

        <!-- Option buttons -->
        <v-col cols="6" class="pr-2">
          <v-btn text class="cancel-btn" @click="cancel">
            {{ $t("request.cancel") }}
          </v-btn>
        </v-col>
        <v-col cols="6" class="pl-2">
          <v-btn text class="advance-btn" @click="authorizeRequest">
            {{ $t("request." + type + ".button") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import jazzicon from "jazzicon";
import WarningIcon from "../images/icon-warning-blue";
import BrokenLine from "../images/broken-line";
import WebSiteLogo from "../components/WebSiteLogo";
import { CANCEL_REQUEST, AUTHORIZE_REQUEST } from "../store/actions";
import axios from "axios";
export default {
  components: {
    WarningIcon,
    BrokenLine,
    WebSiteLogo,
  },
  watch: {
    address(value) {
      if (value) {
        this.setIcon();
      }
    },
  },
  mounted() {
    this.setIconWallet();
    this.walletAddress = this.checksumAddress("0x" + this.address);
  },
  props: {
    type: {
      required: true,
    },
    websiteData: {
      required: false,
    },
  },
  methods: {
    authorizeRequest() {
      // var request = { id: 1 };
      // this.$store.dispatch(AUTHORIZE_REQUEST, request.id);
    },
    cancel() {
      //cancel request TO DO
      var request = { id: 1 };
      this.$store.dispatch(CANCEL_REQUEST, request.id);
      this.$router.push("/home");
      //   this.$store.dispatch("LOCK_WALLET");
      //   this.$API.lockApp().catch((e) => {
      // console.error(e);
      //   });
    },
    setIconWallet() {
      if (!this.iconSet && this.address) {
        let body = document.getElementById("metamask-logo-request");
        let icon = document.getElementById("metamask-logo-request-icon");
        console.log("metamask-logo", body);
        if (body && !icon) {
          var el = jazzicon(62, this.address);
          var styles = el.getAttribute("style");
          styles = styles.concat(" margin: 4px;");

          el.setAttribute("style", styles);
          el.id = "metamask-logo-home-icon";
          body.insertBefore(el, body.firstChild);
          this.iconSet = true;
        }
      }
    },
  },
  data() {
    return {
      address: this.$API.getState().address,
      unlocked: this.$API.getState().unlocked,
      walletAddress: "",
    };
  },
};
</script>

<style lang="scss">
#metamask-logo-request {
  max-height: 72px;
  max-width: 72px;

  border-radius: 50%;
  border: solid 1px #b8b9bb;
  margin: auto;
  margin-bottom: 12px;
}

#metamask-logo-request + p {
  max-width: 76px;
  word-break: break-all;
}

.plugin-request {
  .request {
    padding: 12px !important;
    padding-top: 74px !important;
  }
  .links {
    font-size: 12px !important;
    display: block;
  }
  .outer-box {
    padding: 12px 18px;
    border-radius: 3px;

    background-color: var(--pale-blue);
    display: flex;
    p {
      margin-left: 16px !important;
      margin-top: 2px !important;
    }
  }
  .arrow-down-header {
    background-color: #eeeeee;
    transform: rotate(45deg);
    width: 15px;
    height: 15px;
    position: absolute;
    bottom: -7px;
    left: 50%;
    margin-left: -7px;
    z-index: -1;
  }
  .dashed {
    margin-top: 38px;
    border: dashed thin #b8b9bb;
  }
}
</style>
