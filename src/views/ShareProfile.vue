<template>
  <v-container class="profile-proof-view">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow ">
          <v-btn text @click="$router.go('-1')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ $t('profiles.menu[1]') }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!linkProof" class="">
      <v-col cols="12" class="pt-1">
        <h3 class="sub-title-fields text-left">
          {{ $t('profiles.proof.text') }}
        </h3>
      </v-col>
      <v-col cols="12" class="">
        <v-form @submit.prevent="generateProof" ref="form">
          <v-card class="form-card">
            <v-col cols="12" class="">
              <jazz-icon
                :address="address"
                :id="'proof'"
                :size="77"
                :margin="4"
              />
              <p class="light-grey-text text-center">
                {{ $t('profiles.proof.address') }}
              </p>
              <div class="address-balloon">
                <p>
                  {{ address | truncate(8, '...') }}
                </p>
              </div>
            </v-col>
            <v-col
              v-for="profile in profiles"
              :key="profile.id"
              cols="12"
              class="py-0 list-profiles"
            >
              <v-container class="py-0 wrapper">
                <v-row>
                  <v-col cols="2" class="py-2 pl-0">
                    <SocialProfileImg :size="30" :name="profile.name" />
                  </v-col>
                  <v-col cols="8" class="pr-0 pl-1 py-2">
                    <v-container class="">
                      <v-row>
                        <v-col cols="12" class="py-0">
                          <p
                            class="sub-title-fields sub-title-fields--bold text-left text-uppercase"
                          >
                            {{ profile.name }}
                          </p>
                        </v-col>
                        <v-col cols="12" class="py-0">
                          <p class="sub-title-fields text-left">
                            {{ profile.username }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                  <v-col cols="2" class="pr-0 py-2">
                    <v-checkbox
                      v-model="selectedProfiles[profile.name]"
                      @change="checkSelectedProfiles()"
                      :hide-details="true"
                      color="#009fb1"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="12" class="py-0 list-profiles">
              <v-container class="py-0 wrapper">
                <v-row>
                  <v-col cols="2" class="py-2 pl-0">
                    <SocialProfileImg :size="30" :name="'AddProfile'" />
                  </v-col>
                  <v-col cols="8" class="pr-0 pl-1 py-2">
                    <v-container class="py-0">
                      <v-row>
                        <v-col cols="12" class="">
                          <a class="MAIN-LINKS">
                            {{ $t('profiles.addNew') }}
                          </a>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-card>
          <v-col cols="12 px-0">
            <v-btn
              text
              :isLoading="isLoading"
              @click="generateProof"
              :disabled="isDisabled"
              class="advance-btn inverted-colors "
            >
              {{ $t('profiles.proof.buttonGenProof') }}
            </v-btn>
          </v-col>
        </v-form>
      </v-col>
    </v-row>
    <v-row v-else class="">
      <v-col cols="12" class="pt-1">
        <h3 class="sub-title-fields text-left">
          {{ $t('proof.text1') }}
        </h3>
      </v-col>
      <v-col cols="12 text-left">
        <label class="sub-title-fields ">{{ $t('proof.link') }}</label>
        <v-tooltip content-class="wallet-tooltip" bottom>
          <template v-slot:activator="{ on }">
            <v-text-field
              v-on="on"
              id="walletCopy"
              v-model="linkProof"
              class="password-input mt-1"
              aria-readonly="true"
              flat
              @mouseover="copy = true"
              @mouseleave="delay()"
              @click="copyToClip"
              solo
              type="url"
            >
              <template slot="append">
                <Copy v-if="!copy"></Copy>
                <CopyHover v-else> </CopyHover>
              </template>
            </v-text-field>
          </template>
          <div class="arrow-seed-tooltip"></div>
          <div class="metamask-login">
            <p v-if="show">
              {{ copyAfter[$i18n.locale] }}
            </p>
            <p v-else>
              {{ copyBefore[$i18n.locale] }}
            </p>
          </div>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from '../images/icon-arrow-back.vue';
import IconAlert from '../images/icon-warning-red.vue';
import CopyHover from '../images/icon-copyclipboard-selected';
import Copy from '../images/icon-copyclipboard-unselected';

import WalletAddress from '../components/WalletAddress';

import SocialProfileImg from '../components/SocialProfileImg';

import { mapGetters } from 'vuex';
import { SHARE_PROFILE } from '../store/actions';

export default {
  components: {
    WalletAddress,
    IconAlert,
    ArrowBack,
    Copy,
    CopyHover,
    SocialProfileImg,
  },
  created() {
    console.log('currentProfile', this.currentProfile);

    this.selectedProfiles[this.currentProfile.name] = true;
    this.isDisabled = false;
  },
  mounted() {},
  computed: {
    ...mapGetters(['address', 'currentProfile', 'profiles']),
  },
  methods: {
    checkSelectedProfiles() {
      this.isDisabled = !Object.keys(this.selectedProfiles)
        .filter((el) => this.selectedProfiles[el])
        .map((el) => this.selectedProfiles[el])[0];

      console.log(this.isDisabled);
    },
    copyToClip() {
      const el = document.createElement('textarea');
      el.value = this.linkProof;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.show = true;
    },
    delay() {
      console.log('hover');
      setTimeout(() => {
        this.show = false;
        this.copy = false;
      }, 300);
    },
    checkURL() {
      this.urlError = '';

      var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ); // fragment locator
      if (!pattern.test(this.url)) {
        this.urlError = this.$t('proof.urlError');
      }
    },
    reconstructData(data) {
      let obj = {};

      data.front.forEach((item) => {
        console.log(item);
        obj[item.attr] = item.value;
      });
      obj['tables'] = data.table;
      console.log(obj);
      return obj;
    },

    generateProof() {
      this.debug('generateProof', this.selectedProfiles);
      let body = {
        user_id: this.card.userData._id,
        url: this.url,
      };
      this.isLoading = true;
      this.$store
        .dispatch(SHARE_PROFILE, body)
        .then((response) => {
          console.log('Proof');
          console.log(response);
          this.credentialName = this.card.credName;
          this.linkProof = response.data.data.proof;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;

          console.error(err);
        });
    },
  },
  data() {
    return {
      selectedProfiles: {},
      isLoading: false,
      isDisabled: true,
      url: null,
      card: null,
      urlError: '',
      credentialName: '',
      linkProof: '',
      copy: false,
      show: false,
      copyBefore: {
        en: 'Copy to clipboard',
        pt: 'Copiar',
      },
      copyAfter: {
        en: 'Copied!',
        pt: 'Copiado!',
      },
    };
  },
};
</script>

