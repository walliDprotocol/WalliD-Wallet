<template>
  <v-stepper class="stepper-create pa-2 mt-n2" v-model="step">
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center my-8 pt-5">
              <v-img
                center
                width="65"
                height="65"
                class="ma-auto"
                contain
                src="../images/logos/logo-wallid.png"
              />
            </v-col>
            <v-col cols="12" class="pt-5 pb-8 px-14">
              <h2 class="T1 mb-5 text-center">
                {{ $t('create.title') }}
              </h2>
              <h3 class="sub-title-fields text-center">
                {{ $t('create.text') }}
              </h3>
            </v-col>
            <v-col cols="12" class="py-4">
              <v-btn text @click="getStarted" class="advance-btn">
                {{ $t('create.button') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-container class="text-left">
          <v-row>
            <v-col cols="12" class="pb-2">
              <div class="back-arrow mb-6">
                <v-btn text @click="stepBack" class="back-btn">
                  <ArrowBack />
                </v-btn>
                <h2 class="T1">
                  {{ $t('create.stepper[' + step + '].title') }}
                </h2>
              </div>
              <h3 class="sub-title-fields">
                {{ $t('create.stepper[' + step + '].text') }}
              </h3>
            </v-col>
            <v-col cols="12" class="pt-7">
              <!-- Remove on click, add again if user clicks 
              outside plugin login and doesnt sign in  -->
              <div
                class="flow-selector"
                @mouseover="IconAdd = 'IconAddHover'"
                @mouseout="IconAdd = 'IconAdd'"
                @click="step = 3"
              >
                <component :is="IconAdd" class=""></component>
                <p>
                  {{ $t('create.stepper[' + step + '].buttonCreate') }}
                </p>
              </div>
              <div
                class="flow-selector"
                @mouseover="IconImport = 'IconImportHover'"
                @mouseout="IconImport = 'IconImport'"
                @click="$router.push('/import')"
              >
                <component :is="IconImport" class=""></component>
                <p>
                  {{ $t('create.stepper[' + step + '].buttonImport') }}
                </p>
              </div>
              <div
                class="flow-selector"
                @mouseover="IconImport2 = 'IconImportHover'"
                @mouseout="IconImport2 = 'IconImport'"
                @click="$router.push('/importpk')"
              >
                <component :is="IconImport2" class=""></component>
                <p>Import using Private Key</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-form
          class="cmd-form"
          ref="form"
          @submit.prevent="setPassword"
          lazy-validation
          style="height: 520px"
        >
          <v-container class="text-left">
            <v-row>
              <v-col cols="12" class="pb-2">
                <div class="back-arrow mb-6">
                  <v-btn text @click="stepBack" class="back-btn">
                    <ArrowBack />
                  </v-btn>
                  <h2 class="T1">
                    {{ $t('create.stepper[' + step + '].title') }}
                  </h2>
                </div>
                <h3 class="sub-title-fields">
                  {{ $t('create.stepper[' + step + '].text') }}
                </h3>
              </v-col>
              <v-col cols="12" class="pt-0 pb-2">
                <label class="sub-title-fields">{{
                  $t('create.stepper[' + step + '].password[0]')
                }}</label>
                <v-text-field
                  v-model="password"
                  class="password-input mt-1"
                  :hint="$t('create.stepper[' + step + '].password[2]')"
                  flat
                  solo
                  @input="checkForm"
                  :error-messages="passwordError"
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-1">
                <label class="sub-title-fields">{{
                  $t('create.stepper[' + step + '].password[1]')
                }}</label>
                <v-text-field
                  v-model="passwordMatch"
                  class="password-input mt-1"
                  flat
                  solo
                  @input="checkForm"
                  :error-messages="passwordMatchError"
                  type="password"
                ></v-text-field>
              </v-col>

              <v-col v-if="false" cols="12" class="pl-0 py-2">
                <v-checkbox
                  v-model="termsWallet"
                  required
                  class="terms mt-0 pl-3 text-left"
                  color="#009fb1"
                  hide-details
                >
                  <div slot="label">
                    {{ $t('create.stepper[' + step + '].terms[0]') }}
                    <a
                      class="links"
                      target="_blank"
                      color="#01a3b0"
                      href="https://www.wallid.io/terms"
                      @click.stop
                    >
                      {{ $t('create.stepper[' + step + '].terms[1]') }}
                    </a>
                  </div>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-container>
          <v-btn
            text
            @click="setPassword"
            :disabled="isDisabled"
            class="advance-btn float"
          >
            {{ $t('create.stepper[' + step + '].button') }}
          </v-btn>
        </v-form>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-container class="text-left">
          <v-row>
            <v-col cols="12">
              <div class="back-arrow mb-6">
                <v-btn text @click="stepBack" class="back-btn">
                  <ArrowBack />
                </v-btn>
                <h2 class="T1">
                  {{ $t('create.stepper[' + step + '].title') }}
                </h2>
              </div>
              <h3
                class="sub-title-fields"
                v-html="$t('create.stepper[' + step + '].text')"
              ></h3>
            </v-col>

            <v-col cols="12" class="pt-2">
              <label class="sub-title-fields"
                >{{ $t('create.stepper[' + step + '].seed[0]') }}
                <span v-show="!seedLocked">
                  {{ $t('create.stepper[' + step + '].seed[1]') }}
                </span>
              </label>

              <div
                v-show="seedLocked"
                @click="seedLocked = false"
                class="blur-seed-box text-center"
              >
                <v-col cols="12" class="pb-1 pt-12">
                  <Unlock />
                </v-col>
                <v-col cols="12" class="pt-1">
                  {{ $t('create.stepper[' + step + '].seed[2]') }}
                </v-col>
              </div>
              <div
                :class="seedLocked ? 'blur-seed' : ''"
                class="seed-phrase mt-1"
              >
                {{ seedPhrase }}
              </div>
              <p class="hint-seed mt-2">
                {{ $t('create.stepper[' + step + '].seed[3]') }}
              </p>
            </v-col>
            <v-col cols="12" class="pb-0" style="min-height: 36px">
              <v-btn
                text
                class="links"
                v-show="seedLocked"
                @click="setReminder"
              >
                {{ $t('create.stepper[' + step + '].later') }}
              </v-btn>
            </v-col>
            <v-col cols="12" class="pt-1">
              <v-btn
                text
                :disabled="seedLocked"
                @click="setSeedPhrase"
                class="advance-btn"
              >
                {{ $t('create.stepper[' + step + '].button') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="5">
        <ConfirmSeed
          @stepBack="stepBack"
          @step="createWallet"
          :seedPhrase="seedPhrase"
        />
      </v-stepper-content>

      <v-stepper-content step="6">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center mt-12 pt-8 pb-1">
              <v-img
                center
                width="142"
                height="129"
                class="ma-auto"
                contain
                src="../images/img/img-success.png"
              />
            </v-col>
            <v-col cols="12" class="">
              <h2 class="T1 mb-5 text-center">
                {{ $t('create.stepper[' + step + '].title') }}
              </h2>
              <h3 class="sub-title-fields text-center">
                {{ $t('create.stepper[' + step + '].text') }}
              </h3>
            </v-col>
            <v-col cols="12">
              <v-btn text @click="goToLogin" class="advance-btn">
                {{ $t('create.stepper[' + step + '].button') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import ArrowBack from '../images/icon-arrow-back.vue';
import Unlock from '../images/icon-unlock.vue';
import ConfirmSeed from '../components/ConfirmSeed';
import Sucessfully from '../images/icon-sucessfully.vue';

import { CREATE_NEW_WALLET, GENERATE_NEW_SEED_PHRASE } from '../store/actions';

import IconAdd from '../images/icons/icon-add-new-unselected';
import IconImport from '../images/icons/icon-download';
import IconAddHover from '../images/icons/icon-add-new-selected';
import IconImportHover from '../images/icons/icon-download-selected';
import extension from 'extensionizer';

const { API } = extension.extension.getBackgroundPage();

export default {
  name: 'Create',
  components: {
    ArrowBack,
    Unlock,
    ConfirmSeed,
    Sucessfully,
    IconAdd,
    IconImport,
    IconAddHover,
    IconImportHover,
  },
  computed: {
    isDisabled() {
      return !this.password || !this.passwordMatch;
    },
  },
  methods: {
    getStarted() {
      this.step += 1;
    },
    stepBack() {
      this.step -= 1;
    },
    startOnboarding() {
      this.step += 1;
    },
    setSeedPhrase() {
      this.step += 1;
    },
    setReminder() {
      this.createWallet();
    },
    createWallet() {
      this.$store
        .dispatch(CREATE_NEW_WALLET, {
          seed: this.seedPhrase,
          password: this.password,
        })
        .then(() => {
          this.step = 6;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    checkForm() {
      this.passwordError = '';
      this.passwordMatchError = '';

      if (this.password && this.password.length < 8) {
        this.passwordError = this.$t('passwordErrors.lenght');
      }

      if (this.passwordMatch && this.passwordMatch != this.password) {
        this.passwordMatchError = this.$t('passwordErrors.match');
      }

      if (this.passwordError || this.passwordMatchError) {
        return;
      }
    },

    setPassword() {
      this.$store
        .dispatch(GENERATE_NEW_SEED_PHRASE, this.password)
        .then((seed) => {
          this.seedLocked = true;
          this.seedPhrase = seed;
          this.step += 1;
        })
        .catch((e) => {
          console.error(e);
        });
    },

    goToLogin() {
      API.eventProxy('wallid_wallet_done');
      this.$router.push('/login');
    },
  },
  data() {
    return {
      step: 1, // 1
      termsWallet: false,
      seedLocked: true,
      // Pass words as a string
      seedPhrase: '',
      password: '',
      passwordMatch: '',
      passwordError: '',
      passwordMatchError: '',
      IconAdd: 'IconAdd',
      IconImport: 'IconImport',
      IconImport2: 'IconImport',
    };
  },
};
</script>

<style lang="scss">
.stepper-create {
  box-shadow: none;
  .flow-selector {
    padding: 24px;
    border-radius: 6px;
    border: solid 1px #b8b9bb;
    max-width: 360px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    p {
      margin-left: 20px;
      margin-bottom: 0;
      font-size: 15px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.4;
      letter-spacing: normal;
      color: var(--charcoal-grey);
    }
    svg {
      width: 44px;
      height: 44px;
    }
    &:hover {
      border: solid 1px var(--teal-blue);

      p {
        color: var(--teal-blue);
      }
      svg {
        fill: var(--teal-blue);
      }
    }
  }
  .advance-btn.float {
    position: absolute;
    bottom: 12px;
    max-width: 360px;
    left: 8px;
  }
  .v-stepper__content {
    padding: 0;
  }
  label.v-label > div > a.links {
    display: inline !important;
  }
  .terms {
    .v-input__slot {
      align-items: start;
    }
    div {
      font-size: 14px;
      font-weight: 600;
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
    padding: 36px 43px !important;
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
