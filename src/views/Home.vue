<template>
  <v-container class="home">
    <v-row class="pt-3 mt-2px">
      <v-col cols="12" class="pt-5 pb-0">
        <jazz-icon
          :address="address"
          :id="'home'"
          :size="100"
          :margin="5"
        />
      </v-col>
      <v-col cols="12" class="pt-4 pb-6 px-14">
        <h2 class="T1 mb-2 text-center">
          {{ $t("home.title") }}
        </h2>
        <WalletState :website="connected.url"> </WalletState>
      </v-col>
      <v-col cols="12" class="pt-4 pb-9 px-14">
        <p class="normal-text mb-3 text-center">
          {{ $t("home.address") }}
        </p>

        <WalletAddress :address="address" />
      </v-col>
      <v-col class="pt-16" cols="12">
        <v-img
          class="ma-auto"
          width="112"
          contain
          src="../images/logo-wallid.png"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as bip39 from "bip39";
import JazzIcon from "../components/jazzicon";
import WalletState from "../components/WalletState";
import WalletAddress from "../components/WalletAddress";
import { mapGetters } from "vuex";

export default {
  components: {
    WalletState,
    WalletAddress,
    JazzIcon,
  },
  computed: {
    ...mapGetters(["address"]),
  },
  mounted() {
  
  },
  methods: {

  },
  data() {
    return {
      iconSet: false,
    };
  },
};
</script>

<style lang="scss">
#metamask-logo-home {
  max-height: 114px;
  max-width: 114px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
}
</style>
