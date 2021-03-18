<template>
  <v-container class="card-view">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-3">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ card.caName }}
            {{ card.credName }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row class="">
      <v-col cols="12" class="pt-0 pb-2" style="text-align: initial">
        <CustomCard
        v-if="!loading"
          :frontTemplate="templateValues"
          :backTemplate="userData.table"
          :caName="card.caName"
          :credentialName="card.credName"
          :urlPhoto="photoCred"
          :frontend_props="frontend_props"
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

      <v-col cols="12">
        <a
          class="download-button"
          :class="{ disabled: !card.userData.pdf_url }"
          :href="card.userData.pdf_url"
          target="_blank"
          style="text-decoration:none"
        >
          <v-btn :disabled="!card.userData.pdf_url" text class="advance-btn">
            {{ $t("credentials.menu[2]") }}
          </v-btn>
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletAddress from "../components/WalletAddress";
import WalletState from "../components/WalletState";
import ArrowBack from "../images/icon-arrow-back.vue";

import CustomCard from "../components/CustomCard";

import { mapGetters } from "vuex";
const FILESTACK = "https://www.filestackapi.com/api/file/";

export default {
  components: {
    WalletAddress,
    WalletState,
    ArrowBack,
    CustomCard,
  },
  methods: {
    proofPage() {
      this.$router.push({
        name: "Proof",
        params: { card: this.$route.params.card },
      });
    },
  },
  created() {
    console.log("card", this.$route.params.card);
    this.card = JSON.parse(JSON.stringify(this.$route.params.card));
    this.frontend_props = this.card.userData.frontend_props;
    if (
      this.card.userData.img_url &&
      !this.card.userData.img_url.startsWith("https")
    ) {
      this.photoCred = FILESTACK + this.card.userData.img_url;
    } else {
      this.photoCred = this.card.userData.img_url;
    }

  },
  mounted() {
    if (this.card.userData.userData) {
      this.userData = this.card.userData.userData;
    } else {
      let userData = { front: [], table: {} };
      if (this.card.userData.user_data.tables) {
        userData.table = JSON.parse(
          JSON.stringify(this.card.userData.user_data.tables)
        );
        delete this.card.userData.user_data.tables;
      }
      // for (var a in this.card.userData.user_data) {
      //   var val = this.card.userData.user_data[a];
      //   userData.front.push({ attr: a, value: val });
      // }
 for (let index = 0; index < this.card.userData.template_itens.length; index++) {
   const el = this.card.userData.template_itens[index];
      this.templateValues[el.order]=  { attr: el.attr, value: this.card.userData.user_data[el.attr] }; // "a 5", "b 7", "c 9"
    }
   this.userData = userData; // this.card.userData.user_data;
      this.loading = false
    }
  },
  computed: {
    ...mapGetters(["address"]),
  },
  data() {
    return {
      card: undefined,
      userData: null,
      frontend_props: null,
      photoCred: null,
      templateValues:[],
      loading:true
    };
  },
};
</script>

<style lang="scss">
.credential-img {
  border-radius: 14px;
}
.download-button {
  &.disabled {
    cursor: default;
  }
}
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
