<template>
  <v-container class="modal details-wallet">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-4">
          <v-btn text @click="close()" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ 'Send' + (currentCred ? currentCred.tokenName : '') }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pr-0 mr-0 align-center">
        <p class="sub-title-fields text-left mb-3">
          Asset
        </p>
        <v-select
          class="pa-0 mb-6"
          :items="[1, 2]"
          v-model="idt"
          color="#009fb1"
          outlined
          dense
          append-icon="x"
          :menu-props="{
            maxHeight: 304,
          }"
          hide-details
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
      </v-col>
      <v-col cols="12">
        <p class="sub-title-fields text-left mb-3">
          To
        </p>
        <v-text-field
          dense
          outlined
          hide-details
          class="pa-0 mb-6"
        ></v-text-field>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script>
import WalletAddress from '../components/WalletAddress'
import WalletState from '../components/WalletState'
import ArrowBack from '../images/icon-arrow-back.vue'

import { mapGetters, mapState } from 'vuex'

export default {
  components: {
    WalletAddress,
    WalletState,
    ArrowBack,
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['address', 'showSendAssetModal', 'currentCred']),
    ...mapState({
      walletAddress: 'address',
      domainENS: 'domainENS',
    }),
    close() {
      this.$store.commit('showSendAssetModal', false)
    },
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
</style>
