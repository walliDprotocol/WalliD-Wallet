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
          :template="card.userData"
          :caName="card.caName"
          :certName="card.credName"
          :urlPhoto="card.photoURL"
          :width="357"
          :height="228"
        />
      </v-col>
      <v-col cols="12">
        <v-btn
          text
          @click="proofPage"
          :disabled="card.status == 'pending_approval'"
          class="advance-btn "
        >
          {{ $t("credentials.menu[1]") }}
        </v-btn>
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
  mounted() {},
  computed: {
    ...mapGetters(["address"]),
  },
  data() {
    return {
      card: undefined,
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
