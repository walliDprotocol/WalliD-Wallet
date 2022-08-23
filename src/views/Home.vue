<template>
  <v-container class="home pb-0" fill-height>
    <v-row class="" style="position: relative">
      <!-- Current Vault -->
      <v-col cols="12" style="position: relative">
        <jazz-icon
          :address="isLukso ? currentDisplayAddress : walletAddress"
          :id="'home'"
          :size="58"
          :margin="4"
        />
        <!-- Vault Dropdown -->
        <VaultDropdown v-if="isLukso" />

        <!-- -->
      </v-col>
      <v-col v-if="!isLukso" cols="12" class="px-14">
        <h2 class="T1 text-center">
          {{ domainENS || $t('home.title') }}
        </h2>
      </v-col>
      <v-col v-if="isLukso" style="font-size: 16px; font-weight: 500">
        {{ profileUsername }}
      </v-col>
      <v-col cols="12" class="px-14 pt-0">
        <WalletAddress
          :walletAddress="isLukso ? currentDisplayAddress : walletAddress"
        />
        <v-btn
          v-if="false"
          text
          class="advance-btn"
          @click="$router.push('/LuksoTestpage')"
        >
          Lukso Testpage
        </v-btn>
      </v-col>
      <v-col cols="12" class="d-flex justify-center mb-5">
        <div v-if="isLukso" class="">
          <v-btn
            class="home-icons pa-0"
            @click="createVaultOnUP"
            text
            :loading="createVaultIconState === 'creating'"
            rounded
            :class="{ disabled: createVaultIconState !== 'default' }"
          >
            <IconCreateVault v-if="createVaultIconState === 'creating'" />
            <IconVaultCreated v-else-if="createVaultIconState === 'created'" />
            <IconCreateVault v-else />
          </v-btn>
          <p class="mt-1 home-icons-btn-label">{{ createVaultLabelState }}</p>
        </div>
        <div
          class="home-icons"
          :class="{ disabled: assets.length == 0 }"
          @click="openSendAssetModal"
        >
          <IconSend />
          <p class="mt-2 home-icons-text">Send</p>
        </div>
        <div
          class="home-icons"
          :class="{
            disabled:
              assets.length === 0 &&
              identities.length === 0 &&
              credentials.length === 0 &&
              profiles.length === 0,
          }"
          @click="openShareProofPage"
        >
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
import WalletState from '../components/WalletState';
import WalletAddress from '../components/WalletAddress';
import FungibleTokens from '../components/FungibleTokens';
import NFTs from '../components/NFTs';
import IDs from '../components/IDs';
import VaultDropdown from '../components/VaultDropdown';
import IconSend from '../images/icons/icon-send.vue';
import IconProve from '../images/icons/icon-prove.vue';
import IconCreateVault from '../images/icons/icon-createVault.vue';
import IconVaultCreated from '../images/icons/icon-vaultCreated.vue';
import SendAssetModal from '../modals/SendAssetModal.vue';

import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

import { mapGetters, mapState } from 'vuex';

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
    VaultDropdown,
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
      assets: 'assets',
    }),
    ...mapGetters('networks', ['currentNetwork', 'networksList', 'chainId']),
    ...mapState('lukso', ['profileUsername', 'currentDisplayAddress']),

    tab: {
      get() {
        return this.$store.getters.currentTab;
      },
      set(value) {
        this.$store.commit('currentTab', value);
      },
    },
    createVaultLabelState() {
      if (this.createVaultIconState === 'creating') {
        return 'Creating...';
      } else if (this.createVaultIconState === 'created') {
        return 'Created!';
      } else {
        return 'Create Vault';
      }
    },
    isLukso() {
      return this.chainId === '2828';
    },
    getAddress() {
      return this.isLukso ? this.currentDisplayAddress : this.walletAddress;
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

    console.log(this.tab);
  },
  methods: {
    openShareProofPage() {
      this.$router.push({ name: 'SHARE_PROFILE_VIEW' });
    },
    async createVaultOnUP() {
      this.createVaultIconState = 'creating';
      let newVaultAddress = await this.$store.dispatch('lukso/createVaultOnUP');
      console.log(newVaultAddress);
      this.createVaultIconState = 'created';

      setTimeout(() => (this.createVaultIconState = 'default'), 3 * 1000);

      this.$store.dispatch('lukso/changeCurrentDisplayAddress', {
        accountAddress: newVaultAddress,
      });
    },
    close() {
      this.$store.commit('showDeleteConfirmation', false);
    },
    openSendAssetModal() {
      this.$store.commit('showSendAssetModal', true);
    },
  },
  data() {
    return {
      iconSet: false,
      createVaultIconState: 'default',
    };
  },
};
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
  margin-inline: 21px;
  cursor: pointer;
  position: relative;
  min-width: unset !important;
  width: 38px;
  box-shadow: none !important;
  height: 38px !important;
  &.disabled {
    pointer-events: none;
    svg {
      circle {
        fill: var(--very-light-grey);
      }
    }
    p {
      color: var(--very-light-grey);
    }
  }
  &.v-btn {
    background-color: var(--teal-blue);
    color: white !important;
  }
}

.home-icons-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 120%);
  white-space: nowrap !important;
  text-transform: none;
  letter-spacing: normal;
  color: #009fb1;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.home-icons-btn-label {
  white-space: nowrap !important;
  text-transform: none;
  letter-spacing: normal;
  color: #009fb1;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
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
</style>
