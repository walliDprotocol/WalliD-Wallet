<template>
  <v-container>
    <form @submit="unlockPlugin">
      <v-row>
        <v-col cols="12" class="text-center my-8 pt-5">
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
            hide-details
            :error-messages="passwordError"
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
          <p class="links text-left" style="color: #373c43;">
            {{ $t("login.restore[0]") }}<br />
            <router-link to="/restore" class="links">
              {{ $t("login.restore[1]") }}
            </router-link>
          </p>
        </v-col>
      </v-row>
    </form>
  </v-container>

  <!-- <div class="main-box" v-else>
    <div class="third-height">
      <p>Address:</p>
      <p id="addr">{{ address }}</p>
    </div>
    <div>
      <v-btn block color="secondary" dark @click="lockPlugin">Lock</v-btn>
    </div>
    <div>
      <v-btn block color="secondary" dark @click="resetPlugin">Reset</v-btn>
    </div>
  </div> -->
</template>

<script>
import * as bip39 from "bip39";

export default {
  computed: {
    address: {
      get() {
        return this.$API.getState().address;
      },
    },
  },

  data() {
    return {
      password: "",
      passwordError: "",
      initialized: true, // this.$API.getState().initialized,
      unlocked: false, // this.$API.getState().unlocked,
    };
  },
  mounted() {
    console.log("MOUNTED Login", this.initialized);
    // API.createNewVault(bip39.generateMnemonic(), 'jamado')
  },
  methods: {
    unlockPlugin() {
      // this.$API
      //   .verifyPassword(this.password)
      //   .then((r) => console.log("RES", r))
      //   .catch((e) => console.log("POPUP VERIFY PASSWORD ERROR", e));
      // this.$API.unlockApp(this.password).then(() => this.refreshState());
      // this.unlocked = true;
      this.passwordError = true;
    },

    lockPlugin() {
      this.unlocked = false;

      // this.$API.lockApp().then(this.refreshState());
    },

    resetPlugin() {
      this.$API.resetVault(this.password).then(this.refreshState());
    },

    refreshState() {
      const appState = this.$API.getState();

      this.initialized = appState.initialized;
      this.unlocked = appState.unlocked;
      this.address = appState.address;
    },
  },
};
</script>

<style></style>
