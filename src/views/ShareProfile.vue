<template>
  <v-container class="profile-proof-view pa-5">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow">
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
            <v-col v-if="false" cols="12" class="">
              <jazz-icon
                :address="walletAddress"
                :id="'proof'"
                :size="77"
                :margin="4"
              />
              <p class="light-grey-text text-center">
                {{ $t('profiles.proof.address') }}
              </p>
              <div class="address-balloon">
                <p>
                  {{ address | truncate(12, '...') }}
                </p>
              </div>
            </v-col>
            <v-col
              v-for="asset in assets"
              :key="asset.id"
              cols="12"
              class="list-profiles pb-0"
            >
              <v-container class="wrapper">
                <v-row>
                  <v-col cols="2" class="pb-1 pl-0">
                    <StoredProfileImg
                      class="mt-0 pt-0"
                      :size="40"
                      :src="asset.assetImagePath"
                    />
                  </v-col>
                  <v-col cols="8" class="pb-1 pr-0 pl-1">
                    <v-container class="">
                      <v-row>
                        <v-col cols="12" class="py-0">
                          <p
                            v-if="asset.showBalance"
                            class="sub-title-fields sub-title-fields--bold text-left text-uppercase"
                          >
                            {{ asset.balanceOf | truncate(10) }}
                            {{ asset.tokenSymbol }}
                          </p>
                          <p
                            v-else-if="
                              asset.assetType.isLSP7 || asset.assetType.native
                            "
                            class="sub-title-fields text-left sub-title-fields--bold"
                          >
                            {{ asset.tokenName }}
                          </p>
                          <p
                            v-else
                            class="sub-title-fields sub-title-fields--bold text-left"
                          >
                            {{ asset.tokenSymbol }}
                            {{
                              (' #' + asset.tokenId) | truncate(16, '...', 6)
                            }}
                          </p>
                        </v-col>
                        <v-col cols="12" class="py-0">
                          <p
                            v-if="asset.assetType.isLSP8"
                            class="sub-title-fields text-left"
                          >
                            {{ asset.tokenName }}
                          </p>
                          <div v-else class="d-flex align-center justify-start">
                            <p
                              v-if="!asset.assetType.isLSP8"
                              class="d-flex mr-1"
                              style="font-size: 11px"
                            >
                              Show Balance
                            </p>
                            <v-switch
                              v-if="!asset.assetType.isLSP8"
                              style="max-width: 40px"
                              class="mt-0 balance-switch"
                              hide-details
                              dense
                              :ripple="false"
                              v-model="asset.showBalance"
                            ></v-switch>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                  <v-col cols="2" class="pb-1 pr-0">
                    <v-checkbox
                      class="mt-2"
                      :ripple="false"
                      v-model="
                        selectedProfiles[
                          asset.tokenId ||
                            asset.assetAddress ||
                            asset.tokenSymbol
                        ]
                      "
                      @change="checkSelectedProfiles()"
                      :hide-details="true"
                      color="#009fb1"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col
              v-for="profile in profiles"
              :key="profile.id"
              cols="12"
              class="list-profiles pb-0"
            >
              <v-container class="wrapper">
                <v-row>
                  <v-col cols="2" class="pb-1 pl-0">
                    <StoredProfileImg
                      class="mt-0 pt-0"
                      :size="40"
                      :name="getSocialName(profile)"
                    />
                  </v-col>
                  <v-col cols="8" class="pb-1 pr-0 pl-1">
                    <v-container class="">
                      <v-row>
                        <v-col cols="12" class="py-0">
                          <p
                            class="sub-title-fields sub-title-fields--bold text-left text-uppercase"
                          >
                            {{ getSocialName(profile) }}
                          </p>
                        </v-col>
                        <v-col cols="12" class="py-0">
                          <p class="sub-title-fields text-left">
                            {{ getUsername(profile) | truncate(16, '...') }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                  <v-col cols="2" class="pb-1 pr-0">
                    <v-checkbox
                      class="mt-2"
                      :ripple="false"
                      v-model="selectedProfiles[profile.id]"
                      @change="checkSelectedProfiles()"
                      :hide-details="true"
                      color="#009fb1"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col
              v-for="identity in identities"
              :key="identity.id"
              cols="12"
              class="list-profiles pb-0"
            >
              <v-container class="wrapper text-left">
                <v-row>
                  <v-col cols="2" class="pb-1 pl-0">
                    <StoredProfileImg
                      class="mt-0 pt-0"
                      :size="40"
                      :name="identity.idt"
                    />
                  </v-col>
                  <v-col cols="8" class="pb-1 pr-0 pl-1">
                    <v-container class="">
                      <v-row>
                        <v-col cols="12" class="py-0">
                          <p class="sub-title-fields sub-title-fields--bold">
                            {{ getIDTName(identity.idt) }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                  <v-col cols="2" class="pb-1 pr-0">
                    <v-checkbox
                      class="mt-2"
                      :ripple="false"
                      v-model="selectedProfiles[identity.idt]"
                      @change="checkSelectedProfiles()"
                      :hide-details="true"
                      color="#009fb1"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col
              v-for="credential in credentials"
              :key="credential.id"
              cols="12"
              class="list-profiles pb-0"
            >
              <v-container class="wrapper text-left">
                <v-row>
                  <v-col cols="2" class="pb-1 pl-0">
                    <StoredProfileImg
                      class="mt-0 pt-0"
                      :size="40"
                      :name="credential.assetName"
                      :src="getImage(credential)"
                    />
                  </v-col>
                  <v-col cols="8" class="pb-1 pr-0 pl-1">
                    <v-container class="">
                      <v-row>
                        <v-col cols="12" class="py-0">
                          <p class="sub-title-fields sub-title-fields--bold">
                            {{ getName(credential) }}
                          </p>
                          <p class="sub-title-fields" style="font-weight: 500">
                            {{
                              getCredentialName(credential)
                                | truncate(16, '...')
                            }}
                          </p>
                        </v-col>
                        <!-- <v-col cols="12" class="py-0">
                          <p class="sub-title-fields text-left">
                            {{
                              profile.profileData.screen_name ||
                                profile.username
                            }}
                          </p>
                        </v-col>-->
                      </v-row>
                    </v-container>
                  </v-col>
                  <v-col cols="2" class="pb-1 pr-0">
                    <v-checkbox
                      class="mt-2"
                      :ripple="false"
                      v-model="selectedProfiles[credential.id]"
                      @change="checkSelectedProfiles()"
                      :hide-details="true"
                      color="#009fb1"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col v-if="false" cols="12" class="py-0 list-profiles">
              <v-container class="py-0 pt-1 wrapper">
                <v-row>
                  <v-col cols="2" class="py-1 pl-0">
                    <StoredProfileImg :size="40" :name="'AddProfile'" />
                  </v-col>
                  <v-col cols="8" class="py-1 pr-0 pl-1">
                    <v-container class="py-1">
                      <v-row>
                        <v-col cols="12" class="pr-0">
                          <a
                            class="MAIN-LINKS"
                            href="https://www.wallid.io/Setup/ChooseIdentity?online=true"
                            target="_blank"
                          >
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
              class="advance-btn inverted-colors float"
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
          {{ $t('profiles.proof.text2') }}
        </h3>
      </v-col>
      <v-col cols="12 text-left">
        <label class="sub-title-fields">{{ $t('proof.link') }}</label>
        <CopyPaste :input="linkProof">
          <div @click="copyToClip" class="password-wrapper" style="">
            <div class="password-input">
              {{ linkProof }}
            </div>
          </div>
        </CopyPaste>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from '../images/icon-arrow-back.vue';
import IconAlert from '../images/icon-warning-red.vue';
import CopyHover from '../images/icon-copyclipboard-selected';
import Copy from '../images/icon-copyclipboard-unselected';

import CopyPaste from '../components/CopyPaste';

import StoredProfileImg from '../components/StoredProfileImg';

import { mapGetters, mapState } from 'vuex';
import { SHARE_PROFILE } from '../store/actions';

const VERIFY_URL = 'https://verify.wallid.io/';

export default {
  components: {
    IconAlert,
    ArrowBack,
    Copy,
    CopyHover,
    StoredProfileImg,
    CopyPaste,
  },
  beforeDestroy() {
    this.$store.commit('currentProfile', null);
    this.$store.commit('setCurrentCred', null);
    this.$store.commit('setCurrentAsset', null);
  },
  created() {
    console.log('currentProfile', this.currentProfile);
    console.log('currentAsset', this.currentAsset);
    console.log('list credentials', this.credentials);

    if (this.currentProfile) {
      this.selectedProfiles[this.currentProfile.id] = true;
    }
    if (this.currentAsset) {
      this.selectedProfiles[
        this.currentAsset.tokenId ||
          this.currentAsset.assetAddress ||
          this.currentAsset.tokenSymbol
      ] = true;
    }
    if (this.currentCred) {
      this.selectedProfiles[this.currentCred.id] = true;
    }

    this.isDisabled = false;
  },
  mounted() {},
  computed: {
    ...mapGetters([
      'address',
      'currentProfile',
      'currentCred',
      'profiles',
      'identities',
      'identities',
      'credentials',
      'assets',
    ]),
    ...mapState({
      walletAddress: 'address',
      currentAsset: 'currentAsset',
    }),
  },
  methods: {
    getImage(card) {
      return (
        card.userData?.imgArray?.[0] ||
        card.userData?.credential_img ||
        card.userData?.frontend_props?.preview ||
        card.photoURL
      );
    },
    getName(credential) {
      if (this.isNFT(credential)) {
        return (
          credential.userData.user_data['PROJECT'] +
          '#' +
          (credential.userData.user_data['TOKEN ID'].length > 10
            ? this.reducedString(credential.userData.user_data['TOKEN ID'])
            : credential.userData.user_data['TOKEN ID'])
        );
      }

      return credential.credName || credential.assetName;
    },
    getCredentialName(credential) {
      return credential.caName || credential.username;
    },
    checkSelectedProfiles() {
      this.isDisabled = !Object.keys(this.selectedProfiles)
        .filter((el) => this.selectedProfiles[el])
        .map((el) => this.selectedProfiles[el])[0];

      console.log(this.isDisabled);
    },
    copyToClip() {
      try {
        this.copyToClipboard(this.linkProof);
        this.show = true;
      } catch (err) {
        console.error(err);
      }
    },
    copyToClipboard(text) {
      if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData('Text', text);
      } else if (
        document.queryCommandSupported &&
        document.queryCommandSupported('copy')
      ) {
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
          return document.execCommand('copy'); // Security exception may be thrown by some browsers.
        } catch (ex) {
          console.warn('Copy to clipboard failed.', ex);
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      }
    },
    delay() {
      console.log('hover');
      setTimeout(() => {
        this.show = false;
        this.copy = false;
      }, 300);
    },

    generateProof() {
      this.debug('generateProof', this.selectedProfiles);
      this.isLoading = true;

      let social_data = this.profiles.filter(
        ({ id }) => this.selectedProfiles[id]
      );

      social_data = social_data.concat(
        this.identities.filter(({ idt }) => this.selectedProfiles[idt])
      );

      social_data = social_data.concat(
        this.credentials.filter(({ id }) => this.selectedProfiles[id])
      );

      social_data = social_data.concat(
        this.assets
          .filter(
            ({ tokenId, assetAddress, tokenSymbol }) =>
              this.selectedProfiles[tokenId || assetAddress || tokenSymbol]
          )
          .map(({ showBalance, balanceOf, ...asset }) => {
            if (showBalance) return { ...asset, balanceOf };
            return asset;
          })
      );
      let body = {
        wa: this.address,
        social_data: social_data,
      };

      console.log(social_data);

      this.$store
        .dispatch('socialIds/' + SHARE_PROFILE, body)
        .then((response) => {
          console.log('Proof');
          console.log(response);
          this.linkProof = VERIFY_URL + response.data.data.share_id;
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
      showBalance: true,
      selectedProfiles: {},
      isLoading: false,
      isDisabled: true,
      url: null,
      card: null,
      urlError: '',
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
      // Delete this and add identities in getters
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
  .balance-switch.v-input--switch {
    .v-input--switch__track {
      height: 10px;
      width: 25px;
    }
    .v-input--switch__thumb {
      height: 15px;
      width: 15px;
    }

    &.v-input--is-dirty .v-input--switch__thumb {
      transform: translate(15px);
    }
  }
  #walletCopy {
    cursor: pointer;
  }
  .password-wrapper {
    padding: 10px 14px 10px 15px;
    border-radius: 3px;
    border: solid 1px #b8b9bb;
    position: relative;
    padding-right: 30px;

    .password-input {
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: var(--charcoal-grey);
      overflow-x: hidden;
    }
  }
  .v-card.form-card {
    box-shadow: none !important;
    overflow: auto;
    max-height: 320px;
    border-radius: 14px;

    .list-profiles {
      padding-left: 8px;
      padding-right: 8px;
      .wrapper {
        border-top: solid 1px #eeeeee;
        .sub-title-fields {
          font-size: 12px !important;
          font-weight: normal !important;
        }
        .sub-title-fields--bold {
          font-size: 12px !important;
          font-weight: 600 !important;
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
  .advance-btn.float {
    position: fixed !important;
    left: 20px !important;
  }
}
</style>
