<template>
  <v-container class="reveal">
    <v-row v-if="!confirmDisconnect">
      <v-col cols="12" class="pt-1 pb-2">
        <div class="back-arrow mb-2">
          <v-btn text @click="$router.push('/settings')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t("privKey.title") }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="py-2 text-left">
        <h4 class="sub-title-fields">
          {{ $t("privKey.text") }}
        </h4>
      </v-col>
    </v-row>
    <v-row v-if="!showPrivKey">
      <v-col cols="12" class="py-2 text-left">
        <label class="sub-title-fields">
          {{ $t("login.password[0]") }}
        </label>
        <v-text-field
          v-model="password"
          solo
          flat
          class="password-input mt-1"
          name="input-password-login"
          type="password"
          :error="passwordError"
          hide-details
        ></v-text-field>
        <p v-show="passwordError" class="error--text">
          {{ $t("login.password[1]") }}
        </p></v-col
      >
      <v-col cols="6" class="pr-2">
        <v-btn text class="cancel-btn" @click="cancel">
          {{ $t("buttons.cancel") }}
        </v-btn>
      </v-col>
      <v-col cols="6" class="pl-2">
        <v-btn text class="advance-btn" @click="revealPrivKey">
          {{ $t("buttons.confirm") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" class="text-left">
        <label class="sub-title-fields">
          {{ $t("privKey.label") }}
        </label>
        <div class="seed-phrase mt-1">
          {{ privKey }}
        </div>
        <p v-show="passwordError" class="error--text">
          {{ $t("login.password[1]") }}
        </p>
      </v-col>
      <v-col cols="12" class="pt-2 pb-4 mb-2px">
        <div class="alert">
          <icon-alert />
          <p class="alerts-font">{{ $t("privKey.alert") }}</p>
        </div>
      </v-col>

      <v-col cols="12" class="pl-2">
        <v-btn text class="advance-btn" @click="returnHome">
          {{ $t("buttons.done") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from "../../images/icon-arrow-back.vue";
import IconAlert from "../../images/icon-warning-red.vue";

import { REVEAL_PRIV_KEY } from "../../store/actions";

export default {
  components: {
    ArrowBack,
    IconAlert,
  },
  methods: {
    returnHome() {
      this.$router.push("/");
    },
    cancel() {
      this.$router.go(-1);
      this.privKey = "";
    },
    revealPrivKey() {
      this.debug("revealPrivKey");

      this.$store
        .dispatch(REVEAL_PRIV_KEY, this.password)
        .then((result) => {
          this.debug("Priv key", result);
          this.passwordError = false;
          this.privKey = result;
          this.showPrivKey = true;
        })
        .catch((e) => {
          console.error(e);
          this.passwordError = true;
        });
    },
  },
  data() {
    return {
      showPrivKey: false,
      privKey:
        "",
    };
  },
};
</script>

<style lang="scss" scoped>
.reveal {
  .alert {
    display: flex;
    padding: 8px 16px;
    padding-right: 20px;
    border-radius: 3px;
    background: rgba(233, 94, 94, 0.19);
    svg {
      min-width: 22px;
      align-self: center;
    }
    p {
      margin-left: 18px !important;
      text-align: left;
    }
  }
  .seed-phrase {
    padding: 0;
    margin: 0;
    border-radius: 3px;
    background-color: var(--very-light-grey);
    border: solid 1px #b8b9bb;

    padding: 18px 16px !important;
    margin-top: 0;
    text-align: left;
    font-size: 13px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    word-break: break-all;
    color: var(--charcoal-grey);
  }
}
</style>
