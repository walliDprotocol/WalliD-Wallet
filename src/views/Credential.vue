<template>
  <v-container class="card-view">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-3">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ card.caName }} <br />
            {{ card.credName }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row class="">
      <v-col cols="12" class="pt-0 pb-2">
        <CredCard
          :frontTemplate="userData.front"
          :backTemplate="userData.table"
          :caName="card.caName"
          :certName="card.credName"
          :urlPhoto="card.userData.photoURL"
          :width="357"
          :height="228"
        />
      </v-col>
      <v-col cols="12">
        <v-tooltip
          :disabled="card.status == 'active'"
          content-class="wallet-tooltip credential"
          bottom
        >
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn
                text
                @click="proofPage"
                :disabled="card.status != 'active'"
                class="advance-btn "
              >
                {{ $t("credentials.menu[1]") }}
              </v-btn>
            </div>
          </template>
          <div class="arrow-seed-tooltip"></div>
          <div class="tooltip-credential">
            <p>
              {{ card.caName }}
              {{ $t("credentials.tooltip") }}
            </p>
          </div>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletAddress from "../components/WalletAddress";
import WalletState from "../components/WalletState";
import ArrowBack from "../images/icon-arrow-back.vue";

import CredCard from "../components/CredCard";

import { mapGetters } from "vuex";

export default {
  components: {
    WalletAddress,
    WalletState,
    ArrowBack,
    CredCard,
  },
  methods: {
    proofPage() {
      this.$router.push({ name: "Proof", params: { card: this.card } });
    },
  },
  created() {
    console.log("card", this.$route.params.card);
    this.card = this.$route.params.card;
  },
  mounted() {
    if (this.card.userData.userData) {
      this.userData = this.card.userData.userData;
    } else {
      this.userData = this.card.userData;
    }
  },
  computed: {
    ...mapGetters(["address"]),
  },
  data() {
    return {
      card: undefined,
      userData: null,
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

.card-view {
  .back-btn.v-btn {
    height: 26px !important;
  }
}
</style>
