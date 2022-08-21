<template>
  <v-container
    class="credentials list-storage"
    style="overflow-y: auto; height: 208px"
  >
    <v-row>
      <!-- TO DO: filter assets array by assetType (only fungibleTokens), make sure native token appears first-->
      <v-col
        v-for="asset in fungibleTokenAssets"
        :key="asset.id"
        cols="12"
        class="py-0 px-1 mt-1 mb-2 card"
      >
        <Asset
          :image="asset.assetImagePath"
          :title="asset.tokenName"
          :subtitle="asset.balanceOf"
          :chip="getAssetType(asset.assetType)"
          :amount="null"
        >
          <template #menu>
            <v-list>
              <v-list-item>
                <v-list-item-title
                  class="SECUNDARY-LINKS text-left"
                  @click="openViewActivityModal(asset)"
                >
                  View activity
                </v-list-item-title>
              </v-list-item>

              <v-list-item
                v-if="asset.tokenName"
                :class="asset.status != 'active' ? '' : ''"
              >
                <v-list-item-title
                  class="SECUNDARY-LINKS text-left"
                  @click="proofPage(asset)"
                >
                  Check on-chain
                </v-list-item-title>
              </v-list-item>

              <v-list-item
                v-if="asset.tokenName"
                :class="!downloadURL(asset) ? 'disabled' : ''"
              >
                <v-list-item-title class="SECUNDARY-LINKS text-left">
                  <a :href="downloadURL(asset)" target="_blank">
                    Share Proof-of-Ownership
                  </a>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="asset.tokenName">
                <v-list-item-title
                  class="SECUNDARY-LINKS text-left"
                  @click="openSendAssetModal(asset)"
                >
                  Send
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="asset.tokenStandard !== 'Native'">
                <v-list-item-title
                  class="SECUNDARY-LINKS text-left"
                  @click="openDeleteAssetModal(asset)"
                >
                  Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </template>
        </Asset>
      </v-col>
      <!-- import token -->
      <v-col cols="12" class="py-0 px-1 mt-1 mb-2 card">
        <v-container @click="openImportAssetModal()" class="py-0 px-3">
          <v-row>
            <v-col cols="2">
              <StoredProfileImg :size="38" :name="'AddProfile'" />
            </v-col>
            <v-col cols="8" class="pl-6 pr-0">
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" class="py-0 pr-0">
                    Import custom token
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <p class="sub-title-fields"></p>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Asset from '../../components/Asset';
import StoredProfileImg from '../../components/StoredProfileImg';

import { mapGetters } from 'vuex';

const PDF_URL = 'https://mycredentials.wallid.io/ViewCredential/';

export default {
  name: 'FungibleTokens',
  components: {
    StoredProfileImg,
    Asset,
  },
  computed: {
    ...mapGetters(['assets']),
    fungibleTokenAssets() {
      console.log('assets', this.assets);
      return this.assets.filter((el) => {
        return el.assetType.isLSP7;
      });
    },
  },
  methods: {
    getAssetType(assetType) {
      if (assetType.isLSP8) return 'LSP8';
      if (assetType.isLSP7) return 'LSP7';
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
    getImage(card) {
      if (card?.userData?.frontend_props?.currentLayout === 'Badge') {
        return card.userData?.imgArray?.[0];
      }
      return (
        card.userData?.credential_img ||
        card.userData?.frontend_props?.preview ||
        card.photoURL
      );
    },
    downloadURL(card) {
      // if (
      //   this.connected &&
      //   new RegExp(WALLID_DOMAINS.join('|')).test(this.connected.url)
      //   //  && !card.userData.pdf_url // Required for old users < 14/4/2021 ?
      // ) {
      if (this.isNFT(card)) {
        return card && card.userData && card.userData.imgArray[0];
      }
      return PDF_URL + card.id;
      // }
      // return card.userData.pdf_url;
    },
    viewCred(card) {
      console.log('List', this.credentials);
      console.log('List', card);
      this.$store.commit('setCurrentCred', card);
      this.$router.push({ name: 'Credential' });
    },
    deleteCred(card) {
      this.$store.commit('showDeleteConfirmation', true);

      this.$store.commit('setCurrentCred', card);
    },
    proofPage(card) {
      this.$store.commit('setCurrentCred', card);

      this.$router.push({ name: 'SHARE_PROFILE_VIEW' });
      // this.$router.push({ name: 'Proof' });
    },

    isValid(_expDate) {
      if (_expDate) {
        var parts = _expDate.split(' ');
        var expDate = new Date(parts[2], parts[1] - 1, parts[0]);
        let currDate = new Date();
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = currDate.getTime() - expDate.getTime();
        var days = millisBetween / millisecondsPerDay;
        console.log(Math.floor(days));
        // Round down.
        return Math.floor(days) <= 0;
      } else {
        return false;
      }
    },
    openImportAssetModal() {
      this.$store.commit('showImportAssetModal', true);
    },
    openSendAssetModal(asset) {
      this.$store.commit('setCurrentAsset', asset);
      this.$store.commit('showSendAssetModal', true);
    },
    openDeleteAssetModal(asset) {
      this.$store.commit('setCurrentAsset', asset);
      this.$store.commit('showDeleteConfirmation', true);
    },
    openViewActivityModal(asset) {
      this.$store.commit('setCurrentAsset', asset);
      this.$store.commit('showViewActivityModal', true);
    },
  },
  data() {
    return {
      storeWeb3Link: 'https://www.wallid.io/Setup/?flow=WEB3', // "https://www.wallid.io/Setup/selectedDocumentType='Web3'",
    };
  },
};
</script>

<style lang="scss" scoped>
/* TO DO: review used classes in this component */
.dot-menu {
  margin-top: 4px;
}
</style>
<style lang="scss">
.SECUNDARY-LINKS {
  a {
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey) !important;
    text-decoration: none;
    &:hover {
      color: #009fb1 !important;
    }
  }
}
.wallet-tooltip.v-tooltip__content.credential {
  width: 390px;
}
.tooltip-credential {
  border-radius: 3px;
  background-color: #eeeeee;
  padding: 8px 10px;
  margin: auto;
  p {
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey);
  }
}
.dot-menu {
  margin-top: 32px;
  .v-list {
    padding: 0;
  }

  .v-list-item {
    min-height: unset;
    padding: 10px 20px;
    &.disabled {
      pointer-events: none;
      .v-list-item__title,
      a {
        color: #b8b9bb !important;
      }
    }
    cursor: pointer;
    .SECUNDARY-LINKS:hover {
      color: #009fb1 !important;
    }
  }
}
.credentials {
  overflow-y: auto;
  overflow-x: hidden;

  height: 200px;
  .dot-menu-button {
    &:hover .v-btn__content {
      svg {
        g {
          fill: #009fb1 !important;
        }
      }
    }
    &::before {
      content: none;
    }
  }

  .card {
    background-color: var(--white);
    .sub-title-fields {
      font-size: 14px !important;
      text-align: left;
    }

    .col-8 {
      align-items: center;
      display: flex;
    }
    .FIELD-TEXT {
      text-align: left;
    }
    .back-btn {
      padding: 0 !important;
      min-width: 16px !important;
    }
    .validity {
      border-radius: 11px;
      background-color: #d8d8d8;
      width: fit-content;
      padding: 1px;
      padding-right: 8px;
      display: flex;
      svg {
        margin: 6px;
      }
    }
  }
}
</style>
