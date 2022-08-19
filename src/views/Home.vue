<template>
  <v-container class="home pb-0" fill-height>
    <v-row class="" style="position: relative;">
      <!-- Current Vault -->
      <v-col cols="12" style="position: relative;">
        <jazz-icon
          :address="walletAddress"
          :id="'home'"
          :size="58"
          :margin="4"
        />
        <v-img
          v-if="vaults.length > 1"
          contain
          max-height="25"
          src="../images/icons/icon-up-lukso-default@3x.png"
          style="
            position: absolute;
            bottom: 0;
            left: 55%;
            transform: translateX(-50%);
          "
        ></v-img>
        <div
          v-if="vaults.length > 1"
          @click="showVaultDropdown = !showVaultDropdown"
          class="current-network"
          style="
            position: absolute;
            top: 0px;
            right: 20px;
            cursor: pointer !important;
            border: 1px solid #e5e5e5;
          "
        >
          {{ currentVault.name }}
          <IconArrowDropdown
            :style="{
              transform:
                'rotate(' + (showVaultDropdown ? '180deg' : '0deg') + ')',
              animation: 'transform 1s infinite linear',
              width: '8px',
              marginLeft: '6px',
              animation: 'transform 1s linear',
            }"
          />
        </div>
        <!-- Vault Dropdown -->
        <div
          v-if="showVaultDropdown"
          style="
            position: absolute;
            top: 40px;
            right: 0;
            background-color: white;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.11);
            padding-block: 11px;
          "
          class="d-flex flex-column"
        >
          <div
            v-for="vault in vaults"
            :key="vault.address"
            class="d-flex align-center px-5 py-3 vault-slot"
            style="cursor: pointer;"
            @click="changeCurrentVault(vault)"
          >
            <IconNetworkSelected
              :style="{
                visibility:
                  currentVault.name === vault.name ? 'visible' : 'hidden',
              }"
              class="mr-2"
            />
            <p class="vault-slot" style="font-size: 14px; font-weight: 600;">
              {{ vault.name }}&nbsp;
            </p>
            <p
              class="vault-slot text-gray"
              style="font-size: 14px; font-weight: 500;"
            >
              {{ ('• ' + vault.address) | truncate(12, '...') }}
            </p>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="pt-4 px-14 pb-0">
        <h2 class="T1 text-center">
          {{ domainENS || $t('home.title') }}
        </h2>
      </v-col>
      <v-col style="font-size: 16px; font-weight: 500;">
        FVeiga
      </v-col>
      <v-col cols="12" class="px-14 pt-0">
        <WalletAddress :address="walletAddress" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <div
          class="home-icons"
          @click="
            ''


          "
        >
          <IconCreateVault v-if="createVaultIconState === 'creating'" />
          <IconVaultCreated v-else-if="createVaultIconState === 'created'" />
          <IconCreateVault v-else />
          <p class="mt-2 home-icons-text">{{ createVaultLabelState }}</p>
        </div>
        <div class="home-icons" @click="openSendAssetModal">
          <IconSend />
          <p class="mt-2 home-icons-text">Send</p>
        </div>
        <div class="home-icons">
          <IconProve />
          <p class="mt-2 home-icons-text">Prove</p>
        </div>
      </v-col>
      <v-col class="tabs pa-0 pt-1" cols="12">
        <v-tabs :show-arrows="false" fixed-tabs v-model="tab">
          <v-tab href="#tab-2" class="MENU-SELECTED">
            {{ $t('home.tabs[0]') }}
          </v-tab>
          <v-tab href="#tab-1" class="MENU-SELECTED">
            {{ $t('home.tabs[1]') }}
          </v-tab>
          <v-tab href="#tab-3" class="MENU-SELECTED">
            {{ $t('home.tabs[2]') }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item value="tab-2">
            <FungibleTokens />
          </v-tab-item>
          <v-tab-item value="tab-1">
            <NFTs />
          </v-tab-item>
          <v-tab-item value="tab-3">
            <IDs />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <SendAssetModal v-if="showSendAssetModal" />
  </v-container>
</template>

<script>
import WalletState from '../components/WalletState'
import WalletAddress from '../components/WalletAddress'
import FungibleTokens from '../components/FungibleTokens'
import NFTs from '../components/NFTs'
import IDs from '../components/IDs'
import IconSend from '../images/icons/icon-send.vue'
import IconProve from '../images/icons/icon-prove.vue'
import IconCreateVault from '../images/icons/icon-createVault.vue'
import IconVaultCreated from '../images/icons/icon-vaultCreated.vue'
import SendAssetModal from '../modals/SendAssetModal.vue'
import IconArrowDropdown from '../images/icon-arrow-dropdown.vue'
import IconNetworkSelected from '../images/icon-network-selected.vue'

import DeleteConfirmationModal from '../modals/DeleteConfirmationModal'

import { mapGetters, mapState } from 'vuex'

export default {
  components: {
    WalletState,
    WalletAddress,
    FungibleTokens,
    NFTs,
    IDs,
    DeleteConfirmationModal,
    IconSend,
    IconProve,
    IconCreateVault,
    IconVaultCreated,
    SendAssetModal,
    IconArrowDropdown,
    IconNetworkSelected,
  },
  computed: {
    ...mapGetters([
      'address',
      'identities',
      'credentials',
      'profiles',
      'showDeleteConfirmation',
      'showSendAssetModal',
      'vaults',
      'currentVault',
    ]),
    ...mapState({
      walletAddress: 'address',
      domainENS: 'domainENS',
    }),
    tab: {
      get() {
        return this.$store.getters.currentTab
      },
      set(value) {
        this.$store.commit('currentTab', value)
      },
    },
    createVaultLabelState() {
      if (this.createVaultIconState === 'creating') {
        return 'Creating...'
      } else if (this.createVaultIconState === 'created') {
        return 'Created!'
      } else {
        return 'Create Vault'
      }
    },
  },
  mounted() {
    // switch (true) {
    //   case this.profiles.length > 0:
    //     this.tab = 'tab-2';
    //     break;
    //   case this.identities.length > 0:
    //     this.tab = 'tab-1';
    //     break;
    //   case this.credentials.length > 0:
    //     this.tab = 'tab-3';
    //     break;
    //   default:
    //     break;
    // }

    console.log(this.tab)
  },
  methods: {
    close() {
      this.$store.commit('showDeleteConfirmation', false)
    },
    openSendAssetModal() {
      this.$store.commit('showSendAssetModal', true)
    },
    changeCurrentVault(vault) {
      this.$store.commit('changeCurrentVault', vault)
      this.showVaultDropdown = false
    },
  },
  data() {
    return {
      iconSet: false,
      createVaultIconState: 'default',
      showVaultDropdown: false,
    }
  },
}
</script>

<style lang="scss">
#metamask-logo-home {
  max-height: 70px;
  max-width: 70px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
}

.home {
  .tabs {
    min-width: 400px;
    .v-slide-group__prev,
    .v-slide-group__next {
      display: none !important;
    }
    .v-tabs-slider {
      background-color: var(--teal-blue);
    }
    .v-tab {
      border-bottom: solid 2px var(--very-light-grey);
    }
  }
}

.home-icons {
  display: flex;
  flex-direction: column;
  color: #009fb1;
  font-size: 14px;
  font-weight: 500;
  margin-inline: 21px;
  cursor: pointer;
  position: relative;
}

.home-icons-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 120%);
  white-space: nowrap !important;
}

.current-network {
  cursor: pointer;
  border-radius: 15px;
  border: 1px solid #b8b9bb;
  max-height: 28px;
  font-size: 12px !important;
  font-weight: 500;
  padding: 7px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-gray {
  color: #b8b9bb;
}

.vault-slot:hover {
  color: #009fb1 !important;
  background-color: #dbedef;
}
</style>
