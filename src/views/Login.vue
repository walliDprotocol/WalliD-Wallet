<template>
  <v-container>
    <form @submit="unlockPlugin">
      <v-row>
        <v-col cols="12" class="text-center my-6 pt-5">
          <v-img
            center
            width="192"
            height="65"
            class="ma-auto"
            contain
            src="../images/logo-wallid.png"
        /></v-col>
        <v-col cols="12" class="pt-3 pb-6 px-14">
          <h2 class="T1 mb-5 text-center">
            {{ $t("login.title") }}
          </h2>
        </v-col>

        <v-col cols="12" class="text-left pb-3">
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

        <v-col cols="12" class="pt-2">
          <v-btn text @click="unlockPlugin" class="advance-btn">
            {{ $t("login.button") }}
          </v-btn>
        </v-col>
        <v-col cols="12" class="pt-4 text-left">
          <p class="links mt-2 text-left" style="color: #373c43;">
            {{ $t("login.restore[0]") }}<br />
            <router-link to="/restore" class="links">
              {{ $t("login.restore[1]") }}
            </router-link>
          </p>
        </v-col>
      </v-row>
    </form>
  </v-container>
</template>

<script>
import * as bip39 from "bip39";

export default {
  computed: {},

  data() {
    return {
      password: "",
      passwordError: false,
      initialized: this.$API.getState().initialized,
    };
  },
  mounted() {
    console.log("MOUNTED Login", this.initialized);
  },
  methods: {
    unlockPlugin() {
      if (!this.initialized)
        this.$API
          .createNewVault(bip39.generateMnemonic(), "qwerty")
          .then(this.$API.unlockApp(this.password))
          .then(() => this.refreshState())
          .catch((e) => {
            console.error(e);
            this.passwordError = true;
          });
      else
        this.$API
          .unlockApp(this.password)
          .then(() => this.refreshState())
          .catch((e) => {
            console.error(e);
            this.passwordError = true;
          });
    },

    resetPlugin() {
      this.$API.deleteVault(this.password).then(this.refreshState());
    },

    refreshState() {
      console.log("Call REFRESH_STATE ");
      this.$store.dispatch("REFRESH_STATE");
      if (this.$store.getters.hasPermissionsRequests) {
        this.$router.push("/request");
      } else {
        this.$router.push("/home");
      }
    },
  },
};
</script>

<style></style>