<style lang="scss">
#metamask-logo-proof {
  max-height: 89px;
  max-width: 89px;

  border-radius: 50%;
  border: solid 2px transparent;
  margin: auto;
}

.profile-proof-view {
  #walletCopy {
    cursor: pointer;
  }
  .password-input .v-input__slot input {
    font-size: 13px !important;
  }
  .v-card.form-card {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    overflow: auto;
    max-height: 320px;

    .address-balloon {
      padding: 7px 7px 7px 8px;
      border-radius: 15px;
      background-color: #dbedef;
      max-width: 32%;
      margin: 0 auto;
      p {
        margin-bottom: 0;

        font-size: 13px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #009fb1;
      }
    }

    .list-profiles {
      padding-left: 34px;
      padding-right: 34px;
      .wrapper {
        border-top: solid 1px #eeeeee;
        .sub-title-fields {
          font-size: 12px !important;
          font-weight: 600 !important;
        }
        .sub-title-fields--bold {
          font-size: 11px !important;
          font-weight: normal !important;
        }
        .MAIN-LINKS {
          font-size: 12px !important;
        }
        .v-icon {
          font-size: 18px;
        }
      }
    }
  }
  div.info {
    display: flex;
    padding: 16px;
    padding-right: 16px;
    border-radius: 3px;
    background-color: var(--pale-blue) !important;
    svg {
      min-width: 22px;
      margin-top: 4px;
      g {
        fill: #009fb1;
      }
    }
    p {
      margin-left: 18px !important;
      text-align: left;
      color: var(--teal-blue) !important;
    }
  }
}
</style>
