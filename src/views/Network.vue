<template>
  <v-container class="modal delete-modal pa-5">
    <v-app-bar height="74" flat app class="plugin-header">
      <v-img
        height="50"
        max-width="50"
        contain
        src="../images/logos/logo-wallid.png"
      />
      <h1 class="T2 ml-5">
        Sync with {{ currentNetwork.name | truncate(16) }}
      </h1>

      <div class="arrow-down-header"></div>
    </v-app-bar>
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-3 d-flex justify-center">
          <h2 class="T1 text-center">
            Allow WalliD wallet to sync
            <br />
            with {{ currentNetwork.name }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="pt-1">
        <p class="sub-title-fields text-center">
          WalliD will fetch your Universal Profile and access the assets within.
          <br />
          <br />
          If you don't have a Universal Profile,
          <br />
          WalliD wallet will create a smart contract for your wallet address.
        </p>
      </v-col>
      <v-col cols="12" style="margin-bottom: 130px;">
        <div class="d-flex align-center flex-column">
          <div class="d-flex align-center">
            <div style="position: relative;">
              <v-img
                height="50"
                max-width="50"
                contain
                src="../images/logos/logo-wallid.png"
              />
              <p
                class="sub-title-fields"
                style="
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translate(-50%, 100%);
                  padding-top: 9px;
                "
              >
                WalliD wallet
              </p>
            </div>
            <hr />
            <div style="position: relative;">
              <v-img
                v-if="currentNetwork.name === 'Ethereum Mainnet'"
                height="50"
                max-width="50"
                contain
                src="../images/logos/logo-ethereum.png"
              />
              <v-img
                v-if="currentNetwork.name === 'Rinkeby Test Network'"
                height="50"
                max-width="50"
                contain
                src="../images/logos/logo-ethereum.png"
              />
              <v-img
                v-if="currentNetwork.name === 'Polygon Mainnet'"
                height="50"
                max-width="50"
                contain
                src=""
              />
              <v-img
                v-if="currentNetwork.name === 'Mumbai Testnet'"
                height="50"
                max-width="50"
                contain
                src=""
              />
              <v-img
                v-if="currentNetwork.name === 'Lukso Mainnet'"
                height="50"
                max-width="50"
                contain
                src="../images/logos/logo-l16PublicTestnet.png"
              />
              <v-img
                v-if="currentNetwork.name === 'L16 Public Testnet'"
                height="50"
                max-width="50"
                contain
                src="../images/logos/logo-l16PublicTestnet.png"
              />
              <v-img
                v-else="currentNetwork.name === 'Localhost Net'"
                height="50"
                max-width="50"
                contain
                src="../images/logos/logo-wallid.png"
              />
              <p
                class="sub-title-fields"
                style="
                  position: absolute;
                  bottom: 0;
                  right: 50%;
                  transform: translate(50%, 100%);
                  padding-top: 9px;
                  width: 92px;
                "
              >
                {{ currentNetwork.name }}
              </p>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="6">
        <v-btn text @click="close()" class="cancel-btn">
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn text @click="confirmDelete()" class="advance-btn">
          Sync
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletAddress from '../components/WalletAddress'
import WalletState from '../components/WalletState'
import ArrowBack from '../images/icon-arrow-back.vue'

import IDCard from '../components/IDCard'

import { mapGetters, mapState } from 'vuex'
import { DELETE_CARD, DELETE_CRED, DELETE_PROFILE } from '../store/actions'

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
    ...mapState('networks', ['currentNetwork', 'network']),
    name() {
      if (this.credential) {
        return this.credential.credName || this.credential.assetName
      } else if (this.profile) {
        return this.profile.socialName
      } else if (this.card) {
        return this.card.idtName
      } else {
        return null
      }
    },
    type() {
      if (this.credential?.assetName) {
        return this.$t('modals.delete.web3Id')
      } else if (this.credential) {
        return this.$t('modals.delete.credential')
      } else if (this.profile) {
        return this.$t('modals.delete.profile')
      } else if (this.card) {
        return this.$t('modals.delete.card')
      } else {
        return null
      }
    },
  },
  created() {
    if (this.credential) {
      console.log(this.credential)
    } else if (this.profile) {
      console.log(this.profile)
    } else if (this.card) {
      console.log(this.card)
    }
  },
  mounted() {},
  methods: {
    confirmDelete() {
      if (this.credential) {
        this.$store
          .dispatch(DELETE_CRED, this.credential.id)
          .then(() => this.close())
          .catch((e) => {
            console.error(e)
          })
      } else if (this.profile) {
        console.log(this.profile)
        this.$store
          .dispatch(DELETE_PROFILE, this.profile.id)
          .then(() => this.close())
          .catch((e) => {
            console.error(e)
          })
      } else if (this.card) {
        console.log(this.card)
        this.$store
          .dispatch(DELETE_CARD, this.card.idt)
          .then(() => this.close())
          .catch((e) => {
            console.error(e)
          })
      }
    },
    close() {
      this.$store.commit('currentProfile', null)
      this.$store.commit('setCurrentCred', null)
      this.$store.commit('setCurrentCard', null)

      this.$emit('close')
    },
  },
  data() {
    return {}
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

hr {
  border: none;
  border-top: 1px dashed #b8b9bb;
  min-width: 91px;
}
</style>
