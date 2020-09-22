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
      <v-row v-show="!success" class="justify-space-around mt-2px">
        <v-col cols="12" class="my-3 py-7 px-6">
          <div class="back-arrow">
            <h2 class="sub-title-fields">
              <b> {{ websiteData.name }}</b>
              {{ $t("request." + type + ".description") }}
            </h2>
          </div>
        </v-col>

        <!-- website info and wallet -->
        <v-col cols="4" class="pr-0 pt-4">
          <WebSiteLogo
            class="mr-0"
            :url="websiteData.icon"
            :name="websiteData.name"
          />
        </v-col>

        <v-col cols="4" class="px-0 pt-4">
          <v-divider class="dashed" />
        </v-col>

        <v-col cols="4" class="pl-0 pt-4">
          <jazz-icon
            :address="address"
            :id="'request'"
            :size="62"
            :margin="4"
          />
          <p class="FIELD-TEXT">{{ walletAddress | truncate(8, "...") }}</p>
        </v-col>

        <v-col cols="10" class="px-16 pt-13 pb-8">
          <router-link class="links" to="/">
            {{ $t("request.bScenes") }}
          </router-link>
        </v-col>

        <v-col v-show="type == 'wallid_connect'" cols="12" class="pt-0 pb-5 ">
          <div class="outer-box pr-6">
            <WarningIcon />
            <p class="links">{{ $t("request." + type + ".alert") }}</p>
          </div>
        </v-col>
      </v-row>
      <!-- Option buttons -->
      <v-row v-show="!success" class="float-bottom">
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

      <v-row v-show="success" class="justify-space-around mt-2px">
        <v-col cols="12" class="my-3 py-7 px-6">
          <div class="back-arrow">
            <h2 class="sub-title-fields">
              <b> {{ websiteData.name }}</b>
              {{ $t("request." + type + ".successText") }}
            </h2>
          </div>
        </v-col>

        <!-- website info and wallet -->
        <v-col cols="4" class="pr-0 pt-4">
          <WebSiteLogo
            class="mr-0"
            :url="websiteData.icon"
            :name="websiteData.name"
          />
        </v-col>

        <v-col cols="4" class="px-0 pt-4">
          <v-divider class="dashed" />
        </v-col>

        <v-col cols="4" class="pl-0 pt-4">
          <jazz-icon
            :address="address"
            :id="'request-2'"
            :size="62"
            :margin="4"
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
import WebSiteLogo from "../components/WebSiteLogo";
import JazzIcon from "../components/jazzicon";

import { CANCEL_REQUEST, AUTHORIZE_REQUEST } from "../store/actions";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  components: {
    WarningIcon,
    BrokenLine,
    WebSiteLogo,
    JazzIcon,
  },
  computed: {
    ...mapGetters(["address"]),
  },
  watch: {},
  mounted() {
    console.log(this.request);
    this.walletAddress = this.checksumAddress("0x" + this.address);
  },
  created() {
    this.type = this.request.type;
    switch (this.type) {
      case "wallid_connect":
        this.websiteData = this.request.data;
        break;
      case "wallid_disconnect":
        this.websiteData = this.request.params; //this.getWebsiteInfo(this.request.params);
        break;
      case "wallid_address":
        this.websiteData = this.request.params; //this.getWebsiteInfo(this.request.params);
        break;
      case "wallet_encrypt":
        this.websiteData = this.request.params; //this.getWebsiteInfo(this.request.params);
        break;
      case "wallet_decrypt":
        this.websiteData = this.request.params; //this.getWebsiteInfo(this.request.params);
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
    authorizeRequest() {
      // var request = { id: 1 };
      this.debug("Request", this.request);
      this.debug("notification", this.$notification);

      this.$store
        .dispatch(AUTHORIZE_REQUEST, {
          params: this.request.data,
          type: this.request.type,
          notification: this.$notification,
        })
        .then((result) => {
          this.success = true;
        });
    },
    cancel() {
      //cancel request TO DO
      this.$store.dispatch(CANCEL_REQUEST, {
        params: this.request.data,
        type: this.request.type,
        notification: this.$notification,
      });
      this.$router.push("/home");
      //   this.$store.dispatch("LOCK_WALLET");
      //   this.$API.lockApp().catch((e) => {
      // console.error(e);
      //   });
    },
  },
  data() {
    return {
      walletAddress: "",
      type: "",
      success: false,
      websiteData: {},
    };
  },
};
</script>

<style lang="scss">
[id^="metamask-logo-request"] {
  max-height: 72px;
  max-width: 72px;

  border-radius: 50%;
  border: solid 1px #b8b9bb;
  margin: auto;
  margin-bottom: 12px;
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
