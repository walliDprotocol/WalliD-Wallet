<template>
  <v-container
    class="credentials list-storage"
    style="overflow-y: auto; height: 208px;"
  >
    <v-row v-if="NFTAssets.length > 0">
      <!-- TO DO: filter assets array by assetType (only fungibleTokens), make sure native token appears first-->
      <v-col
        v-for="asset in NFTAssets"
        :key="asset.id"
        cols="12"
        class="py-0 px-1 mt-1 mb-2 card"
      >
        <Asset
          :image="asset.assetImagePath"
          :title="getAssetName(asset)"
          :subtitle="asset.tokenSymbol"
          :chip="getAssetType(asset.assetType)"
          :amount="asset.amount"
          :tokenStandard="asset.assetType"
          :issued="asset.issued"
        >
          <template #menu>
            <v-list>
              <v-list-item v-if="false">
                <v-list-item-title
                  class="SECUNDARY-LINKS text-left"
                  @click="openViewActivityModal(asset)"
                >
                  View activity
                </v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="SECUNDARY-LINKS text-left">
                  Check on-chain
                </v-list-item-title>
              </v-list-item>

              <v-list-item v-if="false">
                <v-list-item-title class="SECUNDARY-LINKS text-left">
                  <a :href="'openLuksoNftMarketplace(asset)'" target="_blank">
                    Lukso NFT Marketplace
                  </a>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title
                  class="SECUNDARY-LINKS text-left"
                  @click="openSendAssetModal(asset)"
                >
                  Send
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title
                  class="SECUNDARY-LINKS text-left"
                  @click="shareProfile(asset)"
                >
                  Share Proof-of-Ownership
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="!isLukso">
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
      <v-col cols="12" class="py-0 px-1 mt-1 mb-2 card">
        <v-container
          class="py-0 px-3"
          @click="openImportAssetModal()"
          style="cursor: pointer;"
        >
          <v-row>
            <v-col cols="2">
              <StoredProfileImg :size="38" :name="'AddProfile'" />
            </v-col>
            <v-col cols="8" class="pl-6 pr-0">
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" class="py-0 pr-0">
                    <div class="MAIN-LINKS links" color="#01a3b0">
                      Import an NFT
                    </div>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <p class="sub-title-fields"></p>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
        <!-- <ImportAssetModal v-if="showImportAssetModal" :asset="'NFT'" /> -->
      </v-col>
    </v-row>
    <v-row v-else style="background: white; height: 196px; overflow-y: hidden;">
      <v-col cols="12" class="px-15 py-9">
        <p class="SECUNDARY-LINKS mb-5">
          Seems like you don’t have
          <strong>NFTs</strong>
          in your wallet yet.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Asset from '../../components/Asset'
import StoredProfileImg from '../../components/StoredProfileImg'

import { mapGetters } from 'vuex'

export default {
  name: 'NFTs',
  components: {
    StoredProfileImg,
    Asset,
  },
  computed: {
    ...mapGetters('networks', ['currentNetwork', 'networksList', 'chainId']),

    ...mapGetters(['assets', 'currentCred']),
    NFTAssets: function () {
      return this.assets.filter(function (el) {
        return el.assetType.isLSP8
      })
    },
  },
  methods: {
    getAssetName(asset) {
      return (
        asset.tokenName +
        ' #' +
        this.$options.filters.truncate(asset.tokenId, 12, '...')
      )
    },
    getAssetType(assetType) {
      if (assetType.isLSP8) return 'LSP8'
      if (assetType.isLSP7) return 'LSP7'
    },
    openDeleteAssetModal(asset) {
      this.$store.commit('setCurrentCred', asset)
      this.$store.commit('showDeleteConfirmation', true)
    },
    openViewActivityModal(asset) {
      this.$store.commit('setCurrentCred', asset)
      this.$store.commit('showViewActivityModal', true)
    },
    openImportAssetModal() {
      this.$store.commit('showImportAssetModal', true)
    },
    openSendAssetModal(asset) {
      this.$store.commit('setCurrentAsset', asset)
      this.$store.commit('showSendAssetModal', true)
    },
    shareProfile(asset) {
      this.$store.commit('setCurrentCred', asset)

      this.$router.push({ name: 'SHARE_PROFILE_VIEW', params: { asset } })
    },
  },
  data() {
    return {
      storeWeb3Link: 'https://www.wallid.io/Setup/?flow=WEB3', // "https://www.wallid.io/Setup/selectedDocumentType='Web3'",
    }
  },
}
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
  }
}
</style>
