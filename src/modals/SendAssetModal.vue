<template>
  <v-container class="modal details-wallet">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-4">
          <v-btn text @click="close()" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ 'Send ' + (currentAsset ? currentAsset.tokenName : '') }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-if="(step > 0 && !currentAsset) || currentAsset"
        cols="12"
        class="d-flex mb-3 py-3"
        style="background-color: #f7f7f7;"
      >
        <v-col cols="auto" class="pa-0 d-flex align-center">
          <v-img
            height="50"
            max-width="50"
            contain
            :src="currentAsset ? currentAsset.assetImagePath : ''"
          />
        </v-col>
        <v-col
          cols="auto"
          class="grow pa-0 ml-3 d-flex flex-column justify-center"
        >
          <div class="d-flex justify-space-between">
            <p class="sub-title-fields sub-title-fields--bold">
              {{ currentAsset ? currentAsset.tokenName : '' }}
            </p>
          </div>
          <div class="d-flex align-center justify-space-between">
            <p class="sub-title-fields d-flex">
              {{ amountPrefix }}
              {{ currentAsset ? currentAsset.balanceOf : '' }}
            </p>
          </div>
        </v-col>
      </v-col>
      <v-col v-if="step === 2" cols="12" class="d-flex align-center py-3">
        <div class="mr-3 d-flex align-center">
          <jazz-icon
            v-if="!recipientVaultSelected"
            :address="walletAddress"
            :id="'home'"
            :size="40"
            :margin="4"
          />
          <div
            v-else-if="getCurrentDisplayAddressName === 'Uni. Profile'"
            class="mr-3"
            style="width: 50px; height: 50px;"
          >
            <jazz-icon
              :address="isLukso ? currentDisplayAddress : walletAddress"
              :id="'home'"
              :size="40"
              :margin="4"
            />
          </div>
          <IconCreateVault width="50px" height="50px" v-else />
        </div>

        <div class="mr-3" style="font-size: 13px; font-weight: 500;">
          {{ getCurrentDisplayAddressName }}
        </div>
        <div class="mx-3">
          <v-img
            width="18"
            height="18"
            src="../images/icons/icon-transfer.png"
          ></v-img>
        </div>
        <div class="mx-3 d-flex align-center">
          <jazz-icon
            v-if="!recipientVaultSelected.name"
            :address="toAddress"
            :id="'send'"
            :size="40"
            :margin="4"
          />
          <div
            v-else-if="recipientVaultSelected.name === 'Uni. Profile'"
            class="mr-3"
            style="width: 50px; height: 50px;"
          >
            <jazz-icon
              :address="isLukso ? currentDisplayAddress : walletAddress"
              :id="'home'"
              :size="40"
              :margin="4"
            />
          </div>
          <IconCreateVault width="50px" height="50px" v-else />
        </div>
        <div style="font-size: 13px; font-weight: 500;">
          {{ (recipientVaultSelected.name || toAddress) | truncate(8, '...') }}
        </div>
      </v-col>
      <v-col
        v-if="step === 0 && !currentAsset"
        cols="12"
        class="py-0 mr-0 align-center"
      >
        <p class="sub-title-fields text-left mb-3">Asset</p>
        <v-select
          class="pa-0 mb-6"
          :items="assets"
          v-model="selectedAsset"
          color="#009fb1"
          outlined
          dense
          append-icon="mdi-chevron-down"
          :menu-props="{
            maxHeight: 304,
          }"
          hide-details="auto"
          placeholder="Select and asset to send"
        >
          <template v-slot:selection="{ item }">
            <div class="d-flex simple-text">
              <v-img contain width="20" :src="item.assetImagePath"></v-img>

              <p class="d-block mb-0 ml-3">
                {{ item.tokenName }}
              </p>
              <p class="d-block mb-0 ml-3">
                {{ getAssetId(item) || item.balanceOf }}
              </p>
            </div>
          </template>
          <template v-slot:item="{ item }">
            <div class="d-flex simple-text">
              <v-img contain width="20" :src="item.assetImagePath"></v-img>

              <p class="d-block mb-0 ml-3">
                {{ item.tokenName }}
              </p>
              <p class="d-block mb-0 ml-3">
                {{ getAssetId(item) || item.balanceOf }}
              </p>
            </div>
          </template>
        </v-select>
      </v-col>
      <v-col
        v-if="!recipientVaultSelected.name && step < 2"
        cols="12"
        class="py-0"
        style="position: relative;"
      >
        <p class="sub-title-fields text-left mb-3">To</p>
        <v-text-field
          dense
          outlined
          :disabled="step > 0 || recipientVaultSelected.name"
          hide-details
          class="pa-0 mb-6"
          placeholder="Public address (0x)"
          v-model="toAddress"
        >
          <template #append>
            <div class="d-flex align-center">
              <v-img
                v-if="isValidAddress()"
                src="../images/icons/icon-sucessfully@3x.png"
                max-width="18"
                contain
                class="mt-1 mr-2"
              ></v-img>
              <v-img
                v-if="step == 0"
                style="cursor: pointer;"
                max-width="12"
                contain
                src="../images/icons/close-icon@3x.png"
                @click="deleteRecipientAddress"
                class="mt-1"
              ></v-img>
            </div>
          </template>
        </v-text-field>
      </v-col>
      <v-col
        v-else-if="step < 2"
        cols="12"
        class="py-0"
        style="position: relative;"
      >
        <p class="sub-title-fields text-left mb-3">To</p>
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
              {{ recipientVaultSelected.address | truncate(12) }}
            </p>
          </div>
          <v-img
            v-if="isValidAddress()"
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
        v-if="step === 0 && vaultList.length > 1 && showVaults === false"
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
        v-if="showVaults && step == 0"
        cols="auto"
        class="pr-0 mr-0 d-flex align-center"
      >
        <p class="sub-title-fields text-left mr-3" style="white-space: nowrap;">
          My Vaults
        </p>
      </v-col>
      <v-col
        v-if="showVaults && step == 0"
        cols="auto"
        class="grow d-flex align-center pl-0"
      >
        <hr />
      </v-col>
      <v-col cols="12" v-if="showVaults && step == 0" class="pa-0 mb-0">
        <v-col
          v-for="vault in vaultList"
          cols="12"
          :key="vault.address"
          class="d-flex pt-3 pa-0 gray-bg flex-column"
        >
          <v-col
            cols="12"
            class="py-0 d-flex align-center vault-list-item"
            :class="{ disabled: currentDisplayAddress === vault.address }"
            @click="recipientVaultSelected = vault"
          >
            <IconCreateVault
              v-if="vault.name !== 'Uni. Profile'"
              class="mr-3"
            />
            <div v-else class="mr-3" style="width: 40px; height: 40px;">
              <jazz-icon
                :address="isLukso ? currentDisplayAddress : walletAddress"
                :id="'home'"
                :size="40"
                :margin="4"
              />
            </div>
            <div class="d-flex flex-column">
              <p class="sub-title-fields sub-title-fields--bold text-left">
                {{ vault.name }}
              </p>
              <p class="sub-title-fields d-flex text-left">
                {{ vault.address | truncate(12) }}
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
        <p class="sub-title-fields text-left mb-3">Amount</p>
        <v-text-field
          v-model="amount"
          :disabled="currentAsset.assetType.isLSP8"
          dense
          outlined
          hide-details
          class="pa-0 mb-6"
          placeholder="Amount"
          :append-icon="
            isValidAddress() ? 'icon-successfully' : 'icon-not-successful'
          "
          :rules="TokenAmountRule"
        >
          <template #append>
            <div
              class="mr-6 mt-1"
              style="font-size: 15px; font-weight: 500; line-height: 18px;"
            >
              {{ tokenSymbol }}
            </div>
            <div
              class="mt-1"
              style="
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
      <v-col
        v-if="step === 2 && false"
        cols="12"
        class="d-flex flex-column py-0"
      >
        <div class="d-flex justify-space-between">
          <p style="font-size: 15px; font-weight: 600;">Estimated gas fees</p>
          <EditPriorityModal />
        </div>
        <div class="d-flex flex-column">
          <div
            class="mt-3"
            style="font-size: 13px; text-align: right; font-weight: 500;"
          >
            0.0007986
          </div>
          <div
            class="mt-3"
            style="font-size: 13px; text-align: right; font-weight: 500;"
          >
            <strong>0.000797 LYXt</strong>
          </div>
          <div
            class="mt-3"
            style="font-size: 13px; text-align: right; font-weight: 500;"
          >
            Max fee: 0.00083974 LYXt
          </div>
        </div>
      </v-col>
      <v-col v-if="step === 2" cols="12" class="grow d-flex align-center pl-0">
        <hr />
      </v-col>
      <v-col v-if="step === 2" cols="12" class="d-flex flex-column py-0">
        <div class="d-flex justify-space-between">
          <p style="font-size: 15px; font-weight: 600; font-weight: 500;">
            Total
          </p>
        </div>
        <div class="d-flex justify-space-between mt-3">
          <p style="font-size: 15px; font-weight: 600;">Amount</p>
          <p style="font-size: 15px; font-weight: 600;">
            {{ amount }} {{ ' ' + tokenSymbol }}
          </p>
        </div>
        <div class="d-flex justify-space-between">
          <p style="font-size: 15px; font-weight: 600;">Gas fees</p>
          <p style="font-size: 15px; font-weight: 600;">
            {{ parseGasFee }} {{ ' ' + currentNetwork.ticker }}
          </p>
        </div>
        <div class="d-flex justify-space-between">
          <p style="font-size: 15px; font-weight: 800; text-align: left;">
            Amount + Gas fees
          </p>
          <p style="font-size: 15px; font-weight: 800; text-align: right;">
            {{ calculateAmount() }}
          </p>
        </div>
      </v-col>
      <v-col v-if="step === 2" cols="12" class="grow d-flex align-center pl-0">
        <hr />
      </v-col>
    </v-row>
    <v-row v-if="step < 2">
      <v-col cols="6" class="pt-1">
        <v-btn text @click="close()" class="cancel-btn">Cancel</v-btn>
      </v-col>
      <v-col cols="6" class="pt-1">
        <v-btn text @click="nextStep()" class="advance-btn">Next</v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="6" class="pt-1">
        <v-btn text @click="step = step - 1" class="cancel-btn">Reject</v-btn>
      </v-col>
      <v-col cols="6" class="pt-1">
        <!-- <v-btn text @click="send()" :loading="isLoading" class="advance-btn">
          Confirm
        </v-btn> -->

        <SendTransactionStateModal
          :disabled="!isSufficientAmount()"
          :loading="isLoading"
          :success="sendState"
          :recipientAddress="toAddress"
          :assetTitle="currentAsset.tokenName"
          @click="send()"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletState from '../components/WalletState'
