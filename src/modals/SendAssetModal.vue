<template>
  <v-container class="modal details-wallet">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-4">
          <v-btn text @click="close()" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ 'Send ' + (currentCred ? currentCred.tokenName : '') }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-if="(step > 0 && !currentCred) || currentCred"
        cols="12"
        class="d-flex mb-3 py-3"
        style="background-color: #f7f7f7;"
      >
        <v-col cols="auto" class="pa-0 d-flex align-center">
          <v-img
            height="50"
            max-width="50"
            contain
            :src="currentCred ? currentCred.assetImagePath : ''"
          />
        </v-col>
        <v-col
          cols="auto"
          class="grow pa-0 ml-3 d-flex flex-column justify-center"
        >
          <div class="d-flex justify-space-between">
            <p class="sub-title-fields sub-title-fields--bold">
              {{ (currentCred ? currentCred.tokenName : '') }}
            </p>
          </div>
          <div class="d-flex align-center justify-space-between">
            <p class="sub-title-fields d-flex">
              {{ amountPrefix }}
              {{ (currentCred ? currentCred.amount : '') }}
            </p>
          </div>
        </v-col>
      </v-col>
      <v-col v-if="step === 2" cols="12" class="d-flex align-center py-3">
        <div class="mx-3">
          <jazz-icon
            v-if="!recipientVaultSelected"
            :address="walletAddress"
            :id="'home'"
            :size="40"
            :margin="4"
          />
          <IconCreateVault v-else-if="currentVault.name !== 'Uni. Profile'" />
          <v-img
            v-else
            src="../images/icons/icon-up-lukso-default@2x.png"
          ></v-img>
        </div>
        <div class="mr-3" style="font-size: 13px; font-weight: 500;">
          Account 1
        </div>
        <div class="mx-3">
          <v-img
            max-width="20"
            max-height="20"
            src="../images/icons/icon-transfer@3x.png"
          ></v-img>
        </div>
        <div class="mx-3">
          <jazz-icon
            v-if="!recipientVaultSelected"
            :address="walletAddress"
            :id="'home'"
            :size="40"
            :margin="4"
          />
          <IconCreateVault v-else-if="currentVault.name !== 'Uni. Profile'" />
          <v-img
            v-else
            src="../images/icons/icon-up-lukso-default@2x.png"
          ></v-img>
        </div>
        <div style="font-size: 13px; font-weight: 500;">
          {{ recipientAddress | truncate(8, '...') }}
        </div>
      </v-col>
      <v-col
        v-if="step === 0 && !currentCred"
        cols="12"
        class="py-0 mr-0 align-center"
      >
        <p class="sub-title-fields text-left mb-3">
          Asset
        </p>
        <v-select
          class="pa-0 mb-6"
          :items="networkAssets"
          v-model="selectedAsset"
          color="#009fb1"
          outlined
          dense
          append-icon="x"
          :menu-props="{
            maxHeight: 304,
          }"
          hide-details="auto"
          placeholder="Select and asset to send"
        >
          <template
            v-slot:selection="{
              item,
            }"
          >
            <div class="d-flex simple-text">
              <v-img contain width="20" :src="item.assetImagePath"></v-img>

              <p class="d-block mb-0 ml-3">
                {{ item.tokenName }}
              </p>
            </div>
          </template>
          <template
            v-slot:item="{
              item,
            }"
          >
            <div class="d-flex simple-text">
              <v-img contain width="20" :src="item.assetImagePath"></v-img>

              <p class="d-block mb-0 ml-3">
                {{ item.tokenName }}
              </p>
            </div>
          </template>
        </v-select>
      </v-col>
      <v-col
        v-if="!recipientVaultSelected"
        cols="12"
        class="py-0"
        style="position: relative;"
      >
        <p class="sub-title-fields text-left mb-3">
          To
        </p>
        <v-text-field
          dense
          outlined
          :disabled="step > 0 || recipientVaultSelected"
          hide-details
          class="pa-0 mb-6"
          placeholder="Public address (0x)"
          v-model="recipientAddress"
        >
          <template #append>
            <div class="d-flex align-center">
              <v-img
                v-if="isValidAddress"
                src="../images/icons/icon-sucessfully@3x.png"
                max-width="18"
                contain
                class="mt-1 mr-2"
              ></v-img>
              <v-img
                max-width="18"
                contain
                src="../images/icons/close-icon@3x.png"
                @click="deleteRecipientAddress"
                class="mt-1"
              ></v-img>
            </div>
          </template>
        </v-text-field>
      </v-col>
      <v-col v-else cols="12" class="py-0" style="position: relative;">
        <p class="sub-title-fields text-left mb-3">
          To
        </p>
        <div
          class="d-flex align-center py-1"
          style="background-color: #f7f7f7;"
        >
          <IconCreateVault style="max-width: 30px; margin-inline: 12px;" />
          <div class="d-flex flex-column flex-grow">
            <p
              style="
                font-size: 13px !important;
                font-weight: 700 !important;
                text-align: left;
              "
            >
              {{ recipientVaultSelected ? recipientVaultSelected.name : '' }}
            </p>
            <p
              style="
                font-size: 13px !important;
                font-weight: 500 !important;
                text-align: left;
              "
            >
              {{ recipientVaultSelected ? recipientVaultSelected.address : '' }}
            </p>
          </div>
          <v-img
            v-if="isValidAddress"
            src="../images/icons/icon-sucessfully@3x.png"
            max-width="18"
            contain
            style="
              position: absolute;
              top: 50%;
              right: 0;
              transform: translate(-285%, 50%);
            "
          ></v-img>
          <v-img
            max-width="18"
            contain
            src="../images/icons/close-icon@3x.png"
            @click="deleteRecipientAddress"
            style="
              position: absolute;
              top: 50%;
              right: 0;
              transform: translate(-150%, 50%);
            "
          ></v-img>
        </div>
      </v-col>
      <v-col
        cols="12"
        v-if="(step === 0 && vaults.length > 1 && showVaults === false)"
      >
        <p
          style="
            font-size: 14px;
            font-weight: 500;
            color: #009fb1;
            cursor: pointer;
            text-align: left;
          "
          @click="showVaults = true"
        >
          Transfer between my vaults
        </p>
      </v-col>
      <v-col
        v-if="showVaults"
        cols="auto"
        class="pr-0 mr-0 d-flex align-center"
      >
        <p class="sub-title-fields text-left mr-3" style="white-space: nowrap;">
          My Vaults
        </p>
      </v-col>
      <v-col
        v-if="showVaults"
        cols="auto"
        class="grow d-flex align-center pl-0"
      >
        <hr />
      </v-col>
      <v-col cols="12" v-if="showVaults" class="pa-0 mb-0">
        <v-col
          v-for="vault in vaults"
          cols="12"
          :key="vault.address"
          class="d-flex pt-3 pa-0 gray-bg flex-column"
          @click="recipientVaultSelected = vault"
        >
          <v-col cols="12" class="py-0 d-flex align-center">
            <IconCreateVault class="mr-3" />
            <div class="d-flex flex-column">
              <p class="sub-title-fields sub-title-fields--bold text-left">
                {{ vault.name }}
              </p>
              <p class="sub-title-fields d-flex text-left">
                {{ vault.address }}
              </p>
            </div>
          </v-col>
          <v-col cols="12" class="py-0 pt-3"><hr /></v-col>
        </v-col>
      </v-col>
      <v-col
        v-if="step === 1"
        cols="12"
        class="py-0"
        style="position: relative;"
      >
        <p class="sub-title-fields text-left mb-3">
          Amount
        </p>
        <v-text-field
          dense
          outlined
          hide-details
          class="pa-0 mb-6"
          placeholder="Public address (0x)"
          clear-icon="mdi-close-circle"
          clearable
          :append-icon="
            isValidAddress ? 'icon-successfully' : 'icon-not-successful'
          "
          :rules="TokenAmountRule"
        >
          <template #append>
            <div
              style="
                position: absolute;
                bottom: 32px;
                right: 90px;
                font-size: 15px;
                font-weight: 500;
              "
            >
              LYXt
            </div>
            <div
              style="
                position: absolute;
                bottom: 30px;
                right: 25px;
                border: 1px solid #009fb1;
                color: #009fb1;
                border-radius: 3px;
                font-size: 13px;
                padding: 2px 10px;
                cursor: pointer;
              "
              @click="setMaxAmount"
            >
              Max
            </div>
          </template>
        </v-text-field>
      </v-col>
      <v-col v-if="step === 2" cols="12" class="d-flex flex-column py-0">
        <div class="d-flex justify-space-between">
          <p style="font-size: 15px; font-weight: 600;">Amount</p>
          <p style="font-size: 15px; font-weight: 600;">0.00000116 LYXt</p>
        </div>
        <div class="d-flex justify-space-between">
          <p style="font-size: 15px; font-weight: 600;">Gas fees</p>
          <p style="font-size: 15px; font-weight: 600;">0.12012 LYXt</p>
        </div>
        <div class="d-flex justify-space-between">
          <p style="font-size: 15px; font-weight: 800;">Amount + Gas fees</p>
          <p style="font-size: 15px; font-weight: 800;">0,12012116 LYXt</p>
        </div>
      </v-col>
      <v-col v-if="step === 2" cols="12" class="grow d-flex align-center pl-0">
        <hr />
      </v-col>
    </v-row>
    <v-row v-if="step < 2">
      <v-col cols="6" class="pt-1">
        <v-btn text @click="close()" class="cancel-btn">
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="6" class="pt-1">
        <v-btn text @click="nextStep" class="advance-btn">
          Next
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="6" class="pt-1">
        <v-btn text @click="close()" class="cancel-btn">
          Reject
        </v-btn>
      </v-col>
      <v-col cols="6" class="pt-1">
        <EditPriorityModal
          :success="true"
          :recipientAddress="recipientAddress"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletAddress from '../components/WalletAddress'
