<template>
  <v-stepper class="stepper-create pa-2 mt-n2" v-model="step">
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-container class="text-left">
          <v-row>
            <v-col cols="12" class="pb-2">
              <div class="back-arrow mb-6 mt-3">
                <v-btn text @click="close" class="back-btn">
                  <ArrowBack />
                </v-btn>
                <h2 class="T1">Lukso Universal Profile</h2>
              </div>
              <h3 class="sub-title-fields">
                You’ll need a Universal Profile to interact with Lukso network. Create a new
                Universal Profile or import an existing using it’s private key.
              </h3>
            </v-col>
            <v-col cols="12" class="pt-7">
              <!-- Remove on click, add again if user clicks 
              outside plugin login and doesnt sign in  -->
              <div
                class="flow-selector"
                @mouseover="IconAdd = 'IconAddHover'"
                @mouseout="IconAdd = 'IconAdd'"
                @click="(step = 2), (path = 'create')"
              >
                <component :is="IconAdd" class=""></component>
                <p>Create a Universal Profile</p>
              </div>
              <div
                class="flow-selector"
                @mouseover="IconImport = 'IconImportHover'"
                @mouseout="IconImport = 'IconImport'"
                @click="(step = 2), (path = 'import')"
              >
                <component :is="IconImport" class=""></component>
                <p>Import a Universal Profile</p>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <a
                @click="close()"
                href="https://docs.lukso.tech/standards/universal-profile/introduction/"
                target="_blank"
                style="text-decoration: none; color: #009fb1; font-size: 12px; font-weight: 500"
              >
                Know more about Lukso’s Universal Profiles
              </a>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-container class="text-left">
          <v-row>
            <v-col cols="12" class="pb-2">
              <div class="back-arrow mb-6 mt-3">
                <v-btn text @click="stepBack" class="back-btn">
                  <ArrowBack />
                </v-btn>
                <h2 class="T1">
                  {{ (path === 'create' ? 'Create ' : 'Import ') + 'a Universal Profile' }}
                </h2>
              </div>
            </v-col>
            <v-col cols="12" class="d-flex align-center justify-center">
              <v-img
                src="../images/logos/icon-up-lukso-default@2x.png"
                style="max-width: 64px"
              ></v-img>
            </v-col>
            <v-col cols="12" class="pt-0 pb-2">
              <label class="sub-title-fields">
                {{ path === 'create' ? 'Username' : 'Universal Profile Address' }}
              </label>
              <v-text-field
                v-model="username"
                class="password-input mt-1"
                flat
                solo
                @input="checkForm"
                :error-messages="validAddressError"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row style="padding-top: 11rem">
            <v-col cols="6" class="pt-1">
              <v-btn text @click="step = 1" class="cancel-btn">Cancel</v-btn>
            </v-col>
            <v-col cols="6" class="pt-1">
              <v-btn :loading="isLoading" text @click="setupUniversalProfile" class="advance-btn">
                {{ (path === 'create' ? 'Create ' : 'Import ') + 'Profile' }}
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
const { API } = chrome.extension.getBackgroundPage();

import { mapState } from 'vuex';

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
      return !this.termsWallet || !this.password || !this.passwordMatch;
    },
    ...mapState('networks', ['previousNetwork']),
  },
  methods: {
    close() {
      this.$store.dispatch('networks/changeRpcTarget', {
        ...this.previousNetwork,
      });

      this.$router.go('-1');
    },
    getStarted() {
      this.step += 1;
    },
    stepBack() {
      this.username = null;
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
    async setupUniversalProfile() {
      this.isLoading = true;
      this.validAddressError = '';
      if (this.path === 'import') {
        let { error, myUPAddress } = await this.$store.dispatch(
          'lukso/importUniversalProfile',
          this.username
        );
        console.log(error);
        if (error) this.validAddressError = error;
        if (myUPAddress) this.$router.go('-1');
      } else {
        let { myUPAddress } = await this.$store.dispatch('lukso/createUniversalProfile', {
          username: this.username,
        });
        if (myUPAddress) this.$router.go('-1');
      }

      this.isLoading = false;
    },
    checkForm() {
      this.validAddressError = '';

      if (this.path === 'import' && !this.validateAddress(this.username).isValid) {
        this.validAddressError = 'Please enter a valid address';
      } else {
        return;
      }
    },
  },
  data() {
    return {
      isLoading: false,
      step: 1, // 1
      termsWallet: false,
      username: '',
      validAddressError: '',
      IconAdd: 'IconAdd',
      IconImport: 'IconImport',
      IconImport2: 'IconImport',
      path: '',
    };
  },
};
</script>

<style lang="scss">
.stepper-create {
  box-shadow: none !important;
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