import ArrowBack from '../images/icon-arrow-back.vue'
import SendTransactionStateModal from './SendTransactionStateModal.vue'
import IconCreateVault from '../images/icons/icon-createVault.vue'
import Web3 from 'web3'

import { ethers } from 'ethers'

import { mapGetters, mapState } from 'vuex'

export default {
  components: {
    WalletState,
    ArrowBack,
    SendTransactionStateModal,
    IconCreateVault,
  },
  async mounted() {},
  methods: {
    isLukso() {
      return this.chainId === '2828'
    },
    getAssetId(asset) {
      if (asset.tokenId)
        return ' #' + this.$options.filters.truncate(asset.tokenId, 12, '...')
    },
    calculateAmount() {
      if (this.tokenType === 'native') {
        return (
          Web3.utils.fromWei(
            Web3.utils
              .toBN(this.baseGasFee)
              .add(Web3.utils.toBN(Web3.utils.toWei(this.amount)))
              .toString(),
          ) +
          ' ' +
          this.currentNetwork.ticker
        )
      } else {
        return (
          this.amount +
          ' ' +
          this.tokenSymbol +
          ' + ' +
          this.parseGasFee +
          ' ' +
          this.currentNetwork.ticker
        )
      }
    },
    deleteRecipientAddress() {
      if (this.step == 0) {
        this.toAddress = ''
        this.recipientVaultSelected = {}
      }
    },
    isValidAddress() {
      return (
        this.validateAddress(this.toAddress).isValid ||
        this.validateAddress(this.recipientVaultSelected.address).isValid
      )
    },
    isSufficientAmount() {
      console.log(this.amount)
      return ethers.utils
        .parseUnits(this.amount.toString())
        .lte(ethers.utils.parseUnits(this.currentAsset.balanceOf.toString()))
    },
    async nextStep() {
      console.log('selectedAsset', this.selectedAsset, this.step)
      if (this.step == 0 && this.selectedAsset) {
        this.$store.commit('setCurrentAsset', this.selectedAsset)
      }
      await this.$nextTick()

      if (
        (this.isValidAddress() && this.step === 0 && this.currentAsset) ||
        (this.amount && this.step === 1)
      )
        this.step++
    },
    setMaxAmount() {
      //get amount of currentAsset token or selectedToken and set to that amount
      this.amount = this.currentAsset.balanceOf
    },
    close() {
      this.$store.commit('setCurrentAsset', null)
      this.$store.commit('showSendAssetModal', false)
    },

    async send() {
      try {
        this.isLoading = true

        console.log(this.currentAsset)
        if (this.currentAsset.assetType.isLSP7) {
          let transferLSP7Token = await this.$store.dispatch(
            'lukso/transferLSP7Token',
            {
              toAccountAddress:
                this.toAddress || this.recipientVaultSelected.address, // this.toAccountAddress,
              tokenAddress: this.currentAsset.assetAddress,
              amount: this.amount,
            },
          )
          console.log('transferLSP7Token', transferLSP7Token)
        } else if (this.currentAsset.assetType.isLSP8) {
          let transferLSP8Token = await this.$store.dispatch(
            'lukso/transferLSP8Token',
            {
              toAccountAddress:
                this.toAddress || this.recipientVaultSelected.address, // this.toAccountAddress,
              tokenAddress: this.currentAsset.assetAddress,
              tokenId: this.currentAsset.tokenId || this.tokenId,
            },
          )
          console.log('transferLSP8Token', transferLSP8Token)
        }
        this.sendState = 'success'
      } catch (err) {
        console.err(err)
        this.sendState = 'error'
        // show unsuccess screen
      } finally {
        // show success screen

        this.isLoading = false
      }

      // this.openViewActivityModal();
    },

    openViewActivityModal() {
      this.$store.commit('showViewActivityModal', true)
      this.$store.commit('showSendAssetModal', false)
    },
  },
  computed: {
    ...mapGetters(['address', 'showSendAssetModal', 'assets', 'currentVault']),
    ...mapState({
      currentAsset: 'currentAsset',
      walletAddress: 'address',
      domainENS: 'domainENS',
    }),
    ...mapGetters('networks', ['currentNetwork']),
    ...mapGetters('lukso', ['vaultList']),
    ...mapState('lukso', {
      currentDisplayAddress: 'currentDisplayAddress',
      UPAddress: 'UPAddress',
    }),
    getCurrentDisplayAddressName() {
      return this.vaultList.find(
        (v) => v.address === this.currentDisplayAddress,
      )?.name
    },
    tokenSymbol() {
      return this.currentAsset.tokenSymbol
    },
    amountPrefix() {
      if (this.currentAsset)
        return this.currentAsset.assetType.isLSP7 ||
          this.currentAsset.assetType.native
          ? 'Balance: '
          : 'Amount: '
    },
    parseGasFee() {
      return ethers.utils.formatUnits(ethers.BigNumber.from(this.baseGasFee))
    },
  },

  data() {
    return {
      tokenType: '',
      baseGasFee: 5_000_000,
      sendState: null,
      isLoading: false,
      amount: 1,
      tokenId: '',
      step: 0,
      toAddress: '',
      recipientAddress: '',
      recipientVaultSelected: {},
      showVaults: false,
      selectedAsset: null,
      TokenAmountRule: [
        (v) => this.isSufficientAmount(v) === true || 'Insufficient funds',
      ],
    }
  },
}
</script>

<style lang="scss">
.simple-text {
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--charcoal-grey);
}
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

.vault-list-item.disabled {
  pointer-events: none;
}
</style>
