<template>
  <v-app class="plugin-request">
    <v-app-bar height="74" flat app class="plugin-header">
      <v-img
        height="50"
        max-width="50"
        contain
        src="../images/logo-header-wallid.png"
      />
      <h1 v-if="!success" class="T2 ml-5">
        {{ $t("request." + type + ".title") }}
      </h1>
      <h1 v-else class="T2 ml-5">{{ $t("request." + type + ".success") }}</h1>

      <div class="arrow-down-header"></div>
      <!-- -->
    </v-app-bar>

    <v-container class="request">
      <v-row
        v-show="!success"
        class="justify-space-around mt-2px"
        style="height:500px"
      >
        <v-col cols="12" class="my-3 py-7 ">
          <h2 class="sub-title-fields">
            <b> {{ websiteData.name }}</b>
            {{ $t("request." + type + ".description") }}
          </h2>
        </v-col>

        <!-- website info and wallet -->
        <v-col cols="4" class="pr-0 pt-4">
          <WebSiteLogo :url="websiteData.icon" :name="websiteData.name" />
        </v-col>

        <v-col cols="4" class="px-0 pt-4">
          <v-divider class="dashed" />
        </v-col>

        <v-col cols="4" class="pl-0 pt-4">
          <jazz-icon
            :address="address"
            :id="'request'"
            :size="62"
            :margin="3"
          />
          <p class="FIELD-TEXT">{{ walletAddress | truncate(8, "...") }}</p>
        </v-col>
        <v-col cols="10" v-if="type == 'wallid_connect'" class="px-16 ">
          <p
            class="FIELD-TEXT text-center"
            v-html="$t('request.' + type + '.permissions')"
          >
            {{}}
          </p>
        </v-col>

        <v-col cols="10" class="px-16 pb-8">
          <router-link class="links" to="/">
            {{ $t("request.bScenes") }}
          </router-link>
        </v-col>

        <!-- Option buttons -->
        <v-col v-show="!success" cols="6" class="pr-2 pb-0" align-self="end">
          <v-btn text class="cancel-btn" @click="cancel">
            {{ $t("request.cancel") }}
          </v-btn>
        </v-col>
        <v-col v-show="!success" cols="6" class="pl-2 pb-0" align-self="end">
          <v-btn
            text
            class="advance-btn"
            :disabled="disableButtonRequest"
            @click="authorizeRequest"
          >
            {{ $t("request." + type + ".button") }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-show="success" class="justify-space-around connected mt-2px">
        <v-col cols="12" class="my-3 py-7 px-14">
          <div class="back-arrow">
            <h2 class="sub-title-fields">
              <b> {{ websiteData.name }}</b>
              {{ $t("request." + type + ".successText") }}
            </h2>
          </div>
        </v-col>

        <!-- website info and wallet -->
        <v-col cols="4" class="pr-0 pt-4">
          <WebSiteLogo :url="websiteData.icon" :name="websiteData.name" />
        </v-col>

        <v-col cols="4" class="px-0 pt-4 check">
          <v-divider class="dashed" />
          <CheckSuccessIcon />
          <v-divider class="dashed" />
        </v-col>

        <v-col cols="4" class="pl-0 pt-4">
          <jazz-icon
            :address="address"
            :id="'request-2'"
            :size="62"
            :margin="3"
          />
          <p class="FIELD-TEXT">{{ walletAddress | truncate(8, "...") }}</p>
        </v-col>
      </v-row>
      <!-- Option buttons -->
    </v-container>
  </v-app>
</template>

<script>
import WarningIcon from "../images/icon-warning-blue";
import BrokenLine from "../images/broken-line";
import CheckSuccessIcon from "../images/icon-sucessfully";
import WebSiteLogo from "../components/WebSiteLogo";

import {
  CANCEL_REQUEST,
  AUTHORIZE_REQUEST,
  ACCESS_LEVEL,
  CONNECT,
  IMPORT,
  UPDATE_CONNECTED,
} from "../store/actions";
import { mapGetters } from "vuex";

export default {
  components: {
    CheckSuccessIcon,
    WarningIcon,
    BrokenLine,
    WebSiteLogo,
  },
  computed: {
    ...mapGetters(["address", "credentials", "connections"]),
  },
  watch: {},
  mounted() {
    this.debug("Request: ", this.request);
    this.walletAddress = this.address; //this.checksumAddress
  },
  created() {
    this.debug("Address: ", this.address);
    this.debug("Request: ", this.request);

    this.type = this.request.type;
    this.debug("Request type: ", this.type);
    this.websiteData = this.getWebsiteInfo(this.request.origin);

    switch (this.type) {
      case "wallet_sign":
      case "wallet_sign_erc191":
      case "wallet_ec_sign":
        break;
      case "wallid_open":
        var params;
        params = {
          url: this.request.origin,
          icon: this.request.origin + "/favicon.ico",
          name: this.getDomain(this.request.origin),
        };
        this.$store
          .dispatch(ACCESS_LEVEL, { url: this.request.origin, level: 1 })
          .then((hasAccess) => {
            this.debug("hasAccess", hasAccess, params);
            if (!hasAccess) {
              this.$store.dispatch(CONNECT, { params }).then(() => {
                this.debug("Connected");
                this.findCredential(this.request.data);
              });
            } else {
              this.findCredential(this.request.data);
              this.updateConnected(this.request.origin);
            }
          });
        break;
      case "wallid_connect":
        this.$store
          .dispatch(ACCESS_LEVEL, { url: this.request.origin, level: 1 })
          .then((hasAccess) => {
            this.debug("hasAccess", hasAccess);
            if (hasAccess) {
              Promise.resolve(
                this.request.callback(null, "EXECUTED")
              ).then(() => window.close());
            }
          });
        break;
      case "wallid_disconnect":
        console.error("Invalid Request Type");
        break;
      case "wallid_address":
        console.error("Invalid Request Type");
        break;
      case "wallid_import_sign":
      case "wallid_import_cred":
      case "wallid_token":
      case "wallid_import":
      case "wallet_encrypt":
      case "wallet_decrypt":
        var params;
        params = {
          url: this.request.origin,
          icon: this.request.origin + "/favicon.ico",
          name: this.getDomain(this.request.origin),
        };
        this.$store
          .dispatch(ACCESS_LEVEL, { url: this.request.origin, level: 1 })
          .then((hasAccess) => {
            this.debug("hasAccess", hasAccess, params);
            if (!hasAccess) {
              this.$store.dispatch(CONNECT, { params }).then(() => {
                this.debug("Connected");
                this.authorizeRequest(0);
              });
            } else {
              this.authorizeRequest(0);
            }
          });
        break;
      default:
        console.log("Invalid Request Type");
        break;
    }
  },
  props: {
    request: {
      required: true,
    },
  },
  methods: {
    updateConnected(site) {
      if (this.connections) {
        let connectedSite = this.connections.find((e) => {
          return this.getDomain(e.url) == this.getDomain(site) ? e : "";
        });
        this.debug("connectedSite site: ", connectedSite);
        if (connectedSite) {
          this.$store.commit("updateConnected", connectedSite);
        }
      }
    },
    findCredential(id) {
      console.log("findCredential", id);
      let cred = this.credentials.find((cred) => {
        if (cred.id == id) {
          return cred;
        }
      });
      console.log("Credential", cred);

      if (cred) {
        this.$store.commit("clearPendingRequests");
        this.$store.commit("setCurrentCred", cred);
        this.$router.push({ name: "Credential" });
      } else {
        this.authorizeRequest(0);
      }
    },
    getWebsiteInfo(origin) {
      let name = origin.split("//")[1].split("/")[0];
      let icon = origin + "/favicon.ico";
      return { name: name, icon: icon };
    },

    authorizeRequest(time = 10) {
      this.disableButtonRequest = true;
      this.$store
        .dispatch(AUTHORIZE_REQUEST, {
          data: this.request.data,
          type: this.request.type,
          callback: this.request.callback,
          origin: this.request.origin,
          name: this.websiteData.name,
        })
        .then(() => {
          if (this.request.type == "wallid_connect") this.success = true;
          if (
            this.request.type != "wallid_import_cred" &&
            this.request.type != "wallid_import_sign" &&
            this.request.type != "wallid_open"
          )
            setTimeout(() => {
              this.$notification ? window.close() : this.$router.push("/home");
            }, time * 100);
          else {
            this.$router.push("/home");
          }
        });
    },
    cancel() {
      this.$store
        .dispatch(CANCEL_REQUEST, {
          params: this.request.data,
          type: this.request.type,
          callback: this.request.callback,
          notification: this.$notification,
        })
        .then(() => {
          setTimeout(() => {
            this.$notification ? window.close() : this.$router.push("/home");
          }, 5 * 100);
        });
    },
  },
  data() {
    return {
      disableButtonRequest: false,
      walletAddress: "",
      type: "",
      success: false,
      websiteData: { name: "", icon: "" },
    };
  },
};
</script>

<style lang="scss">
[id^="metamask-logo-request"]:not([class*="icon"]) {
  max-height: 72px;
  max-width: 72px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
  margin-bottom: 12px;
  margin-left: 0;
  .connected & {
    border: solid 2px var(--turquoise-green);
  }
}

[id^="metamask-logo-request"] + p {
  max-width: 76px;
  word-break: break-all;
}

.plugin-request {
  .float-bottom {
    position: absolute;
    bottom: 14px;
    width: 100%;
  }
  .request {
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
    svg {
      align-self: center;
    }
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
  .connected {
    .dashed {
      border: solid thin var(--turquoise-green);
    }
    .check {
      display: flex;
      svg {
        height: 32px;
        width: 32px;
        margin-top: 22px;
      }
    }
  }
}
</style>