import WalletState from '../components/WalletState'
import ArrowBack from '../images/icon-arrow-back.vue'
import EditPriorityModal from './EditPriorityModal.vue'
import IconCreateVault from '../images/icons/icon-createVault.vue'

import { mapGetters, mapState } from 'vuex'

export default {
  components: {
    WalletAddress,
    WalletState,
    ArrowBack,
    EditPriorityModal,
    IconCreateVault,
  },
  methods: {
    isSufficientAmount() {
      return true
    },
  },
  computed: {
    ...mapGetters([
      'address',
      'showSendAssetModal',
      ,
      'currentCred',
      'assets',
      'vaults',
      'currentVault',
    ]),
    ...mapState({
      walletAddress: 'address',
      domainENS: 'domainENS',
    }),
    close() {
      this.$store.commit('setCurrentCred', null)
      this.$store.commit('showSendAssetModal', false)
    },
    openViewActivityModal() {
      this.$store.commit('showViewActivityModal', true)
      this.$store.commit('showSendAssetModal', false)
    },
    networkAssets() {
      return this.assets.filter((asset) => {
        return asset.assetType === 'NFT' && asset.assetType === 'Fungible Token'
      })
    },
    amountPrefix() {
      if (this.currentCred)
        return this.currentCred.assetType === 'Fungible Token'
          ? 'Balance: '
          : 'Amount: '
    },
    deleteRecipientAddress() {
      return (this.recipientAddress = '')
    },
    nextStep: () => {
      //if ((valid address && this.step === 0) || (valid amount && step === 1)) this.step++
    },
    setMaxAmount: () => {
      //get amount of currentCred token or selectedToken and set to that amount
    },
  },
  data() {
    return {
      step: 3,
      isValidAddress: true,
      selectedAsset: null,
      recipientAddress: '',
      recipientVaultSelected: '',
      showVaults: false,
      TokenAmountRule: [
        (v) => this.isSufficientAmount(v) === true || 'Insufficient funds',
      ],
    }
  },
}
</script>

<style lang="scss">
*::-webkit-scrollbar {
  display: none !important; /* for Chrome, Safari, and Opera */
}

#metamask-logo-details {
  max-height: 83px;
  max-width: 83px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
  margin-top: -35px;
}

.details-wallet {
  .darker-background.row {
    margin: 0;
    border-radius: 3px;
    background-color: var(--white);
    .wallet-state {
      background: #efefef;
    }
    .wallet-address {
      background-color: #ffffff;
      padding: 10px;
    }
  }
}

.modal {
  z-index: 1060;
  position: fixed;
  top: 74px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 16px;
  overflow-x: auto;
}

hr {
  border-top: 1px solid #e5e5e5 !important;
  min-width: 100% !important;
}

.v-dialog {
  margin-top: 74px;
  background-color: white;
}

.v-dialog:not(.v-dialog--fullscreen) {
  max-height: 80%;
  overflow-y: scroll;
}

.v-input--radio-group__input {
  justify-content: space-between !important;
  padding-inline: 35px;
  margin: 0 !important;
}

.v-radio {
  margin: 0 !important;
}

.v-input--selection-controls__input {
  margin: 0 !important;
}

.gray-bg:hover {
  background-color: #f7f7f7;
}
</style>
