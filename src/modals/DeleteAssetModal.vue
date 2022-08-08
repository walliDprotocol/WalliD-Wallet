<template>
  <v-container class="modal delete-modal pa-5">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-3">
          <v-btn text @click="close()" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ 'Delete ' + asset.assetType }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="pt-1">
        <p class="sub-title-fields text-left">
          {{ 'Are you sure you want to delete ' + assetTitle + '?' }}
        </p>
      </v-col>

      <v-col cols="6" class="pt-1">
        <v-btn text @click="close()" class="cancel-btn">
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="6" class="pt-1">
        <v-btn text @click="confirmDelete()" class="advance-btn">
          Delete
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

import { mapGetters } from 'vuex'
import { DELETE_CARD, DELETE_CRED, DELETE_PROFILE } from '../store/actions'

export default {
  props: ['asset'],
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
    assetTitle() {
      if (
        this.asset.assetType === 'Fungible Token' ||
        this.asset.assetType === 'NFT'
      ) {
        return this.asset.tokenName
      } else if (this.asset.assetType === 'Legacy ID') {
        return this.asset.idName
      } else if (this.asset.assetType === 'Web2 ID') {
        return this.asset.socialmedia
      } else if (this.asset.assetType === 'Web3 ID') {
        return this.asset.titleField
      }
    },
  },
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

      this.$store.commit('showDeleteConfirmation', false)
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
