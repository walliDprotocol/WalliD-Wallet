<template>
  <v-container
    class="credentials list-storage pt-1"
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
          :title="asset.tokenName"
          :subtitle="asset.tokenProvider"
          :chip="asset.tokenStandard"
          :amount="asset.amount"
          :tokenStandard="asset.tokenStandard"
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

              <v-list-item>
                <v-list-item-title class="SECUNDARY-LINKS text-left">
                  Check on-chain
                </v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="SECUNDARY-LINKS text-left">
                  <a :href="'downloadURL(asset)'" target="_blank">
                    Check on OpenSea
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
              <v-list-item>
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
        <DeleteAssetModal v-if="showDeleteConfirmation" :asset="asset" />
        <ViewActivityModal v-if="showViewActivityModal" />
        <SendAssetModal v-if="showSendAssetModal" :asset="asset" />
      </v-col>
      <!-- import token -->
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
        <ImportAssetModal v-if="showImportAssetModal" :asset="'NFT'" />
      </v-col>
    </v-row>
    <v-row v-else style="background: white; height: 196px; overflow-y: hidden;">
      <v-col cols="12" class="px-15 py-9">
        <p class="SECUNDARY-LINKS mb-5">
          Seems like you don’t have
          <strong>NFTs</strong>
          <br />
          in your wallet yet.
        </p>
        <a
          class="links"
          target="_blank"
          color="#01a3b0"
          href="https://www.wallid.io/"
          @click.stop
        >
          Import an NFT
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Asset from '../../components/Asset'
import StoredProfileImg from '../../components/StoredProfileImg'
import DeleteAssetModal from '../../modals/DeleteAssetModal'
import ViewActivityModal from '../../modals/ViewActivityModal'
import ImportAssetModal from '../../modals/ImportAssetModal'
import SendAssetModal from '../../modals/SendAssetModal'

import { mapGetters } from 'vuex'

export default {
  name: 'NFTs',
  components: {
    StoredProfileImg,
    Asset,
    DeleteAssetModal,
    ViewActivityModal,
    ImportAssetModal,
    SendAssetModal,
  },
  computed: {
    ...mapGetters([
      'assets',
      'showDeleteConfirmation',
      'showViewActivityModal',
      'showImportAssetModal',
      'showSendAssetModal',
      'currentCred',
    ]),
    NFTAssets: function () {
      return this.assets.filter(function (el) {
        return el.assetType === 'NFT'
      })
    },
  },
  methods: {
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
    shareProfile(asset) {
      this.$store.commit('currentCred', asset)

      this.$router.push({ name: 'SHARE_PROFILE_VIEW', params: { asset } })
    },
    openSendAssetModal(asset) {
      this.$store.commit('setCurrentCred', asset)
      this.$store.commit('showSendAssetModal', true)
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
