<template>
  <v-container id="import-form" class="restore mt-n2 pa-2">
    <v-row v-if="!imported">
      <form @submit="restorePassword">
        <v-col cols="12">
          <div class="back-arrow mb-6">
            <v-btn text @click="stepBack" class="back-btn">
              <ArrowBack />
            </v-btn>
            <h2 class="T1">
              {{ $t('import.title') }}
            </h2>
          </div>
          <h2 class="sub-title-fields text-left">
            {{ $t('import.subtitle') }}
          </h2>
        </v-col>

        <v-col cols="12" class="text-left pb-1 pt-2">
          <label class="sub-title-fields">
            {{ $t('import.seedPhrase[0]') }}
          </label>

          <v-text-field
            v-model="seedPhrase"
            solo
            flat
            @input="validSeedPhrase"
            v-show="showSeedPhrase"
            class="password-input seed-phrase mt-1"
            :class="{
              'error-seed-phrase': errorSeedPhrase,
            }"
            name="input-password-login"
            :type="'password'"
            hide-details
          >
            <template v-slot:append>
              <v-tooltip content-class="seed-phrase-tooltip" bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" @click="show">
                    <EyeSelected v-show="!showSeedPhrase"></EyeSelected>
                    <EyeUnselected v-show="showSeedPhrase"></EyeUnselected>
                  </div>
                </template>
                <div class="arrow-seed-tooltip"></div>
                <p v-show="showSeedPhrase">
                  {{ $t('import.seedPhrase[1]') }}
                </p>
                <p v-show="!showSeedPhrase">
                  {{ $t('import.seedPhrase[2]') }}
                </p>
              </v-tooltip>
            </template>
          </v-text-field>
          <v-textarea
            v-show="!showSeedPhrase"
            @input="validSeedPhrase"
            class="seed-phrase-revealed mt-1"
            no-resize
            rows="2"
            hide-details
            solo
            :class="{
              'error-seed-phrase': errorSeedPhrase,
            }"
            flat
            v-model="seedPhrase"
          >
            <template v-slot:append>
              <v-tooltip content-class="seed-phrase-tooltip" bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" @click="show">
                    <EyeSelected v-show="!showSeedPhrase"></EyeSelected>
                    <EyeUnselected v-show="showSeedPhrase"></EyeUnselected>
                  </div>
                </template>
                <div class="arrow-seed-tooltip"></div>
                <p v-show="showSeedPhrase">
                  {{ $t('import.seedPhrase[1]') }}
                </p>
                <p v-show="!showSeedPhrase">
                  {{ $t('import.seedPhrase[2]') }}
                </p>
              </v-tooltip>
            </template>
          </v-textarea>
          <p class="error--text mt-2">{{ seedPhraseErrorMessage }}</p>
        </v-col>
        <v-col cols="12" class="text-left pb-1 pt-1">
          <label class="sub-title-fields">
            {{ $t('import.password[0]') }}
          </label>
          <v-text-field
            v-model="password"
            solo
            @input="checkForm"
            flat
            :hint="$t('import.password[2]')"
            class="password-input mt-1"
            name="input-password-login"
            type="password"
            :error-messages="passwordError"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="text-left pb-0 pt-1">
          <label class="sub-title-fields">
            {{ $t('import.password[1]') }}
          </label>
          <v-text-field
            v-model="passwordMatch"
            solo
            @input="checkForm"
            flat
            class="password-input mt-1"
            name="input-password-login"
            type="password"
            :error-messages="passwordMatchError"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="pl-0 py-2 ">
          <v-checkbox
            v-model="termsWallet"
            required
            class="terms mt-0 pl-3 text-left"
            color="#009fb1"
            hide-details
          >
            <div slot="label">
              {{ $t('create.stepper[2].terms[0]') }}
              <a
                class="links"
                target="_blank"
                color="#01a3b0"
                href="https://www.wallid.io/terms"
                @click.stop
              >
                {{ $t('create.stepper[2].terms[1]') }}
              </a>
            </div>
          </v-checkbox>
        </v-col>
        <v-col cols="12" class="pt-2">
          <v-btn
            id="import-button"
            text
            :disabled="isDisabled"
            @click="restorePassword"
            class="advance-btn"
          >
            {{ $t('import.button') }}
          </v-btn>
        </v-col>
      </form>
    </v-row>
    <v-row v-else>
      <v-col cols="12" class="text-center mt-13 pt-14 pb-1">
        <Sucessfully
      /></v-col>
      <v-col cols="12" class="pt-1">
        <h2 class="T1 mb-5 text-center">
          {{ $t('create.stepper[3].title') }}
        </h2>
        <h3 class="sub-title-fields text-center">
          {{ $t('import.text') }}
        </h3>
      </v-col>
      <v-col cols="12">
        <v-btn text @click="goToLogin" class="advance-btn">
          {{ $t('create.stepper[3].button') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from '../images/icon-arrow-back.vue';
import EyeUnselected from '../images/icon-eye-unselected.vue';
import EyeSelected from '../images/icon-eye-selected.vue';
import Sucessfully from '../images/icon-sucessfully.vue';
import { CREATE_NEW_WALLET } from '../store/actions';

export default {
  components: {
    ArrowBack,
    EyeUnselected,
    Sucessfully,
    EyeSelected,
  },
  computed: {
    isDisabled() {
      return (
        this.errorSeedPhrase ||
        !this.password ||
        !this.passwordMatch ||
        !this.termsWallet
      );
    },
  },

  data() {
    return {
      imported: false,
      showSeedPhrase: true,
      seedPhrase: '',
      password: '',
      passwordMatch: '',
      passwordError: '',
      passwordMatchError: '',
      errorSeedPhrase: false,
      seedPhraseErrorMessage: '',
      termsWallet: false,
    };
  },
  mounted() {},
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    validSeedPhrase() {
      this.seedPhrase = this.seedPhrase.trim();
      let valid = this.seedPhrase.split(' ').length == 12;
      this.errorSeedPhrase = !valid;
      this.seedPhraseErrorMessage = valid
        ? ''
        : this.$t('restore.seedPhrase[3]');
      if (valid) {
        this.scrollInto('import-form', 120);
      }
      return valid;
    },

    show() {
      this.showSeedPhrase = !this.showSeedPhrase;
    },
    stepBack() {
      this.$router.push('/home');
    },
    restorePassword() {
      this.$store
        .dispatch(CREATE_NEW_WALLET, {
          seed: this.seedPhrase,
          password: this.password,
        })
        .then(() => {
          this.imported = true;
        })
        .catch((e) => {
          if ((e = this.INVALID)) {
            this.errorSeedPhrase = true;
            this.seedPhraseErrorMessage = this.$t('restore.seedPhrase[4]');
          }
          console.error(err);
        });
    },

    checkForm() {
      this.passwordError = '';
      this.passwordMatchError = '';

      if (this.password && this.password.length < 8) {
        this.passwordError = 'Password not long enough';
      }

      if (this.passwordMatch && this.passwordMatch != this.password) {
        this.passwordMatchError = 'Passwords don’t match';
      }

      if (this.passwordError || this.passwordMatchError) {
        return;
      }
    },

    refreshState() {},
  },
};
</script>

<style lang="scss">
.restore {
  overflow: hidden auto;
  height: 523px;

  .terms {
    .v-input__slot {
      align-items: start;
    }
    .links {
      display: contents !important;
    }
    div {
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.43;
      letter-spacing: normal;
      text-align: left;
      color: var(--charcoal-grey);
    }
  }
  .seed-phrase.password-input {
    .v-input__slot {
      margin-bottom: 0 !important;
      .v-input__append-inner:hover {
        svg path {
          fill: var(--teal-blue);
        }
        svg path:nth-child(2) {
          stroke: var(--teal-blue);
        }
      }
    }
  }
}

.seed-phrase-tooltip {
  margin-left: 2px;
  &.v-tooltip__content {
    border-radius: 3px;
    background-color: #eeeeee;
    max-width: 81px;
    max-height: 43px;
    padding: 0 7px;
  }
  p {
    margin: 0;
    font-size: 11px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey);
  }
  .arrow-seed-tooltip {
    background-color: #eeeeee;
    transform: rotate(45deg);
    width: 15px;
    height: 15px;
    position: absolute;
    top: -6px;
    left: 35px;
    z-index: -1;
  }
}
</style>
