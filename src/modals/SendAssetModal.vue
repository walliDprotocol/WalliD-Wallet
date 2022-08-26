<template>
  <v-container class="modal send-asset">
    <v-row>
      <v-col cols="12" class="">
        <div class="back-arrow my-4">
          <v-btn text @click="close()" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ 'Send ' + (currentAssetComputed.tokenName || '') }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-card class="form-card py-4">
      <v-row>
        <v-col
          v-if="step > 0 || currentAssetComputed.tokenSymbol"
          cols="12"
          class="d-flex mb-3 py-3"
          style="background-color: #f7f7f7"
        >
          <v-col cols="auto" class="pa-0 d-flex align-center">
            <v-img
              height="50"
              max-width="50"
              contain
              :src="currentAssetComputed.assetImagePath"
            />
          </v-col>
          <v-col
            cols="auto"
            class="grow pa-0 ml-3 d-flex flex-column justify-center"
          >
            <div class="d-flex justify-space-between">
              <p class="sub-title-fields sub-title-fields--bold">
                {{ currentAssetComputed.tokenName }}
              </p>
            </div>
            <div class="d-flex align-center justify-space-between">
              <p class="sub-title-fields d-flex">
                {{ amountPrefix }}
                {{ currentAssetComputed.balanceOf }}
              </p>
            </div>
          </v-col>
        </v-col>
        <v-col
          v-if="step === 2"
          cols="12"
          class="d-flex align-center py-3"
          style="background-color: #f7f7f7"
        >
          <div class="mr-3 d-flex align-center justify-space-between">
            <jazz-icon
              v-if="!recipientVaultSelected"
              :address="walletAddress"
              :id="'first'"
              :size="40"
              :margin="0"
            />
            <jazz-icon
              v-else-if="getCurrentDisplayAddressName === 'Uni. Profile'"
              :address="isLukso ? currentDisplayAddress : walletAddress"
              :id="'second'"
              :size="40"
              :margin="0"
            />
            <IconCreateVault v-else width="40px" height="40px" />
          </div>
          <div class="mr-3" style="font-size: 13px; font-weight: 500">
            {{ getCurrentDisplayAddressName }}
          </div>
          <v-spacer />

          <div class="mx-3">
            <v-img
              width="18"
              height="18"
              src="../images/icons/icon-transfer.png"
            ></v-img>
          </div>
          <v-spacer />
          <div class="mx-3 d-flex align-center">
            <jazz-icon
              v-if="!recipientVaultSelected.name"
              :address="toAddress"
              :id="'third'"
              :size="40"
              :margin="0"
            />
            <jazz-icon
              v-else-if="recipientVaultSelected.name === 'Uni. Profile'"
              :address="isLukso ? currentDisplayAddress : walletAddress"
              :id="'fourth'"
              :size="40"
              :margin="0"
            />
            <IconCreateVault width="40px" height="40px" v-else />
          </div>
          <div style="font-size: 13px; font-weight: 500">
            {{
              (recipientVaultSelected.name || toAddress) | truncate(8, '...')
            }}
          </div>
        </v-col>
        <v-col
          v-if="step === 0 && !currentAssetComputed.tokenSymbol"
          cols="12"
          class="py-0 mr-0 align-center"
        >
          <p class="sub-title-fields text-left mb-3">Asset</p>
          <v-select
            class="pa-0 mb-6"
            :items="sendableAssets"
            v-model="selectedAsset"
            color="#009fb1"
            outlined
            dense
            append-icon="mdi-chevron-down"
            :menu-props="{
              maxHeight: 304,
            }"
            hide-details="auto"
            placeholder="Select an asset to send"
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
          style="position: relative"
        >
          <p class="sub-title-fields text-left mb-3">To</p>
          <v-text-field
            dense
            outlined
            :disabled="step > 0 || recipientVaultSelected.name"
            hide-details
            :spellcheck="false"
            class="wallet-text-field pa-0 mb-6"
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
                  v-if="step < 2"
                  style="cursor: pointer"
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
          style="position: relative; margin-bottom: 18px"
        >
          <p class="sub-title-fields text-left mb-3">To</p>
          <div
            class="d-flex align-center py-1"
            style="background-color: #f7f7f7"
          >
            <IconCreateVault style="max-width: 30px; margin-inline: 12px" />
            <div class="d-flex flex-column flex-grow">
              <p
                style="
                  font-size: 13px !important;
                  font-weight: 700 !important;
                  text-align: left;
                "
              >
                {{ recipientVaultSelected.name }}
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
          <p
            class="sub-title-fields text-left mr-3"
            style="white-space: nowrap"
          >
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
            v-for="vault in filteredVaults"
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
              <div class="mr-3 d-flex align-center">
                <IconCreateVault v-if="vault.name !== 'Uni. Profile'" />
                <jazz-icon
                  v-else
                  class="ma-0"
                  :address="isLukso ? currentDisplayAddress : walletAddress"
                  :id="'fifth'"
                  :size="35"
                  :margin="0"
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
          style="position: relative"
        >
          <p class="sub-title-fields text-left mb-3">Amount</p>
          <v-text-field
            v-model="amount"
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
                style="font-size: 15px; font-weight: 500; line-height: 18px"
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
            <p style="font-size: 15px; font-weight: 600">Estimated gas fees</p>
            <EditPriorityModal />
          </div>
          <div class="d-flex flex-column">
            <div
              class="mt-3"
              style="font-size: 13px; text-align: right; font-weight: 500"
            >
              0.0007986
            </div>
            <div
              class="mt-3"
              style="font-size: 13px; text-align: right; font-weight: 500"
            >
              <strong>0.000797 LYXt</strong>
            </div>
            <div
              class="mt-3"
              style="font-size: 13px; text-align: right; font-weight: 500"
            >
              Max fee: 0.00083974 LYXt
            </div>
          </div>
        </v-col>
        <v-col
          v-if="step === 2"
          cols="12"
          class="grow d-flex align-center pl-0"
        >
          <hr />
        </v-col>
        <v-col v-if="step === 2" cols="12" class="d-flex flex-column py-0">
          <div class="d-flex justify-space-between mt-3">
            <p style="font-size: 15px; font-weight: 500">Amount</p>
            <p style="font-size: 15px; font-weight: 500">
              {{ amount }} {{ ' ' + tokenSymbol }}
            </p>
          </div>
          <div class="d-flex justify-space-between mt-3">
            <p style="font-size: 15px; font-weight: 500">Gas fees</p>
            <p style="font-size: 15px; font-weight: 500">
              {{ parseGasFee }} {{ ' ' + currentNetwork.ticker }}
            </p>
          </div>
          <div class="d-flex justify-space-between mt-3">
            <p
              style="
                font-size: 15px;
                font-weight: 600;
                text-align: left;
                white-space: nowrap;
                margin-right: 2rem;
              "
            >
              Amount + gas fees
            </p>
            <p style="font-size: 15px; font-weight: 600; text-align: right">
              {{ calculateAmount() }}
            </p>
          </div>
        </v-col>
        <v-col
          v-if="step === 2"
          cols="12"
          class="grow d-flex align-center pl-0"
        >
          <hr />
        </v-col>
      </v-row>
    </v-card>
    <v-row v-if="step < 2" class="float">
      <v-col cols="6" class="pt-1">
        <v-btn text @click="close()" class="cancel-btn">Cancel</v-btn>
      </v-col>
      <v-col cols="6" class="pt-1">
        <v-btn text @click="nextStep()" class="advance-btn">Next</v-btn>
      </v-col>
    </v-row>
    <v-row v-else class="align-end float">
      <v-col cols="6" class="pt-1">
        <v-btn text @click="backStep()" class="cancel-btn">Reject</v-btn>
      </v-col>
      <v-col cols="6" class="pt-1">
        <!-- <v-btn text @click="send()" :loading="isLoading" class="advance-btn">
          Confirm
        </v-btn> -->

        <SendTransactionStateModal
          :disabled="!isSufficientAmount()"
          :loading="isLoading"
          :success="sendState"
          :recipientAddress="toAddress || recipientVaultSelected.address"
          :assetTitle="currentAssetComputed.tokenName"
          :txHash="txHash"
          @click="send()"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletState from '../components/WalletState';
