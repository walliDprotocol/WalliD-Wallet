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
        <div class="back-arrow mb-3">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ $t('modals.delete.title') }}
            {{ type }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="pt-1">
        <p
          class="sub-title-fields text-left"
          v-html="$t('modals.delete.text[0]', [name])"
        ></p>
        <p class="sub-title-fields text-left">
          {{ $t('modals.delete.text[1]') }}
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
</style>
