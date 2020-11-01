<template>
  <v-container class="proof-view">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-6">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t("proof.title") }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!linkProof" class="mt-10">
      <v-form @submit.prevent="generateProof" ref="form">
        <v-col cols="12" class="pt-0 pb-8  text-left">
          <label class="sub-title-fields ">{{ $t("proof.url") }}</label>
          <v-text-field
            v-model="url"
            class="password-input mt-1"
            flat
            solo
            :hint="$t('proof.hint')"
            @input="checkURL"
            :error-messages="urlError"
            type="url"
          ></v-text-field>
          <!-- <p v-show="urlError" class="error--text">
            {{ $t("proof.urlError") }}
          </p> -->
        </v-col>
        <v-col cols="12" class="pt-8 pb-5">
          <div class="info">
            <icon-alert />
            <p class="alerts-font">{{ $t("proof.info") }}</p>
          </div>
        </v-col>
        <v-col cols="12">
          <v-btn
            text
            @click="generateProof"
            :disabled="isDisabled"
            class="advance-btn "
          >
            {{ $t("proof.button") }}
          </v-btn>
        </v-col>
      </v-form>
    </v-row>
    <v-row v-else class="mt-10">
      <v-col cols="12 text-left">
        <label class="sub-title-fields ">{{ $t("proof.link") }}</label>
        <v-text-field
          v-model="linkProof"
          class="password-input mt-1"
          aria-readonly="true"
          flat
          solo
          type="url"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from "../images/icon-arrow-back.vue";
import IconAlert from "../images/icon-warning-red.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    IconAlert,
    ArrowBack,
  },
  created() {
    console.log("card", this.$route.params.card);
    this.card = this.$route.params.card;
  },
  mounted() {},
  computed: {
    ...mapGetters(["address"]),

    isDisabled() {
      return !this.url || !!this.urlError;
    },
  },
  methods: {
    checkURL() {
      this.urlError = "";

      var pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      ); // fragment locator
      if (!pattern.test(this.url)) {
        this.urlError = this.$t("proof.urlError");
      }
    },
    generateProof() {
      this.debug("generateProof");
      this.linkProof = "linkProf.com";
    },
  },
  data() {
    return {
      url: null,
      card: null,
      urlError: "",
      linkProof: "",
    };
  },
};
</script>

<style lang="scss">
.proof-view {
  .password-input .v-input__slot input {
    font-size: 13px !important;
  }
  div.info {
    display: flex;
    padding: 16px;
    padding-right: 16px;
    border-radius: 3px;
    background-color: var(--pale-blue) !important;
    svg {
      min-width: 22px;
      margin-top: 4px;
      g {
        fill: #009fb1;
      }
    }
    p {
      margin-left: 18px !important;
      text-align: left;
      color: var(--teal-blue) !important;
    }
  }
}
</style>
