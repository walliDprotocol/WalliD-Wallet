<template>
  <v-stepper class="stepper-create mt-n2" v-model="step">
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center my-8 pt-5">
              <v-img
                center
                width="151"
                height="51"
                class="ma-auto"
                contain
                src="../images/logo-wallid.png"
            /></v-col>
            <v-col cols="12" class="pt-5 pb-8 px-14">
              <h2 class="T1 mb-5 text-center">
                {{ $t("create.title") }}
              </h2>
              <h3 class="sub-title-fields text-center">
                {{ $t("create.text") }}
              </h3>
            </v-col>
            <v-col cols="12" class="py-4">
              <v-btn text @click="createWallet" class="advance-btn">
                {{ $t("create.button") }}
              </v-btn>
            </v-col>
            <v-col cols="12" class="px-10">
              <p class="text">
                {{ $t("create.import[0]") }}
                <router-link class="links mt-2" to="import">
                  {{ $t("create.import[1]") }}
                </router-link>
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-form
          class="cmd-form"
          ref="form"
          @submit.prevent="checkForm"
          lazy-validation
        >
          <v-container class="text-left">
            <v-row>
              <v-col cols="12">
                <div class="back-arrow mb-6">
                  <v-btn text @click="stepBack" class="back-btn">
                    <ArrowBack />
                  </v-btn>
                  <h2 class="T1">
                    {{ $t("create.stepper[0].title") }}
                  </h2>
                </div>
                <h3 class="sub-title-fields">
                  {{ $t("create.stepper[0].text") }}
                </h3>
              </v-col>
              <v-col cols="12" class="pt-0">
                <label class="sub-title-fields ">{{
                  $t("create.stepper[0].password[0]")
                }}</label>
                <v-text-field
                  v-model="password"
                  class="password-input mt-1"
                  :hint="$t('create.stepper[0].password[2]')"
                  flat
                  solo
                  :error-messages="passwordError"
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-1">
                <label class="sub-title-fields ">{{
                  $t("create.stepper[0].password[1]")
                }}</label>
                <v-text-field
                  v-model="passwordMatch"
                  class="password-input mt-1"
                  :hint="$t('create.stepper[0].password[2]')"
                  flat
                  solo
                  :error-messages="passwordMatchError"
                  type="password"
                ></v-text-field>
              </v-col>

              <v-col cols="12" class="pl-0 ">
                <v-checkbox
                  v-model="termsWallet"
                  required
                  class="terms mt-0 pl-3 text-left"
                  color="#009fb1"
                  hide-details
                >
                  <div slot="label">
                    {{ $t("create.stepper[0].terms[0]") }}
                    <a
                      class="links"
                      target="_blank"
                      color="#01a3b0"
                      href="https://www.wallid.io"
                      @click.stop
                    >
                      {{ $t("create.stepper[0].terms[1]") }}
                    </a>
                  </div>
                </v-checkbox>
              </v-col>
              <v-col cols="12" class="pt-2">
                <v-btn
                  text
                  @click="checkForm"
                  :disabled="isDisabled"
                  class="advance-btn"
                >
                  {{ $t("create.stepper[0].button") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-container class="text-left">
          <v-row>
            <v-col cols="12">
              <div class="back-arrow mb-6">
                <v-btn text @click="stepBack" class="back-btn">
                  <ArrowBack />
                </v-btn>
                <h2 class="T1">
                  {{ $t("create.stepper[1].title") }}
                </h2>
              </div>
              <h3
                class="sub-title-fields"
                v-html="$t('create.stepper[1].text')"
              ></h3>
            </v-col>

            <v-col cols="12" class="pt-2">
              <label class="sub-title-fields "
                >{{ $t("create.stepper[1].seed[0]") }}
                <span v-show="!seedLocked">
                  {{ $t("create.stepper[1].seed[1]") }}
                </span></label
              >

              <div
                v-show="seedLocked"
                @click="seedLocked = false"
                class="blur-seed-box text-center"
              >
                <v-col cols="12" class="pb-1 pt-12">
                  <Unlock />
                </v-col>
                <v-col cols="12" class="pt-1 ">
                  {{ $t("create.stepper[1].seed[2]") }}
                </v-col>
              </div>
              <div
                :class="seedLocked ? 'blur-seed' : ''"
                class="seed-phrase mt-1"
              >
                {{ seedPhrase }}
              </div>
              <p class="hint-seed mt-2">
                {{ $t("create.stepper[1].seed[3]") }}
              </p>
            </v-col>
            <v-col cols="12" class="pb-0" style="min-height:36px">
              <v-btn
                text
                class="links "
                v-show="seedLocked"
                @click="setReminder"
              >
                {{ $t("create.stepper[1].later") }}
              </v-btn>
            </v-col>
            <v-col cols="12" class="pt-1">
              <v-btn
                text
                :disabled="seedLocked"
                @click="setSeedPhrase"
                class="advance-btn"
              >
                {{ $t("create.stepper[1].button") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="4">
        <ConfirmSeed
          @stepBack="stepBack"
          @step="step += 1"
          :seedPhrase="seedPhrase"
        />
      </v-stepper-content>

      <v-stepper-content step="5">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center mt-13 pt-14 pb-1">
              <Sucessfully
            /></v-col>
            <v-col cols="12" class="pt-1">
              <h2 class="T1 mb-5 text-center">
                {{ $t("create.stepper[3].title") }}
              </h2>
              <h3 class="sub-title-fields text-center">
                {{ $t("create.stepper[3].text") }}
              </h3>
            </v-col>
            <v-col cols="12">
              <v-btn text @click="goToLogin" class="advance-btn">
                {{ $t("create.stepper[3].button") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import ArrowBack from "../images/icon-arrow-back.vue";
import Unlock from "../images/icon-unlock.vue";
import ConfirmSeed from "../components/ConfirmSeed";
import Sucessfully from "../images/icon-sucessfully.vue";

export default {
  name: "Create",
  components: {
    ArrowBack,
    Unlock,
    ConfirmSeed,
    Sucessfully,
  },
  computed: {
    isDisabled() {
      return !this.termsWallet || !this.password || !this.passwordMatch;
    },
  },
  methods: {
    stepBack() {
      this.step -= 1;
    },
    createWallet() {
      this.step += 1;
    },
    setSeedPhrase() {
      this.step += 1;
    },
    setReminder() {
      this.step += 1;
    },

    checkForm() {
      this.passwordError = "";
      this.passwordMatchError = "";

      if (this.password) {
        if (this.password.length < 8) {
          this.passwordError = "Password not long enough";
        }
      } else {
        this.passwordError = "Required";
      }
      console.log(this.passwordMatch);
      if (this.passwordMatch) {
        if (this.passwordMatch.length < 8) {
          this.passwordMatchError = "Password not long enough";
        } else if (this.passwordMatch != this.password) {
          this.passwordMatchError = "Passwords don’t match";
        }
      } else {
        this.passwordMatchError = "Required";
      }

      if (this.passwordError || this.passwordMatchError) {
        return;
      }
      this.setPassword();
    },

    setPassword() {
      this.step += 1;
    },

    goToLogin() {
      this.$router.push("/login");
    },
  },
  data() {
    return {
      step: 3,
      termsWallet: false,
      seedLocked: true,
      // Pass words as a string
      seedPhrase:
        "foster million smart lady december maple bench nose quarter film eye goat",
      password: "",
      passwordMatch: "",
      passwordError: "",
      passwordMatchError: "",
    };
  },
};
</script>

<style lang="scss">
.stepper-create {
  box-shadow: none;

  .v-stepper__content {
    padding: 0;
  }

  .terms {
    .v-input__slot {
      align-items: start;
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

  .seed-phrase {
    padding: 0;
    margin: 0;
    border-radius: 3px;
    background-color: #eeeeee;
    padding: 36px 63px !important;
    margin-top: 0;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey);
  }

  .blur-seed {
    filter: blur(2.5px);
    transition: all 0.3s linear;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .blur-seed-box {
    transition: all 0.3s linear;
    position: absolute;
    border-radius: 3px;
    margin-top: 4px;
    user-select: none;
    width: 360px;
    height: 143px;
    opacity: 0.62;
    background-color: var(--charcoal-grey);
    font-size: 13px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--white);
    align-items: center;
    text-align: center;
    cursor: pointer;
    z-index: 6;
  }
  .hint-seed {
    font-family: Montserrat;
    font-size: 13px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #b8b9bb;
  }
}
</style>
