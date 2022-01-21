<template>
  <v-container>
    <v-form ref="form" @submit.prevent="unlockPlugin" lazy-validation>
      <v-row>
        <v-col cols="12" class="text-center my-6 pt-5">
          <v-img
            center
            width="65"
            height="65"
            class="ma-auto"
            contain
            src="../images/logos/logo-wallid.png"
            srcset="../images/logos/logo-wallid@2x.png 2x,
             ../images/logos/logo-wallid@3x.png 3x"
        /></v-col>
        <v-col cols="12" class="pb-6 px-14">
          <h2 class="T1 mb-2 text-center">
            {{ $t('login.title') }}
          </h2>
        </v-col>

        <v-col cols="12" class="text-left pb-3">
          <label class="sub-title-fields">
            {{ $t('login.password[0]') }}
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
            @input="passwordError = false"
          ></v-text-field>
          <p v-show="passwordError" class="error--text">
            {{ $t('login.password[1]') }}
          </p></v-col
        >

        <v-col cols="12" class="pt-2">
          <v-btn
            text
            :loading="loading"
            @click="unlockPlugin"
            class="advance-btn"
          >
            {{ $t('login.button') }}
          </v-btn>
        </v-col>
        <v-col cols="12" class=" text-left">
          <p class="links mt-2 text-left" style="color: #373c43;">
            {{ $t('login.restore[0]') }}<br />
            <router-link to="/restore" class="links">
              {{ $t('login.restore[1]') }}
            </router-link>
          </p>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { UNLOCK_WALLET } from '../store/actions';

export default {
  data() {
    return {
      password: '',
      passwordError: false,
      completedOnboarding: this.$API.getState().initialized,
      loading: false,
    };
  },
  methods: {
    unlockPlugin() {
      this.loading = true;
      if (!this.completedOnboarding) {
        this.debug('Onboarding not completed');
        this.$router.push('/create');
      } else {
        this.$store
          .dispatch(UNLOCK_WALLET, this.password)
          .then(() => this.checkRequests())
          .catch((e) => {
            this.logError(e);
            this.passwordError = true;
            this.loading = false;
          });
      }
    },

    checkRequests() {
      this.debug('Check for Requests');
      if (this.$store.getters.hasPermissionsRequests) {
        this.$router.push('/request');
      } else {
        this.$router.push('/home');
      }
    },
  },
};
</script>
