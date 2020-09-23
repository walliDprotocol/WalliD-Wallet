<template>
  <v-container class="details-wallet">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-6">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t("menu.details") }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row class="darker-background mt-10">
      <v-col cols="12" class="pt-0 pb-2">
        <jazz-icon :address="address" :id="'details'" :size="71" :margin="4" />
      </v-col>
      <v-col cols="12" class="pt-1">
        <h2 class="T1 mb-2">{{ $t("menu.title") }}</h2>
        <WalletState :isConnected="isConnected" :website="'WallidD.io'">
        </WalletState>
      </v-col>
      <v-col cols="12" class="pt-2 pb-1">
        <qrcode
          :value="walletAddress"
          :options="{
            width: 140,
            margin: 0,
            color: { dark: '#373c43', light: '#f7f7f7' },
          }"
        ></qrcode>
      </v-col>
      <v-col cols="12" class="pb-9 pt-2">
        <wallet-address />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletAddress from "../components/WalletAddress";
import WalletState from "../components/WalletState";
import ArrowBack from "../images/icon-arrow-back.vue";
import JazzIcon from "../components/jazzicon";
import { mapGetters } from "vuex";

export default {
  components: {
    WalletAddress,
    WalletState,
    ArrowBack,
    JazzIcon,
  },
  created() {
    this.walletAddress = this.address; //this.checksumAddress
  },
  mounted() {},
  computed: {
    ...mapGetters(["address"]),
    isConnected() {
      if (this.connected) {
        return {
          msg: this.$i18n.t("state.connected[0]"),
          color: "#00e284",
          status: 1,
        };
      } else {
        return {
          msg: this.$i18n.t("state.locked[0]"),
          color: "#b8b9bb",
          status: 0,
        };
      }
    },
  },
  methods: {
    stepBack() {},
  },
  data() {
    return {
      connected: false,
      walletAddress: "",
    };
  },
};
</script>

<style lang="scss">
#metamask-logo-details {
  max-height: 83px;
  max-width: 83px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
  margin-top: -35px;
}

.details-wallet {
  .darker-background.row {
    margin: 0;
    border-radius: 3px;
    background-color: var(--white);
    .wallet-state {
      background: #efefef;
    }
    .wallet-address {
      background-color: #ffffff;
      padding: 10px;
    }
  }
}
</style>
