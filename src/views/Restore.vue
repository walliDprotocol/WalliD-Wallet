<template>
  <v-container class="restore mt-n2">
    <form @submit="checkForm">
      <v-row>
        <v-col cols="12">
          <div class="back-arrow mb-6">
            <v-btn text @click="stepBack" class="back-btn">
              <ArrowBack />
            </v-btn>
            <h2 class="T1">
              {{ $t("restore.title") }}
            </h2>
          </div>
          <h2 class="sub-title-fields text-left">
            {{ $t("restore.subtitle") }}
          </h2>
        </v-col>

        <v-col cols="12" class="text-left pb-1 pt-2">
          <label class="sub-title-fields">
            {{ $t("restore.seedPhrase[0]") }}
          </label>

          <v-text-field
            v-model="seedPhrase"
            solo
            flat
            v-show="showSeedPhrase"
            class="password-input seed-phrase mt-1"
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
                  {{ $t("restore.seedPhrase[1]") }}
                </p>
                <p v-show="!showSeedPhrase">
                  {{ $t("restore.seedPhrase[2]") }}
                </p>
              </v-tooltip>
            </template>
          </v-text-field>
          <v-textarea
            v-show="!showSeedPhrase"
            class="seed-phrase-revealed mt-1"
            no-resize
            rows="2"
            hide-details
            solo
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
                  {{ $t("restore.seedPhrase[1]") }}
                </p>
                <p v-show="!showSeedPhrase">
                  {{ $t("restore.seedPhrase[2]") }}
                </p>
              </v-tooltip>
            </template>
          </v-textarea>
        </v-col>
        <v-col cols="12" class="text-left pb-1 pt-1">
          <label class="sub-title-fields">
            {{ $t("restore.password[0]") }}
          </label>
          <v-text-field
            v-model="password"
            solo
            flat
            :hint="$t('create.stepper[0].password[2]')"
            class="password-input mt-1"
            name="input-password-login"
            type="password"
            :error-messages="passwordError"
          ></v-text-field>
        </v-col>

        <v-col cols="12" class="text-left pb-0 pt-1">
          <label class="sub-title-fields">
            {{ $t("restore.password[1]") }}
          </label>
          <v-text-field
            v-model="passwordMatch"
            solo
            flat
            class="password-input mt-1"
            name="input-password-login"
            type="password"
            :error-messages="passwordMatchError"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="pt-2">
          <v-btn
            text
            :disabled="isDisabled"
            @click="checkForm"
            class="advance-btn"
          >
            {{ $t("restore.button") }}
          </v-btn>
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
import ArrowBack from "../images/icon-arrow-back.vue";
import EyeUnselected from "../images/icon-eye-unselected.vue";
import EyeSelected from "../images/icon-eye-selected.vue";
import { CREATE_NEW_WALLET } from "../store/actions";

export default {
  components: {
    ArrowBack,
    EyeUnselected,
    EyeSelected,
  },
  computed: {
    isDisabled() {
      return !this.validSeedPhrase() || !this.password || !this.passwordMatch;
    },
  },

  data() {
    return {
      showSeedPhrase: true,
      seedPhrase: "",
      password: "",
      passwordMatch: "",
      passwordError: "",
      passwordMatchError: "",
    };
  },
  mounted() {},
  methods: {
    validSeedPhrase() {
      return this.seedPhrase.split(" ").length == 12;
    },
    show() {
      this.showSeedPhrase = !this.showSeedPhrase;
    },
    stepBack() {
      this.$router.push("/home");
    },
    restorePassword() {
      this.$store
        .dispatch(CREATE_NEW_WALLET, {
          seed: this.seedPhrase,
          password: this.password,
        })
        .then(() => {
          this.$router.push("/login");
          // this.passwordError = true;
        });
    },

    checkForm() {
      this.passwordError = "";
      this.passwordMatchError = "";

      if (this.password && this.password.length < 8) {
        this.passwordError = "Password not long enough";
      }

      if (this.passwordMatch && this.passwordMatch != this.password) {
        this.passwordMatchError = "Passwords don’t match";
      }

      if (this.passwordError || this.passwordMatchError) {
        return;
      }

      this.restorePassword();
    },

    refreshState() {},
  },
};
</script>

<style lang="scss">
.restore {
  .seed-phrase-revealed.v-textarea.v-input {
    .v-input__control {
      min-height: unset;
      .v-input__slot {
        margin: 0;
        padding: 5px 15px;
        border-radius: 3px;
        border: solid 1px #b8b9bb;
        .v-text-field__slot {
          align-self: flex-end;
          textarea {
            height: 32px;
            margin-top: 0 !important;
            font-size: 13px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.85;
            letter-spacing: normal;
            color: var(--charcoal-grey);
          }
        }
        .v-input__append-inner {
          margin-top: 7px;
        }
        .v-input__append-inner:hover {
          margin-top: 7px;

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
