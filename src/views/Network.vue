<template>
  <v-container class="text-left">
    <v-row>
      <v-col cols="12" class="pb-2">
        <div class="back-arrow mb-6">
          <v-btn text @click="$router.go('-1')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            Lukso Universal Profile
          </h2>
        </div>
        <h3 class="sub-title-fields">
          You’ll need an Universal Profile to interact with Lukso network.
          Create a new Universal Profile or import an existing using it’s
          private key.
        </h3>
      </v-col>
      <v-col cols="12" class="pt-7">
        <div
          class="flow-selector d-flex align-center justify-center pa-8"
          style="
            border: 1px solid #b8b9bb;
            border-radius: 6px;
            font-size: 15px;
          "
          @mouseover="IconAdd = 'IconAddHover'"
          @mouseout="IconAdd = 'IconAdd'"
          @click=";(buttonClicked = 'Create'), (showModal = true)"
        >
          <component :is="IconAdd" class=""></component>
          <p>
            Create an Universal Profile
          </p>
        </div>
        <div
          class="flow-selector d-flex align-center justify-center pa-8"
          style="
            border: 1px solid #b8b9bb;
            border-radius: 6px;
            font-size: 15px;
          "
          @mouseover="IconImport = 'IconImportHover'"
          @mouseout="IconImport = 'IconImport'"
          @click=";(buttonClicked = 'Import'), (showModal = true)"
        >
          <component :is="IconImport" class=""></component>
          <p>
            Import an existing Universal Profile
          </p>
        </div>
      </v-col>
      <v-col cols="12">
        <a
          style="
            font-size: 12px;
            font-weight: 500;
            color: #009fb1;
            text-decoration: none;
          "
          href="https://docs.lukso.tech/standards/universal-profile/introduction/"
          target="_blank"
        >
          Know more about Lukso’s Universal Profiles
        </a>
      </v-col>
    </v-row>
    <v-form
      v-if="showModal"
      class="cmd-form"
      ref="form"
      @submit.prevent="setPassword"
      lazy-validation
      style="height: 520px; position: fixed; top: 0; bottom: 0;"
    >
      <v-container class="text-left">
        <v-row>
          <v-col cols="12" class="pb-2">
            <div class="back-arrow mb-6">
              <v-btn text @click="stepBack" class="back-btn">
                <ArrowBack />
              </v-btn>
              <h2 class="T1">
                {{ buttonClicked + ' an Universal Profile' }}
              </h2>
            </div>
            <!--                 <h3 class="sub-title-fields">
                  {{ buttonClicked === 'Create' ? 'Username' : 'Universal Profile Address' }}
                </h3> -->
          </v-col>
          <v-col class="d-flex justify-center">
            <v-img src="../images/icons/icon-up-lukso-default@3x.png"></v-img>
          </v-col>
          <v-col cols="12" class="pt-0 pb-2">
            <label class="sub-title-fields">
              {{
                buttonClicked === 'Create'
                  ? 'Username'
                  : 'Universal Profile Address'
              }}
            </label>
            <v-text-field
              v-model="password"
              class="password-input mt-1"
              flat
              solo
              @input="checkForm"
              :rules="universalProfileRules"
            ></v-text-field>
          </v-col>
          <v-col cols="6" class="pt-1">
            <v-btn text @click="close()" class="cancel-btn">
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6" class="pt-1">
            <v-btn text @click="confirmDelete()" class="advance-btn">
              {{ buttonClicked + ' Profile' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import ArrowBack from '../images/icon-arrow-back.vue'
import Unlock from '../images/icon-unlock.vue'
import ConfirmSeed from '../components/ConfirmSeed'
import Sucessfully from '../images/icon-sucessfully.vue'

import { CREATE_NEW_WALLET, GENERATE_NEW_SEED_PHRASE } from '../store/actions'

import IconAdd from '../images/icons/icon-add-new-unselected'
import IconImport from '../images/icons/icon-download'
import IconAddHover from '../images/icons/icon-add-new-selected'
import IconImportHover from '../images/icons/icon-download-selected'
const { API } = chrome.extension.getBackgroundPage()

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
      return !this.termsWallet || !this.password || !this.passwordMatch
    },
  },
  methods: {
    getStarted() {
      this.step += 1
    },
    stepBack() {
      this.step -= 1
    },
    startOnboarding() {
      this.step += 1
    },
    setSeedPhrase() {
      this.step += 1
    },
    setReminder() {
      this.createWallet()
    },
    createWallet() {
      this.$store
        .dispatch(CREATE_NEW_WALLET, {
          seed: this.seedPhrase,
          password: this.password,
        })
        .then(() => {
          this.step = 6
        })
        .catch((e) => {
          console.error(e)
        })
    },
    checkForm() {
      this.passwordError = ''
      this.passwordMatchError = ''

      if (this.password && this.password.length < 8) {
        this.passwordError = this.$t('passwordErrors.lenght')
      }

      if (this.passwordMatch && this.passwordMatch != this.password) {
        this.passwordMatchError = this.$t('passwordErrors.match')
      }

      if (this.passwordError || this.passwordMatchError) {
        return
      }
    },

    setPassword() {
      this.$store
        .dispatch(GENERATE_NEW_SEED_PHRASE, this.password)
        .then((seed) => {
          this.seedLocked = true
          this.seedPhrase = seed
          this.step += 1
        })
        .catch((e) => {
          console.error(e)
        })
    },

    goToLogin() {
      API.eventProxy('wallid_wallet_done')
      this.$router.push('/login')
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
      buttonClicked: '',
      showModal: false,
      universalProfileError: [
        (value) => !!value || 'Please eneter a valid address',
      ],
    }
  },
}
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