import ArrowBack from '../images/icon-arrow-back.vue';
import SendTransactionStateModal from './SendTransactionStateModal.vue';
import IconCreateVault from '../images/icons/icon-createVault.vue';
import Web3 from 'web3';

import { ethers } from 'ethers';

import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    WalletState,
    ArrowBack,
    SendTransactionStateModal,
    IconCreateVault,
  },
  async mounted() {
    if (this.currentAsset?.assetType?.isLSP8) this.setMaxAmount();
  },
  methods: {
    isLukso() {
      return this.chainId === '2828';
    },
    getAssetId(asset) {
      if (asset.tokenId)
        return ' #' + this.$options.filters.truncate(asset.tokenId, 12, '...');
    },
    calculateAmount() {
      if (this.tokenType === 'native') {
        return (
          Web3.utils.fromWei(
            Web3.utils
              .toBN(this.baseGasFee)
              .add(Web3.utils.toBN(Web3.utils.toWei(this.amount)))
              .toString()
          ) +
          ' ' +
          this.currentNetwork.ticker
        );
      } else {
        return (
          this.amount +
          ' ' +
          this.tokenSymbol +
          ' + ' +
          this.parseGasFee +
          ' ' +
          this.currentNetwork.ticker
        );
      }
    },
    deleteRecipientAddress() {
      if (this.step < 2) {
        this.toAddress = '';
        this.recipientVaultSelected = {};
        this.step = 0;
      }
    },
    isValidAddress() {
      return (
        this.validateAddress(this.toAddress).isValid ||
        this.validateAddress(this.recipientVaultSelected.address).isValid
      );
    },
    isSufficientAmount() {
      console.log(this.amount);
      return ethers.utils
        .parseUnits(this.amount.toString())
        .lte(ethers.utils.parseUnits(this.currentAsset.balanceOf.toString()));
    },
    async nextStep() {
      console.log('selectedAsset', this.selectedAsset, this.step);
      if (this.step == 0 && this.selectedAsset) {
        this.$store.commit('setCurrentAsset', this.selectedAsset);
      }
      await this.$nextTick();

      if (this.isValidAddress() && this.currentAsset?.assetType?.isLSP8) {
        this.step = 2;
        return;
      }

      if (
        (this.isValidAddress() && this.step === 0 && this.currentAsset) ||
        (this.amount && this.step === 1)
      )
        this.step++;
    },
    backStep() {
      if (this.currentAsset?.assetType?.isLSP8) return (this.step = 0);
      this.step--;
    },
    setMaxAmount() {
      //get amount of currentAsset token or selectedToken and set to that amount
      this.amount = this.currentAsset.balanceOf;
    },
    close() {
      this.$store.commit('setCurrentAsset', null);
      this.$store.commit('showSendAssetModal', false);
    },

    async send() {
      try {
        this.isLoading = true;

        console.log(this.currentAsset);
        if (this.currentAsset.assetType.isLSP7) {
          let transferLSP7Token = await this.$store.dispatch(
            'lukso/transferLSP7Token',
            {
              toAccountAddress:
                this.toAddress || this.recipientVaultSelected.address, // this.toAccountAddress,
              tokenAddress: this.currentAsset.assetAddress,
              amount: this.amount,
            }
          );
          console.log('transferLSP7Token', transferLSP7Token);
          this.txHash = transferLSP7Token.transactionHash;
        } else if (this.currentAsset.assetType.isLSP8) {
          let transferLSP8Token = await this.$store.dispatch(
            'lukso/transferLSP8Token',
            {
              toAccountAddress:
                this.toAddress || this.recipientVaultSelected.address, // this.toAccountAddress,
              tokenAddress: this.currentAsset.assetAddress,
              tokenId: this.currentAsset.tokenId || this.tokenId,
            }
          );
          console.log('transferLSP8Token', transferLSP8Token);
          this.txHash = transferLSP8Token.transactionHash;
        }
        this.sendState = 'success';
      } catch (err) {
        console.err(err);
        this.sendState = 'error';
        // show unsuccess screen
      } finally {
        // show success screen

        this.isLoading = false;
      }

      // this.openViewActivityModal();
    },

    openViewActivityModal() {
      this.$store.commit('showViewActivityModal', true);
      this.$store.commit('showSendAssetModal', false);
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
    currentAssetComputed() {
      return this.currentAsset && Object.keys(this.currentAsset).length > 0
        ? this.currentAsset
        : {};
    },
    sendableAssets() {
      return this.assets.filter(({ assetType }) => {
        return assetType.isLSP8 || assetType.isLSP7;
      });
    },
    filteredVaults() {
      return this.vaultList.filter(({ address }) => {
        return address !== this.currentDisplayAddress;
      });
    },
    getCurrentDisplayAddressName() {
      return this.vaultList.find(
        (v) => v.address === this.currentDisplayAddress
      )?.name;
    },
    tokenSymbol() {
      return this.currentAsset?.tokenSymbol;
    },
    amountPrefix() {
      if (this.currentAsset)
        return this.currentAsset.assetType.isLSP7 ||
          this.currentAsset.assetType.native
          ? 'Balance: '
          : 'Amount: ';
    },
    parseGasFee() {
      return ethers.utils.formatUnits(ethers.BigNumber.from(this.baseGasFee));
    },
  },

  data() {
    return {
      txHash: null,
      tokenType: '',
      baseGasFee: 5_000_000,
      sendState: null,
      isLoading: false,
      amount: '',
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
    };
  },
};
</script>

<style lang="scss">
.wallet-text-field {
  &.v-input--is-disabled {
    .v-input__control {
      background-color: #f7f7f7;
    }
    fieldset {
      border-color: transparent !important;
    }
  }
}

.simple-text {
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--charcoal-grey);
}

#metamask-logo-details {
  max-height: 83px;
  max-width: 83px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
  margin-top: -35px;
}

.send-asset {
  overflow: hidden;
  .row.float {
    position: fixed !important;
    bottom: 16px !important;
    width: 100%;
  }
  .v-card.form-card {
    box-shadow: none !important;
    overflow: hidden;
    overflow-y: auto;
    max-height: 380px;
    width: 100%;
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
