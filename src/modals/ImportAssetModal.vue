<template>
  <v-container class="modal delete-modal pa-5">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-3">
          <v-btn text @click="close()" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ 'Import ' + (assetType === 'NFT' ? 'NFT' : 'custom Token') }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="py-0">
        <v-form ref="form" v-model="valid" lazy-validation>
          <p class="sub-title-fields text-left mb-3">
            {{
              assetType === 'NFT' ? 'Token standard' : 'Token Contract Address'
            }}
          </p>
          <v-select
            class="pa-0 mb-6"
            v-if="assetType === 'NFT'"
            :items="tokenStandards"
            v-model="idt"
            color="#009fb1"
            outlined
            dense
            append-icon="x"
            :menu-props="{
              maxHeight: 304,
            }"
            :rules="TokenStandardRules"
            hide-details="auto"
          >
            <template
              v-slot:selection="{
                item,
              }"
            >
              <div class="d-flex simple-text">
                <p class="d-block mb-0 ml-3">
                  {{ item }}
                </p>
              </div>
            </template>
          </v-select>
          <v-text-field
            v-else
            dense
            outlined
            :rules="TokenContractRules"
            hide-details="auto"
            class="pa-0 mb-6"
          ></v-text-field>
          <p class="sub-title-fields text-left mb-3">
            {{
              assetType === 'NFT' ? 'Smart contract address' : 'Token Symbol'
            }}
          </p>
          <v-text-field
            dense
            outlined
            :rules="SmartContractRules"
            hide-details="auto"
            class="pa-0 mb-6"
            v-if="assetType === 'NFT'"
          ></v-text-field>
          <v-text-field
            dense
            outlined
            :rules="TokenSymbolRules"
            hide-details="auto"
            class="pa-0 mb-6"
            v-else
          ></v-text-field>
          <p class="sub-title-fields text-left mb-3">
            {{ assetType === 'NFT' ? '#ID' : 'Token Decimal' }}
          </p>
          <v-text-field
            dense
            outlined
            :rules="IDRules"
            hide-details="auto"
            class="pa-0 mb-6"
            v-if="assetType === 'NFT'"
          ></v-text-field>
          <v-text-field
            dense
            outlined
            :rules="TokenDecimalRules"
            hide-details="auto"
            class="pa-0 mb-6"
            v-else
          ></v-text-field>
          <v-row>
            <v-col cols="6" class="pt-1">
              <v-btn text @click="close()" class="cancel-btn">
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6" class="pt-1">
              <v-btn text @click="validate" class="advance-btn">
                Import
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletAddress from '../components/WalletAddress'
import WalletState from '../components/WalletState'
import ArrowBack from '../images/icon-arrow-back.vue'

import IDCard from '../components/IDCard'

import { mapGetters } from 'vuex'
import { DELETE_CARD, DELETE_CRED, DELETE_PROFILE } from '../store/actions'
import { isValidAddress } from '../../dist/scripts/background.bundle'

export default {
  components: {
    WalletAddress,
    WalletState,
    ArrowBack,
    IDCard,
  },
  computed: {
    ...mapGetters({
      credential: 'currentCred',
      profile: 'currentProfile',
      card: 'currentCard',
    }),
  },
  data() {
    return {
      valid: true,
      tokenStandards: ['LSP8', 'ERC-1155', 'ERC-721'],
      TokenStandardRules: [
        (v) => !!v || 'Please select a protocol standard',
        (v) =>
          this.isValidContractAddress(v) ||
          'Collectible address must be a valid address',
      ],
      TokenContractRules: [
        (v) => !!v || 'Token address can’t be empty',
        (v) => !!v || 'Invalid Address',
        (v) => !!v || 'Token has already been added',
      ],
      SmartContractRules: [
        (v) =>
          !!v ||
          this.isValidCollectibleAddress(v) === true ||
          'Collectible address must be a valid address',
        (v) =>
          this.isPersonalAddress(v) === false ||
          'Personal address detected. Input the collectible contract address',
      ],
      TokenSymbolRules: [
        (v) => !!v || 'Token symbol can’t be empty',
        (v) => (v && v.length <= 11) || 'Symbol must be 11 characters or fewer',
      ],
      IDRules: [(v) => !!v || 'Collectible ID required'],
      TokenDecimalRules: [(v) => !!v || 'Token decimal required'],
    }
  },
  methods: {
    close() {
      this.$store.commit('showImportAssetModal', false)
    },
    assetType() {
      if (currentCred) return currentCred.assetType
    },
    validate() {
      this.$refs.form.validate()
    },
    isValidContractAddress(v) {
      return false
    },
    isValidCollectibleAddress(v) {
      return false
    },
    isPersonalAddress(v) {
      return true
    },
  },
}
</script>

<style lang="scss">
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
</style>
